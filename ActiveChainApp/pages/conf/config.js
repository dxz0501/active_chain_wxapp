// pages/conf/config.js
const app = getApp()
var api = require('../../utils/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    userDBInfo: {},
    isUserAuth: false,
    genders: [{
        'name': '男',
        'value': 1
      },
      {
        'name': '女',
        'value': 2
      }
    ],
    inputDisabled: true,
    userInputName: '',
    userWeight: 65
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!api.userPass) {
      wx.navigateTo({
        url: '../intro/index',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    app.userUpdateConfigCallback = (data) => {
      console.log('app.userUpdateConfigCallback:')
      console.log(data)
      if(data.res == true){
        wx.showToast({
          title: '已修改',
          icon: 'success',
          duration: 2000
        });
      }else{
        wx.showToast({
          title: '修改失败,请确认信息!',
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
    app.userQueryConfigCallback = (data) => {
      console.log('app.userQueryConfigCallback:')
      console.log(data)
      this.setData({
        userDBInfo: data,
        userInputName: data.uNickname,
        userWeight: data.uWeight
      })
    }
    if (app.globalData.isUserAuth) {
      api.userQuery(api.userOpenId, app.userQueryConfigCallback)
    }
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
  // 性别设置
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems
    });
  },
  // 点击修改
  onTapEdit: function(e){
      this.setData({
      inputDisabled: false
      })
  },
  // 点击保存
  onTapSave: function (e) {
    this.setData({
      inputDisabled: true
    })
    // 开始处理业务提交
    if (app.globalData.isUserAuth) {
      console.log(this.data.userInfo)
      console.log(this.data.userInputName)
      api.userUpdate(this.data.userDBInfo.wxUid,
        this.data.userDBInfo.wxNickName,
        this.data.userDBInfo.wxAvatar,
        this.data.userInputName,
        this.data.userDBInfo.uGender,
        this.data.userWeight,
        this.data.userDBInfo.uPrivacy,
        app.userUpdateConfigCallback)
    }
  },

  userNameChange: function(e){
    this.setData({
      userInputName: e.detail.value,
    })
  },

  userWeightChange: function(e){
    this.setData({
      userWeight: e.detail.value
    })
  }
})