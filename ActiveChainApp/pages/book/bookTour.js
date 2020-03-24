// pages/book/bookTour.js
const app = getApp()
var api = require('../../utils/api.js')
wx.cloud.init()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    isUserAuth: false,
    bookList:[]
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
    db.collection("ac_book").where({}).get().then(res => {
      this.setData({
        bookList: res.data
      })
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