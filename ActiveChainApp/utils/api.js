var util = require('./util.js')
let userOpenId = ''
let userInfo = {}
let hasUserInfo = false
let userPass = false

let coeff = {
  "male_coeff": 2,
  "female_coeff": 3,
  "fit_coeff": 1,
  "fat_coeff": 1.5,
  "fit_fat": 75,
}
let sportsIndexDef = {
  "badminton": 1,
  "basketball": 1,
  "bicycle": 1,
  "football": 1,
  "gym": 1,
  "pingpong": 1,
  "running": 1,
  "swimming": 1,
  "walking": 0.5
}

wx.cloud.init()
const db = wx.cloud.database()

const serverPrefix = () => {
  return "https://dimitrid.club/ac_backend"
}

const userQuery = (uoid, callback) => {
  console.log("userUqery")
  db.collection("wx_user").where({
    wxUid: uoid
  }).get({
    success: res => {
      console.log(res.data[0])
      callback(res.data[0])
    },
    fail: err => {
      callback(null)
    }
  })
}

const userUpdate = (wxUid, wxNickname, wxAvatarurl, uNickname, uGender, uWeight, uPrivacy, callback) => {
  db.collection("wx_user").where({
    "wxUid": wxUid
  }).get({
    success: res => {
      console.log("userUpdate Check ...")
      console.log(res)
      if (res.data.length == 0) {
        db.collection("wx_user").add({
          data: {
            "wxUid": wxUid,
            "wxNickname": wxNickname,
            "wxAvatarurl": wxAvatarurl,
            "uNickname": uNickname,
            "uGender": uGender,
            "uWeight": uWeight,
            "uPrivacy": uPrivacy
          },
          success: res => {
            console.log("用户新增成功")
          },
          fail: err => {
            console.log("用户新增失败")
          }
        })
      } else {
        db.collection("wx_user").doc(res.data[0]["_id"]).update({
          data: {
            "wxUid": wxUid,
            "wxNickname": wxNickname,
            "wxAvatarurl": wxAvatarurl,
            "uNickname": uNickname,
            "uGender": uGender,
            "uWeight": uWeight,
            "uPrivacy": uPrivacy
          },
          success: res => {
            console.log("用户更新成功")
          },
          fail: err => {
            console.log("用户更新失败")
          }
        })
      }
    },
    fail: err => {

    }
  })

  // wx.request({
  //   url: serverPrefix() + '/user/update',
  //   method: 'POST',
  //   header: {
  //     'content-type': 'application/x-www-form-urlencoded' // 默认值
  //   },
  //   data: {
  //     "wxUid": wxUid,
  //     "wxNickname": wxNickname,
  //     "wxAvatarurl": wxAvatarurl,
  //     "uNickname": uNickname,
  //     "uGender": uGender,
  //     "uWeight": uWeight,
  //     "uPrivacy": uPrivacy
  //   },
  //   success(res) {
  //     callback(res.data)
  //   },
  //   fail() {
  //     callback(null)
  //   }
  // })
}

const statMStat = (uoid, callback) => {
  console.log("INPUT - " + uoid)
  const $ = db.command.aggregate
  let ret = {}
  ret.marking = 0
  ret.markingLast = 0
  ret.rank = 1
  ret.rankLast = 1
  var df = new Date()
  var dt = new Date()
  df.setDate(1)
  console.log("this - " + util.formatDate(df) + " | " + util.formatDate(dt))
  // 查询汇总当前用户本月积分
  db.collection("ac_info").aggregate().match({
    wxUid: uoid,
    acDate: db.command.gte(util.formatDate(df)).and(db.command.lte(util.formatDate(dt))),
  }).limit(200).end().then(res => {
    for (var i = 0; i < res.list.length; i++) {
      ret.marking += res.list[i].marking
    }
    // 查询汇总当前用户本月排名
    db.collection("ac_info").aggregate().match({
      acDate: db.command.gte(util.formatDate(df)).and(db.command.lte(util.formatDate(dt))),
    }).group({
      _id: "$wxUid",
      markingT: $.sum("$marking")
    }).limit(200).end().then(res => {
      for (var i = 0; i < res.list.length; i++) {
        console.log(res.list[i])
        if (res.list[i].markingT > ret.marking) ret.rank = ret.rank + 1
      }
      // 查询汇总当前用户上月积分
      df.setDate(1)
      df.setMonth(df.getMonth() - 1)
      dt.setDate(1)
      dt.setDate(dt.getDate() - 1)
      console.log("last - " + util.formatDate(df) + " | " + util.formatDate(dt))
      db.collection("ac_info").aggregate().match({
        wxUid: uoid,
        acDate: db.command.gte(util.formatDate(df)).and(db.command.lte(util.formatDate(dt))),
      }).limit(200).end().then(res => {
        for (var i = 0; i < res.list.length; i++) {
          ret.markingLast += res.list[i].marking
        }
        // 查询汇总当前用户上月排名
        db.collection("ac_info").aggregate().match({
          acDate: db.command.gte(util.formatDate(df)).and(db.command.lte(util.formatDate(dt))),
        }).group({
          _id: "$wxUid",
          markingTLast: $.sum("$marking")
        }).limit(200).end().then(res => {
          for (var i = 0; i < res.list.length; i++) {
            if (res.list[i].markingTLast > ret.markingLast) ret.rankLast = ret.rankLast + 1
          }
          callback(ret)
          // 存储当前用户统计结果
          db.collection("ac_stat").where({
            "wxUid": uoid
          }).remove().then(res => {
            db.collection("ac_stat").add({
              data: {
                "wxUid": uoid,
                "rank": ret.rank,
                "marking": ret.marking,
                "rankLast": ret.rankLast,
                "markingLast": ret.markingLast
              }
            })
          })

        })
      })
    })
  })

  // wx.request({
  //   url: serverPrefix() + '/stat/mstat/' + uoid,
  //   success(res) {
  //     callback(res.data)
  //   },
  //   fail() {
  //     callback(null)
  //   }
  // })
}

