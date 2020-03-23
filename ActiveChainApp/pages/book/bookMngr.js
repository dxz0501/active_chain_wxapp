// pages/book/bookMngr.js
const app = getApp()
var api = require('../../utils/api.js')
var util = require('../../utils/util.js')
wx.cloud.init()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    isUserAuth: false,
    bookBorrowedList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    // 检索已借阅书籍
    db.collection("ac_book").where({
      "borrowerId": api.userOpenId
    }).get().then(res => {
      var tmp_uinfo = app.globalData.userInfo
      tmp_uinfo["wxUid"] = api.userOpenId
      this.setData({
        userInfo: tmp_uinfo,
        isUserAuth: app.globalData.isUserAuth,
        bookBorrowedList: res.data
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

  },

  returnMainUI: function (e) {
    wx.switchTab({
      url: '../main/mainui',
    })
  },

  onTapBorrow: function(e){
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['barCode'],
      success: res => {
        console.log(res)
        wx.navigateTo({
          url: 'bookInfo?op=borrow&isbn=' + res.result,
        })   
      },
      fail: err => {
        wx.showToast({
          title: '扫码失败',
          icon: 'none'
        })
      }
    })
  },

  onTapShare: function (e) {
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['barCode'],
      success: res =>{
        console.log(res)
        wx.navigateTo({
          url: 'bookInfo?op=share&isbn='+res.result,
        })    
      },
      fail: err => {
        wx.showToast({
          title: '扫码失败',
          icon: 'none'
        })
      }
    })
  },

  onTapBookTour: function (e) {
    wx.navigateTo({
      url: 'bookTour',
    })
  },

  tapReturnBook: function(e){
    // 找到对应的书
    console.log(e.currentTarget.dataset.isbn)
    db.collection("ac_book").where({
      "isbn": e.currentTarget.dataset.isbn
    }).get().then(res => {
      console.log(res)
      if(res.data.length < 1){
        wx.showToast({
          title: '归还失败，请重试！',
          icon: 'none'
        })
        return;
      }else{
        // 执行归还
        let bookdata = res.data[0]
        let env = this
        console.log(bookdata)
        db.collection("ac_book").doc(bookdata["_id"]).update({
          data: {
            "borrower": db.command.remove(),
            "borrowerId": "",
            "borrowDate": ""
          },
          success: res => {
            console.log(res)
            db.collection("ac_book_borrow").add({
              data: {
                "user": this.data.userInfo,
                "act": "return",
                "actDate": util.formatTime(new Date()),
                "book": bookdata
              }
            })
            console.log("after add")
            wx.showToast({
              title: "归还成功！",
              success(res) {
                console.log("after toast")
                // 检索已借阅书籍
                db.collection("ac_book").where({
                  "borrowerId": api.userOpenId
                }).get().then(res => {
                  env.setData({
                    bookBorrowedList: res.data
                  })
                })
              }
            })
          },
          fail: err => {
            wx.showToast({
              title: "归还执行失败，请重试！",
              icon: 'none'
            })
            return;
          }
        })
      }
    })
  }
})