import req from "../../utlis/indexInfo.js"
// pages/Personal/Personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userLoginInfo:{},
  },
  toLogin() {
    if (this.data.userLoginInfo.nickName) {
      return
    }
    //跳转到登录页面
    wx.redirectTo({
      url: '/log_subcontract/pages/log/log',
    })
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
    wx.getStorage({
      key: 'userLoginInfo',
      success: async (res) => {
         const {data}= res
        this.setData({
          userLoginInfo:{
            nickName: data.nickName,
            userId: data.userId,
            avatarUrl: data.avatarUrl
          }
        })

        //获取历史听歌数据
        const {data:{weekData}} = await req.getInfo("/user/record", "GET", {
          uid: res.data.userId, type: 1,
        });
         this.setData({
          historyMusic:weekData
        })
      
      },
      fail(res) {
        return
      }

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