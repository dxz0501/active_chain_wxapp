// pages/main/rankdetail.js
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateFrom: '',
    dateTo: '',
    markingList: [],
    totalMarking: 0,
    userShow: '',
    userId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var df = new Date()
    var dt = new Date()
    if(options.month == "this"){
      df.setDate(1)
    }else{
      df.setDate(1)
      df.setMonth(df.getMonth() - 1)
      dt.setDate(1)
      dt.setDate(dt.getDate() - 1)
    }
    this.setData({
      dateFrom: util.formatDate(df),
      dateTo: util.formatDate(dt),
      userShow: options.userShow,
      userId: options.uid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    app.infoQueryRankCallback = (data) => {
      console.log(data)
      var sumUp = 0;
      for (var i = 0; i < data.length; i++) {
        sumUp += data[i].marking
        data[i].info.acType = app.globalData.sportType[data[i].info.acType]
      }
      this.setData({
        markingList: data,
        totalMarking: sumUp
      })
    }
    api.infoQuery(this.data.userId, this.data.dateFrom, this.data.dateTo, app.infoQueryRankCallback);
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