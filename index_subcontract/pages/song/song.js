import req from "../../../utlis/indexInfo.js"
import PubSub from 'pubsub-js'
import moment from "moment"
let appInstance = getApp();
// pages/song/song.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isplay: false,
    currentIndex: 0,
    songTime: 0, //音乐总时长
    bofangTime: "0", //播放进度
    updateTime: "00:00" //已播放时长
  },

  //点击下一首音乐   //点击上一首
  switchMusic(event) {
    const {
      id
    } = event.currentTarget;
    //1.根据id获取到 下一首音乐的id
    //必须先订阅才能发布
    //发布者   在进入播放页面的时候传递过来一个index  然后可以根据返回index，来获取上一首，下一首的音乐id
    PubSub.publish("songId", {
      tabId: `${id}`,
      index: this.data.currentIndex
    });

  },
  //点击播放按钮||暂停
  async musicPlay() {
    //获取背景音乐播放
    /* this.audioManager = wx.getBackgroundAudioManager(); */
  
    //用于测试播放完成是否跳转
   /*  this.audioManager.startTime =200; */
    // 记录当前播放的歌曲id,用于后续再次进入页面判断播放状态使用
    appInstance.globalData.audioId = this.data.songid;
    //当背景音乐正在播放的时候
    if (!this.data.isplay) {
      await this.getMusic();
      /* const a = this.audioManager.duration*/
      // 记录当前歌曲的播放状态
      appInstance.globalData.playState = true;
      return
    }
    this.audioManager.pause()
    this.setData({
      isplay: false
    })
    // 记录当前歌曲的播放状态
    appInstance.globalData.playState = false;
  },

  //封装获取歌曲详情信息的方法
  async getSongList() {
    const {
      data: {
        songs
      }
    } = await req.getInfo(`/song/detail?ids=${this.data.songid}`, "GET", null);
    //请求播放歌曲路径
    this.setData({
      songs: songs[0],
      songTime: moment(songs[0].dt).format("mm:ss"),
    })
    //设置标题
    wx.setNavigationBarTitle({
      title:this.data.songs.name
    })

  },
  //封装获取歌曲并背景播放
  async getMusic() {
    const {
      data: {
        data
      }
    } = await req.getInfo("/song/url", "GET", {
      id: this.data.songid
    });
    this.setData({
      audioUrl: data[0].url
    })
    this.audioManager.title = this.data.songs.al.name;
    this.audioManager.src = this.data.audioUrl;

  },

  ////点击更新进度条  1.触发点击事件
  progressBar(event){
 //2.定位元素计算开始位置
  console.log(event,"bar");
  //3.换算 计算出当前位置距离总长度的百分比 (当前点击距离屏幕边缘的位置-父元素距离屏幕边缘的位置)/225*100%=点击的位置
  // 播放总时长/1
    let location = (event.detail.x -event.currentTarget.offsetLeft)/225*100;
    console.log(location);
   let time=(location * this.data.songs.dt)/100/1000;
   //播放过程中更新歌曲播放
    this.audioManager.seek(time)

    //这是为了如果用户一上来就点击具体位置
    this.audioManager.startTime=time;
    this.setData({
      bofangTime: location
    })  
 
  
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    this.audioManager = wx.getBackgroundAudioManager();
    //监听背景音乐播放状态
    this.audioManager.onPlay(() => {
      this.setData({
        isplay: true
      })
    })
    //监听背景音乐暂停状态
    this.audioManager.onPause(() => {
      this.setData({
        isplay: false
      })
    })

    const {
      ids,
      index1
    } = options;
    this.setData({
      songid: ids,
      currentIndex: index1
    })
    //请求歌曲列表
    await this.getSongList();
    //用于同步c3和播放状态
    let {
      audioId,
      playState
    } = appInstance.globalData;
    if (playState && audioId !== this.data.songid) {
      this.setData({
        isplay: true
      })
      //需要播放当前歌曲
      this.getMusic();
    }else{
      this.audioManager.pause()
    }

    //进入播放页面 我就需要先订阅
    PubSub.subscribe("songSendId", async(msg, data) => {
      const {
        id,
        index
      } = data;
      //更新当前id
      this.setData({
        songid: id,
        currentIndex: index
      })
      //接收当前下一首歌曲id
      //调用this 刷新页面
       await this.getSongList();
       await this.getMusic();
    })
    //监视背景音乐的播放进度
    this.audioManager.onTimeUpdate(() => {
      //当前的播放进度   已播放时长/总时长this.data.songTime
      let time = (this.audioManager.currentTime / (+this.data.songs.dt / 1000)) * 100;
      //播放进度
      this.setData({
        bofangTime: time,
        //已播放时长
        updateTime: moment(this.audioManager.currentTime * 1000).format("mm:ss")
      })

    })

    /*  监听背景音频自然播放结束事件 */
    this.audioManager.onEnded(() => {
     
      PubSub.publish("songId", {
        tabId: "next",
        index: this.data.currentIndex
      })
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
    //
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

  }
})