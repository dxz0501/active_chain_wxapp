// pages/main/mainui.js
const app = getApp()
var api = require('../../utils/api.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isUserAuth: false,
    sportType: {},
    userInfo: {},
    userScore: '',
    userRank: '',
    userScoreLast: '',
    userRankLast: '',
    uShowName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!api.userPass){
      wx.navigateTo({
        url: '../intro/index',
      })
    }
    app.userUpdateCallback = (data) => {
      console.log('app.userUpdateCallback:')
      console.log(data)
    }
    app.userQueryCallback = (data) => {
      console.log('app.userQueryCallback:')
      console.log(data)
      if (data == '' || data == null) {
        api.userUpdate(api.userOpenId,
          app.globalData.userInfo.nickName,
          app.globalData.userInfo.avatarUrl,
          'N/A',
          app.globalData.userInfo.gender,
          '65',
          '0',
          app.userUpdateCallback)
      } else {
        api.userUpdate(api.userOpenId,
          app.globalData.userInfo.nickName,
          app.globalData.userInfo.avatarUrl,
          data.uNickname,
          app.globalData.userInfo.gender,
          data.uWeight,
          data.uPrivacy,
          app.userUpdateCallback)
        this.setData({
          uShowName: data.uNickname
        })
      }
    }
    app.statMStatCallback = (data) => {
      console.log('app.statMStatCallback:')
      console.log(data)
      this.setData({
        userScore: data.marking,
        userRank: data.rank,
        userScoreLast: data.markingLast,
        userRankLast: data.rankLast,
      })
      if (data.rank > 100) {
        this.setData({
          userRank: '100+'
        })
      }
      if (data.rankLast > 100) {
        this.setData({
          userRankLast: '100+'
        })
      }
    }

    this.setData({
      sportType: app.globalData.sportType
    })
    if (app.globalData.userInfo) {
      api.userInfo = app.globalData.userInfo
      api.hasUserInfo = true
      this.setData({
        userInfo: app.globalData.userInfo,
        isUserAuth: app.globalData.isUserAuth
      })
      if (app.globalData.isUserAuth) {
        api.userQuery(api.userOpenId, app.userQueryCallback)
        api.statMStat(api.userOpenId, app.statMStatCallback)
      }
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        app.globalData.userInfo = res.userInfo
        app.globalData.isUserAuth = true
        api.userInfo = res.userInfo
        api.hasUserInfo = true
        this.setData({
          userInfo: res.userInfo,
          isUserAuth: true
        })
        if (app.globalData.isUserAuth) {
          api.userQuery(api.userOpenId, app.userQueryCallback)
          api.statMStat(api.userOpenId, app.statMStatCallback)
        }
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          app.globalData.isUserAuth = true
          api.userInfo = res.userInfo
          api.hasUserInfo = true
          this.setData({
            userInfo: app.globalData.userInfo,
            isUserAuth: app.globalData.isUserAuth
          })
          if (app.globalData.isUserAuth) {
            api.userQuery(api.userOpenId, app.userQueryCallback)
            api.statMStat(api.userOpenId, app.statMStatCallback)
          }
        },
        fail: res => {
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.isUserAuth) {
      api.userQuery(api.userOpenId, app.userQueryCallback)
      api.statMStat(api.userOpenId, app.statMStatCallback)
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  goAelfIo: function () {
    wx.navigateTo({
      url: '../web/webview?url=https://aelf.io',
      fail: function () { },
      complete: function () { }
    });
  },

  bindGetUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    app.globalData.isUserAuth = true
    this.setData({
      userInfo: app.globalData.userInfo,
      isUserAuth: app.globalData.isUserAuth
    })
    api.userQuery(api.userOpenId, app.userQueryCallback)
    api.statMStat(api.userOpenId, app.statMStatCallback)
  },

  onTapSportType: function(e) {
    if(!this.data.isUserAuth){
      wx.showToast({
        title: '操作失败，请点击【授权登录】后进行操作！',
        icon: 'none',
        duration: 3000
      });
    }else{
      console.log(e.currentTarget.id)
      wx.navigateTo({
        url: 'record?type=' + e.currentTarget.id,
      })
    }
  },

userUpdateCallback: function(data){
  console.log(data)
}

})