const statMRankList = (callback) => {
  let ret = []
  const $ = db.command.aggregate
    db.collection("wx_user").aggregate().match({
      wxUid: db.command.neq("")
    }).limit(100).end().then(resUser => {
      var df = new Date()
      var dt = new Date()
      df.setDate(1)
      console.log("this - " + util.formatDate(df) + " | " + util.formatDate(dt))
      db.collection("ac_info").aggregate().match({
        acDate: db.command.gte(util.formatDate(df)).and(db.command.lte(util.formatDate(dt))),
      }).group({
        _id: "$wxUid",
        markingT: $.sum("$marking")
      }).sort({
        markingT: -1
      }).limit(100).end().then(resInfo => { 
      let order = 0
      let curMarking = -1
      for (var i = 0; i < resInfo.list.length; i++) {
        for (var j = 0; j < resUser.list.length; j++) {
          if (resUser.list[j].wxUid == resInfo.list[i]._id)  {
            let retItem = {}
            retItem.rankRes = resInfo.list[i]
            retItem.wxUser = resUser.list[j]
            ret.push(retItem)
            if(curMarking != resInfo.list[i].markingT){
              order += 1
              curMarking = resInfo.list[i].markingT
              resInfo.list[i].rank = order
            }else{
              resInfo.list[i].rank =  order 
              order += 1
            }
            resInfo.list[i].marking = resInfo.list[i]. markingT
          }     
      }
    }
      callback(ret)
    })
  })

  // wx.request({
  //   url: serverPrefix() + '/stat/mranklist/',
  //   success(res) {
  //     callback(res.data)
  //   },
  //   fail() {
  //     callback(null)
  //   }
  // })
}
const statMRankListLast = (callback) => {
  let ret = []
  const $ = db.command.aggregate
    db.collection("wx_user").aggregate().match({
      wxUid: db.command.neq("")
    }).limit(100).end().then(resUser => {
      var df = new Date()
      var dt = new Date()
      df.setDate(1)
      df.setMonth(df.getMonth() - 1)
      dt.setDate(1)
      dt.setDate(dt.getDate() - 1)
      console.log("last - " + util.formatDate(df) + " | " + util.formatDate(dt))
      db.collection("ac_info").aggregate().match({
        acDate: db.command.gte(util.formatDate(df)).and(db.command.lte(util.formatDate(dt))),
      }).group({
        _id: "$wxUid",
        markingTLast: $.sum("$marking")
      }).sort({
        markingTLast: -1
      }).limit(100).end().then(resInfo => { 
      let order = 0 
      let cout = false 
      let curMarking = -1
        for (var i = 0; i < resInfo.list.length; i++) {
          for (var j = 0; j < resUser.list.length; j++) { 
          if (resUser.list[j].wxUid == resInfo.list[i]._id ) {
            let retItem = {}
            retItem.rankRes = resInfo.list[i]
            retItem.wxUser = resUser.list[j]
            ret.push(retItem)
            if(curMarking != resInfo.list[i].markingTLast){
              order += 1
              curMarking = resInfo.list[i].markingTLast 
              resInfo.list[i].rankLast =  order 
            }else{
              resInfo.list[i].rankLast =  order 
              order += 1
            }
           
            resInfo.list[i].markingLast = resInfo.list[i]. markingTLast
          } 
        }
      }  
      callback(ret)
    })
  })

  // wx.request({
  //   url: serverPrefix() + '/stat/mranklistlast/',
  //   success(res) {
  //     callback(res.data)
  //   },
  //   fail() {
  //     callback(null)
  //   }
  // })
}

