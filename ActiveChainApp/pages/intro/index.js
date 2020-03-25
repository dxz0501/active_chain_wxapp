// pages/intro/index.js
const app = getApp()
var api = require('../../utils/api.js')
wx.cloud.init()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    slogan1: "链上世界",
    slogan2: "链动生活",
    userPass: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection("ac_auth").where({}).get().then(res => {
      console.log(res)
      if(res.data[0].needAuth){
        return;
      }else{
        api.userPass = true
        wx.switchTab({
          url: '../main/mainui',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    app.isAuthCallback = (data) => {
      // if(data.needAuth == 1){ // 不需要输入密码
      //     setTimeout(function () {
      //     wx.switchTab({
      //       url: '../main/mainui',
      //     })
      //   }, 2000);
      // }
    }
    api.isAuth(app.isAuthCallback)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearTimeout(timer)
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

  onTapSubmit: function(){
    if (this.data.userPass == "seri5"){
      api.userPass = true
      wx.switchTab({
          url: '../main/mainui',
        })
    }else{
      wx.showModal({
        content: '鉴权失败，请联系开发者！',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('')
          }
        }
      });
    }
  },

  passInput: function (e) {
    this.setData({
      userPass: e.detail.value
    })
  },
})