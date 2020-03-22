var util = require('./util.js')
let userOpenId = ''
let userInfo = {}
let hasUserInfo = false

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

const userQuery = (uoid,callback) => {
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
      if(res.data.length == 0){
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
      }else{
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

const statMStat = (uoid,callback) => {
  const $ = db.command.aggregate
  let ret = {}
  ret.marking = 0
  ret.markingLast = 0
  ret.rank = 1
  ret.rankLast = 1
  var df = new Date()
  var dt = new Date()
  df.setDate(1)
  console.log("this - "+util.formatDate(df) + " | " + util.formatDate(dt))
  // 查询汇总当前用户本月积分
  db.collection("ac_info").where({
    wxUid: uoid,
    acDate: db.command.gte(util.formatDate(df)).and(db.command.lte(util.formatDate(dt))),
  }).get().then(res => {
    for (var i = 0; i < res.data.length; i++) {
      ret.marking += res.data[i].marking
    }
    // 查询汇总当前用户本月排名
    db.collection("ac_info").aggregate().match({
      acDate: db.command.gte(util.formatDate(df)).and(db.command.lte(util.formatDate(dt))),
    }).group({
      _id: "$wxUid",
      markingT: $.sum("$marking")
    }).end().then(res => {
      for (var i = 0; i < res.list.length; i++) {
        if(res.list[i].markingT > res.marking) res.rank += 1
      }
      // 查询汇总当前用户上月积分
      df.setDate(df.getDate() - 1)
      dt.setMonth(df.getMonth())
      dt.setDate(1)
      console.log("last - " + util.formatDate(dt) + " | " + util.formatDate(df))
      db.collection("ac_info").where({
        wxUid: uoid,
        acDate: db.command.gte(util.formatDate(dt)).and(db.command.lte(util.formatDate(df))),
      }).get().then(res => {
        for (var i = 0; i < res.data.length; i++) {
          ret.markingLast += res.data[i].marking
        }
        // 查询汇总当前用户上月排名
        db.collection("ac_info").aggregate().match({
          acDate: db.command.gte(util.formatDate(dt)).and(db.command.lte(util.formatDate(df))),
        }).group({
          _id: "$wxUid",
          markingTLast: $.sum("$marking")
        }).end().then(res => {
          for (var i = 0; i < res.list.length; i++) {
            if (res.list[i].markingTLast > res.markingLast) res.rankLast += 1
          }
          callback(ret)
          // 存储当前用户统计结果
          db.collection("ac_stat").where({
            "wxUid":uoid
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
  db.collection("ac_stat").aggregate().match({
    wxUid: db.command.neq("")
  }).sort({
    rank: 1
  }).end().then(res => {
    //制作字典
    let acStatDict = {}
    for (var i = 0; i < res.list.length; i++) {
      acStatDict[res.list[i].wxUid] = res.list[i]
    }
    //匹配用户
    db.collection("wx_user").where({
      wxUid: db.command.neq("")
    }).get().then(res => {
      for (var i = 0; i < res.data.length; i++) {
        let retItem = {}
        retItem.rankRes = acStatDict[res.data[i].wxUid]
        retItem.wxUser = res.data[i]
        ret.push(retItem)
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
  db.collection("ac_stat").aggregate().match({
    wxUid: db.command.neq("")
  }).sort({
    rankLast: 1
  }).end().then(res => {
    //制作字典
    let acStatDict = {}
    for (var i = 0; i < res.list.length; i++) {
      acStatDict[res.list[i].wxUid] = res.list[i]
    }
    //匹配用户
    db.collection("wx_user").where({
      wxUid: db.command.neq("")
    }).get().then(res => {
      for (var i = 0; i < res.data.length; i++) {
        let retItem = {}
        retItem.rankRes = acStatDict[res.data[i].wxUid]
        retItem.wxUser = res.data[i]
        ret.push(retItem)
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

      if(res.data.length > 0){
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
        console.log("index - " + genderIndex +"|"+ fatIndex +"|"+ sportTypeIndex)
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
            callback({ res: true })
          },
          fail: err => {
            console.log("记录新增失败")
            callback({ res: false })
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
      for(var i=0; i<res.data.length; i++){
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
      if(res.data.length > 0){
        db.collection("ac_info").doc(res.data[0]["_id"]).remove({
          success: res => {
            callback({ res: true })
          },
          fail: err => {
            callback({ res: true })
          }
        })
      }else{
        callback({ res: false })
      }
    },
    fail: err => {
      callback({ res: false })
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
  callback({"res":true, "needAuth":1})
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
  isAuth: isAuth
}