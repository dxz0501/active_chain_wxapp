//app.js
var api = require('utils/api.js')

App({
  globalData: {
    isUserAuth: false,
    userInfo: null,
    sportType: {
      "badminton": "羽球",
      "basketball": "篮球",
      "bicycle": "骑行",
      "football": "足球",
      "gym": "自由锻炼",
      "pingpong": "乒乓",
      "running": "跑步",
      "swimming": "游泳",
      "walking": "万步"
    }
  },

  onLaunch: function() {
    var self = this
    wx.cloud.init()
    // 用户登录
    wx.login({
      success: function(res) {
        if (res.code) {
          console.log('User Login Success: ' + res.code)
          wx.cloud.callFunction({
            name: 'getOpenid',
            complete: res => {
              console.log(res.result.openid)
              api.userOpenId = res.result.openid
            }
          })
          // wx.request({
          //   url: api.serverPrefix() + '/wxauth/' + res.code, 
          //   data: {
          //   },
          //   header: {
          //     'content-type': 'application/json' // 默认值
          //   },
          //   success(reqres) {
          //     console.log(reqres.data["openid"])
          //     api.userOpenId = reqres.data["openid"]
          //   }
          // })
        } else {
          console.log('User Login Fail: ' + res.errMsg)
        }
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          this.globalData.isUserAuth = true
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  }
})