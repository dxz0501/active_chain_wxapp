// pages/main/record.js
const app = getApp()
var util = require('../../utils/util.js')
var api = require('../../utils/api.js')

wx.cloud.init()
const db = wx.cloud.database()

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
    note: '',
    ifInput: false
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

    db.collection("ac_canNote").where({}).get().then(res => {
      console.log("1")
      console.log(res)
      console.log("2")
        this.setData({
          ifInput: res.data[0].ifInput
        })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    app.infoAddCallback = (data) => {
      if(data.res == true){
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000,
          mask: true,
          complete: function(){
            wx.navigateBack({

            })
          }
        });
        
      }else{
        wx.showToast({
          title: '数据提交失败!',
          icon: 'none',
          duration: 2000
        });
      }
    }
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

  bindNoteChange: function (e) {
    this.setData({
      note: e.detail.value
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

  onTapSubmit: function(){
    if (this.data.ifAmountErr){
      wx.showToast({
        title: '输入不合法,请检查!',
        icon: 'none',
        duration: 2000
      });
    }else{
      api.infoAdd(api.userOpenId, this.data.type, this.data.amount, this.data.note, this.data.date, app.infoAddCallback);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})