import req from "../../../utlis/indexInfo.js"
import PubSub from "pubsub-js"
// pages/recommendSong/recommendSong.js
Page({
 

//点击进入歌曲播放页面
  song(event){
   const {id,index}= event.currentTarget.dataset;
   wx.navigateTo({
     url: `/index_subcontract/pages/song/song?ids=${id}&&index1=${index}`,
   })
  },
  /**
   * 页面的初始数据
   */
  data: {
    recommendList:[],//用于存储推荐歌曲列表
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
//封装发送上一首，下一首id的方法
getswicthId(){
  let { id } = this.data.recommendList[this.data.index]
  //传送过去一个下一页id 需要song页面先订阅
  PubSub.publish("songSendId", { id, index:this.data.index });
},
  /**
   * 生命周期函数--监听页面显示
   */
   onShow: async function () {
      //请求推荐歌曲列表
   const {data} = await req.getInfo("/recommend/songs","GET",null);
   this.setData({
     recommendList: data.recommend
   })
       //计算时间
    const dates=new Date();
     const month = dates.getMonth();
     const date = dates.getDate();
      this.setData({
       date:{
         month:month+1,
         date
       }
     
      })

     //2. 订阅 
     PubSub.subscribe("songId", (msg, data) =>{
       //根据song页面传送过来的id判断是上一页还是下一页
       let {tabId,index:currentIndex}= data
       if (tabId==="next"){
        let index=(+currentIndex)+1
         if (index >= this.data.recommendList.length - 1) {
           index =0
         }
         this.setData({
           index
         })
         this.getswicthId();
        }
       if (tabId=== "pre"){
         let index = currentIndex - 1
         if (index <= 0) {
           index = this.data.recommendList.length - 1
         }
         this.setData({
           index
         })
         this.getswicthId();
       }
      
     });

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