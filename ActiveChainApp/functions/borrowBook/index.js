// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()

  const db = cloud.database()
  // 执行借阅
  const borrowRes = await db.collection("ac_book").doc(event.docid/*this.data.bookdata["_id"]*/).update({
    data: {
      "borrower": event.borrower, //this.data.userInfo,
      "borrowerId": event.borrowerId, //api.userOpenId,
      "borrowDate": event.borrowDate //util.formatTime(new Date())
    }
  })
  if (borrowRes.updated > 0) {
    let tmp = await db.collection("ac_book_borrow").add({
      data: {
        "user": event.user,//this.data.userInfo,
        "act": "borrow",
        "actDate": event.actDate,//util.formatTime(new Date()),
        "book": event.book//this.data.bookdata
      }
    })
  }

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    borrowRes
  }
}