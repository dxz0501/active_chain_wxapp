// pages/book/bookInfo.js
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
    op: '',
    opstr: '',
    bookdata: {},
    userInputBookCode: '',
    userInfo: {},
    isUserAuth: false
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
    app.bookISBNCallback = (data) => {
      console.log(data)
      this.setData({
        bookdata: data
      })
    }

    var ops = ''
    if (options.op == 'borrow') {
      ops = '借阅'
      db.collection("ac_book").where({
        "isbn": options.isbn
      }).get().then(res => {
        if (res.data.length < 1) {
          wx.showToast({
            title: "书籍未入库，借阅登记失败！",
            icon: 'none',
            success(res) {
              setTimeout(function() {
                wx.navigateBack({})
              })
            }
          })
        } else {
          this.setData({
            bookdata: res.data[0]
          })
        }
      })
    }
    if (options.op == 'share') {
      ops = '捐赠'
      api.getBookInfoByISBN(options.isbn, app.bookISBNCallback);
    }
    this.setData({
      opstr: ops,
      op: options.op
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var tmp_uinfo = app.globalData.userInfo
    tmp_uinfo["wxUid"] = api.userOpenId
    this.setData({
      userInfo: tmp_uinfo,
      isUserAuth: app.globalData.isUserAuth
    })
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

  onTapDonate: function(e) {
    if (this.data.userInputBookCode.length < 6) {
      wx.showToast({
        title: "书籍编码格式不正确！",
        icon: 'none'
      })
      return;
    }
    // 先检查是否重复捐赠
    db.collection("ac_book").where({
      "isbn": this.data.bookdata.isbn
    }).get().then(res => {
      console.log(res)
      if (res.data.length > 0) {
        wx.showToast({
          title: "书籍已存在，请勿重复捐赠！",
          icon: 'none'
        })
        return;
      } else {
        // 执行捐赠
        var tmp_bookdata = this.data.bookdata
        tmp_bookdata["donator"] = this.data.userInfo
        tmp_bookdata["bookcode"] = this.data.userInputBookCode
        tmp_bookdata["borrower"] = {}
        this.setData({
          bookdata: tmp_bookdata
        })
        db.collection("ac_book").add({
          data: this.data.bookdata,
          success: res => {
            wx.showToast({
              title: "捐赠成功！",
              success(res) {
                setTimeout(function() {
                  wx.navigateBack({})
                })
              }
            })
          },
          fail: err => {
            wx.showToast({
              title: "捐赠执行失败，请返回重试！",
              icon: 'none'
            })
            return;
          }
        })
      }
    })
  },

  bookCodeChange: function(e) {
    this.setData({
      userInputBookCode: e.detail.value,
    })
  },

  onTapBorrow: function(e) {
    wx.cloud.init()
    wx.cloud.callFunction({
      name: 'borrowBook',
      data: {
        borrower: this.data.userInfo,
        borrowerId: api.userOpenId,
        borrowDate: util.formatTime(new Date()),
        user: this.data.userInfo,
        actDate: util.formatTime(new Date()),
        book: this.data.bookdata,
        docid: this.data.bookdata["_id"]
      },
      complete: res => {
        console.log(res)
        if (res.result != undefined) {
          wx.showToast({
            title: "借阅成功！",
            success(res) {
              setTimeout(function() {
                wx.navigateBack({})
              }, 1500)
            }
          })
        } else {
          wx.showToast({
            title: "借阅执行失败，请返回重试！",
            icon: 'none'
          })
        }
      }
    })
  }
})