let userOpenId = ''
let userInfo = {}
let hasUserInfo = false

const serverPrefix = () => {
  return "https://dimitrid.club/ac_backend"
}

const userQuery = (uoid,callback) => {
  wx.request({
    url: serverPrefix() + '/user/query/' + uoid,
    success(res) {
      callback(res.data)
    },
    fail(){
      callback(null)
    }
  })
}

const userUpdate = (wxUid, wxNickname, wxAvatarurl, uNickname, uGender, uWeight, uPrivacy, callback) => {
  wx.request({
    url: serverPrefix() + '/user/update',
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    data: {
      "wxUid": wxUid,
      "wxNickname": wxNickname,
      "wxAvatarurl": wxAvatarurl,
      "uNickname": uNickname,
      "uGender": uGender,
      "uWeight": uWeight,
      "uPrivacy": uPrivacy
    },
    success(res) {
      callback(res.data)
    },
    fail() {
      callback(null)
    }
  })
}

const statMStat = (uoid,callback) => {
  wx.request({
    url: serverPrefix() + '/stat/mstat/' + uoid,
    success(res) {
      callback(res.data)
    },
    fail() {
      callback(null)
    }
  })
}

const statMRankList = (callback) => {
  wx.request({
    url: serverPrefix() + '/stat/mranklist/',
    success(res) {
      callback(res.data)
    },
    fail() {
      callback(null)
    }
  })
}

const statMRankListLast = (callback) => {
  wx.request({
    url: serverPrefix() + '/stat/mranklistlast/',
    success(res) {
      callback(res.data)
    },
    fail() {
      callback(null)
    }
  })
}

const infoAdd = (wxUid, acType, acAmount, acNote, acDate, callback) => {
  wx.request({
    url: serverPrefix() + '/info/add',
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    data: {
      "wxUid": wxUid,
      "acType": acType,
      "acAmount": acAmount,
      "acNote": acNote,
      "acDate": acDate
    },
    success(res) {
      callback(res.data)
    },
    fail() {
      callback(null)
    }
  })
}

const infoQuery = (uoid, sdate, tdate, callback) => {
  wx.request({
    url: serverPrefix() + '/info/query/' + uoid + '/' + sdate + '/' + tdate,
    success(res) {
      callback(res.data)
    },
    fail() {
      callback(null)
    }
  })
}

const infoDelete = (sid, callback) => {
  wx.request({
    url: serverPrefix() + '/info/delete/' + sid,
    success(res) {
      callback(res.data)
    },
    fail() {
      callback(null)
    }
  })
}

const isAuth = (callback) => {
  wx.request({
    url: serverPrefix() + '/info/isauth',
    success(res) {
      callback(res.data)
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
  isAuth: isAuth
}