// pages/main/record.js
const app = getApp()
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeName: '',
    type: '',
    minDate: '',
    maxDate: '',
    date: '',
    amount: 1,
    ifAmountErr: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var df = new Date()
    var dt = new Date()
    df.setDate(df.getDate() - 365)
    this.setData({
      type: options.type,
      typeName: app.globalData.sportType[options.type],
      minDate: util.formatDate(df),
      maxDate: util.formatDate(dt),
        date: util.formatDate(dt)
    })
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

  bindDateChange: function(e){
    this.setData({
      date: e.detail.value
    })
  },

  bindAmountChange: function(e){
    var val = e.detail.value
    if(util.isNumber(val)){
      var amountNum = parseFloat(val)
      if(amountNum > 0){
        this.setData({
          amount: amountNum,
          ifAmountErr: false
        })
        return;
      }
    }
    this.setData({
      ifAmountErr: true
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})