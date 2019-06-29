// pages/data/datamgr.js
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isUserAuth: false,
    userInfo: {},
    dateFrom: '',
    dateTo: '',
    markingList: [],
    totalMarking: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var df = new Date()
    var dt = new Date()
    df.setDate(df.getDate() - 7)
    this.setData({
      dateFrom: util.formatDate(df),
      dateTo: util.formatDate(dt)
    })
    this.queryData = () => {
      if (this.data.dateFrom < this.data.dateTo) {
        api.infoQuery(api.userOpenId, this.data.dateFrom, this.data.dateTo, app.infoQueryCallback)
      } else {
        wx.showToast({
          title: '开始时间大于结束时间！',
          icon: 'none',
          duration: 2000
        });
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    app.infoDeleteCallback = (data) => {
      console.log(data)
      if(data.res == true){
        wx.showToast({
          title: '删除成功！数据删除后，月度总分及排名信息会在1小时内完成更新。',
          icon: 'none',
          duration: 2000
        });
        this.queryData()
      }else{
        wx.showToast({
          title: '数据删除失败!',
          icon: 'none',
          duration: 2000
        });
      }
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      userInfo: app.globalData.userInfo,
      isUserAuth: app.globalData.isUserAuth
    })
    app.infoQueryCallback = (data) => {
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
    this.queryData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  returnMainUI: function(e) {
    wx.switchTab({
      url: '../main/mainui',
    })
  },

  dateFromChange: function(e){
    this.setData({
      dateFrom: e.detail.value
    })
    this.queryData()
  },

  dateToChange: function(e){
    this.setData({
      dateTo: e.detail.value
    })
    this.queryData()
  },

  deleteBySid: function(e){
    wx.showModal({
      title: '删除确认',
      content: '确认删除选中的运动记录？（删除后不可恢复）',
      confirmText: "删除",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          api.infoDelete(e.currentTarget.dataset.sid, app.infoDeleteCallback)
        } else {
          
        }
      }
    });
  }
})