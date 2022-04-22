3
import req from "../../utlis/indexInfo.js"
// pages/log/log.js


Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners:[],//用于存放展示轮播图
    personalized:[],//用于存放推荐数据
    playlist:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (options) {
    req.getInfo("/banner","GET",{type:2}).then((data)=>{
       const { data: { banners } }=  data;
      this.setData({
        banners
      })
    });

    req.getInfo("/personalized", "GET", { limit: 30 }).then((data)=>{
      const { data: { result } }=data;
      this.setData({
        personalized: result
      })
    });

    const arr=[2,3,4,5]
    let tracks=[];
     arr.forEach( (item)=>{
     req.getInfo("/top/list", "GET", { idx: item }).then((res) => {
        const { data: { playlist } } = res;
       playlist.tracks =playlist.tracks.slice(0, 3)
       tracks.push(playlist)
       this.setData({
         playlist: tracks
       }) 
      });
    })

   
  
   
  },
  //每日推荐 跳转
  toRecommendSong() {
    wx.navigateTo({
      url: '/index_subcontract/pages/recommendSong/recommendSong',
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})