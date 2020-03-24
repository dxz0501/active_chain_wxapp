// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const db = cloud.database()
  let returnRes = undefined
  // 找到对应的书
  let returnFind = await db.collection("ac_book").where({
    "isbn": event.isbn//e.currentTarget.dataset.isbn
  }).get()
  if (returnFind.data.length > 0){
    // 执行归还
    let bookdata = returnFind.data[0]
    let returnRes = await db.collection("ac_book").doc(bookdata["_id"]).update({
      data: {
        "borrower": db.command.remove(),
        "borrowerId": "",
        "borrowDate": ""
      }
    })

    if (returnRes.updated > 0) {
      let tmp = await db.collection("ac_book_borrow").add({
        data: {
          "user": event.user,//this.data.userInfo,
          "act": "return",
          "actDate": event.actDate,//util.formatTime(new Date()),
          "book": bookdata
        }
      })
    }
  }

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    returnRes,
  }
}