const infoAdd = (wxUid, acType, acAmount, acNote, acDate, callback) => {
  db.collection("wx_user").where({
    "wxUid": wxUid
  }).get({
    success: res => {

      if (res.data.length > 0) {
        var genderIndex = 1
        var fatIndex = 1
        var sportTypeIndex = 1

        if (res.data[0].uGender == '2') {
          genderIndex = coeff.female_coeff
        } else {
          genderIndex = coeff.male_coeff
        }

        if (res.data[0].uWeight > coeff.fit_fat) {
          fatIndex = coeff.fat_coeff
        } else {
          fatIndex = coeff.fit_coeff
        }

        sportTypeIndex = sportsIndexDef[acType]
        console.log("index - " + genderIndex + "|" + fatIndex + "|" + sportTypeIndex)
        var marking = acAmount * genderIndex * fatIndex * sportTypeIndex

        db.collection("ac_info").add({
          data: {
            "sid": util.wxuuid(),
            "wxUid": wxUid,
            "acType": acType,
            "acAmount": acAmount,
            "acNote": acNote,
            "acDate": acDate,
            "marking": marking
          },
          success: res => {
            console.log("记录新增成功")
            callback({
              res: true
            })
          },
          fail: err => {
            console.log("记录新增失败")
            callback({
              res: false
            })
          }
        })
      }
    },
    fail: err => {
      console.log(err)
    }
  })
  // wx.request({
  //   url: serverPrefix() + '/info/add',
  //   method: 'POST',
  //   header: {
  //     'content-type': 'application/x-www-form-urlencoded' // 默认值
  //   },
  //   data: {
  //     "wxUid": wxUid,
  //     "acType": acType,
  //     "acAmount": acAmount,
  //     "acNote": acNote,
  //     "acDate": acDate
  //   },
  //   success(res) {
  //     callback(res.data)
  //   },
  //   fail() {
  //     callback(null)
  //   }
  // })
}

const infoQuery = (uoid, sdate, tdate, callback) => {
  db.collection("ac_info").where({
    "wxUid": uoid,
    "acDate": db.command.gte(sdate).and(db.command.lte(tdate)),
  }).get({
    success: res => {
      console.log(res.data)
      let ret = []
      for (var i = 0; i < res.data.length; i++) {
        let retItem = {}
        retItem["info"] = res.data[i]
        retItem["marking"] = res.data[i].marking
        ret.push(retItem)
      }
      callback(ret)
    },
    fail: err => {

    }
  })
  // wx.request({
  //   url: serverPrefix() + '/info/query/' + uoid + '/' + sdate + '/' + tdate,
  //   success(res) {
  //     callback(res.data)
  //   },
  //   fail() {
  //     callback(null)
  //   }
  // })
}

const infoDelete = (sid, callback) => {
  db.collection("ac_info").where({
    "sid": sid,
  }).get({
    success: res => {
      if (res.data.length > 0) {
        db.collection("ac_info").doc(res.data[0]["_id"]).remove({
          success: res => {
            callback({
              res: true
            })
          },
          fail: err => {
            callback({
              res: true
            })
          }
        })
      } else {
        callback({
          res: false
        })
      }
    },
    fail: err => {
      callback({
        res: false
      })
    }
  })
  // wx.request({
  //   url: serverPrefix() + '/info/delete/' + sid,
  //   success(res) {
  //     callback(res.data)
  //   },
  //   fail() {
  //     callback(null)
  //   }
  // })
}

const isAuth = (callback) => {
  callback({
    "res": true,
    "needAuth": 1
  })
  // wx.request({
  //   url: serverPrefix() + '/info/isauth',
  //   success(res) {
  //     callback(res.data)
  //   },
  //   fail() {
  //     callback(null)
  //   }
  // })
}

const getBookInfoByISBN = (isbn, callback) => {
  wx.request({
    url: "https://route.showapi.com/1626-1?showapi_appid=163626&showapi_sign=a4de2d8293504aedaa09390a3c985dd5&isbn=" + isbn,
    success(res) {
      console.log(res)
      if (res.data.showapi_res_body.ret_code == 0) {
        callback(res.data.showapi_res_body.data)
      } else {
        callback(null)
      }

    },
    fail() {
      callback(null)
    }
  })
}

module.exports = {
  serverPrefix: serverPrefix,
  userOpenId: userOpenId,
  userInfo: userInfo,
  hasUserInfo: hasUserInfo,
  userQuery: userQuery,
  userUpdate: userUpdate,
  statMStat: statMStat,
  statMRankList: statMRankList,
  statMRankListLast: statMRankListLast,
  infoAdd: infoAdd,
  infoQuery: infoQuery,
  infoDelete: infoDelete,
  isAuth: isAuth,
  getBookInfoByISBN: getBookInfoByISBN,
  userPass: userPass
}