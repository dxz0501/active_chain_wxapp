// pages/main/ranks.js
const app = getApp()
var api = require('../../utils/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isUserAuth: false,
    userInfo: {},
    rankList: [],
    month: '',
    monthDisplay: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!api.userPass) {
      wx.navigateTo({
        url: '../intro/index',
      })
    }
    console.log(options)
    var str = ''
    if(options.month == "this"){
      str = "本"
    }else{
      str = "上"
    }
    this.setData({
      month: options.month,
      monthDisplay: str
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    app.statMRankListCallback = (data) =>{
      console.log(data)
      this.setData({
        rankList: data
      })
    }
    if(this.data.month == "this"){
      api.statMRankList(app.statMRankListCallback);
    }else{
      api.statMRankListLast(app.statMRankListCallback);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userInfo: app.globalData.userInfo,
      isUserAuth: app.globalData.isUserAuth
    })
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
  
  }
})