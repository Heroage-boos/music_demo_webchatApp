import req from "../../utlis/indexInfo.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vId: "",
    istriggered: true,
    showKeyword: "",//默认搜索关键字
  },
  async checkTab(event) {
    //拿到id
    this.setData({
      videoList: [],
      listCurrentId: event.currentTarget.dataset.id
    })
    //点击时候重新请求 数据 并且 
    const newtabList = this.data.tabList.map((item) => {
      if (item.id === this.data.listCurrentId) {
        item.selectTab = true;
      } else {
        item.selectTab = false;
      }
      return item;
    })
    this.setData({
      listCurrentId: event.currentTarget.dataset.id,
      tabList: newtabList
    })
    wx.showLoading({
      title: "加载中"
    })
    //重新请求数据
    this.getVideoList();
  },
  //封装的获取视频列表的方法
  async getVideoList() {
    const { data: { datas } } = await req.getInfo("/video/group", "GET", { id: this.data.listCurrentId });
    this.setData({
      videoList: datas
    })
    wx.hideLoading();
  },


  //点击图片切换视频并显示的方法
  playImage(event) {
    //1.让video显示
    const { id } = event.currentTarget
    this.setData({
      vId: id
    })

    //2.测试页面是否正常切换 √

    //3.获取video对象 并控制播放
    const createVideoContext = wx.createVideoContext(id)
    createVideoContext.play();

  },
  //下拉刷新列表复位时被触发
  async refresherrefresh() {
    console.log("dd");

    await this.getVideoList();
    this.setData({
      istriggered: false,
    })
  },
  //触底时触发
  scrolltolowe() {
    console.log("触底");
  },
  //收集用户输入数据  点击搜索时触发
  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value.trim()
    })
    console.log(e.detail.value.trim());
  },
  //当用户点击搜索完成时触发
  async bindconfirm() {
    if (!this.data.inputValue) {
      return
    }
    //跳转推荐页面 并携带搜索的值
    const { data: { result: { songs } } } = await req.getInfo(`/search?keywords=${this.data.inputValue}&     limit=10`, "GET")
    this.setData({
      songs: songs
    })
    console.log(this.data.songs);

  },

  //默认搜索数据
  async defaultSearch() {
    const { data: { data } } = await req.getInfo("/search/default", "GET", null);
    console.log(data);
    this.setData({
      showKeyword: data.showKeyword
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.defaultSearch()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //调用测试用
  text() {
    const VideoContext = wx.createVideoContext(`${this.data.prenId}`);
    VideoContext.play();
    if (this.data.prenId) {
      VideoContext.pause();
    }
  },
  //当暂停/播放时触发
  playVideo(event) {
    const vid = event.currentTarget.id
    if (vid === this.data.prenId) {
      return
    }
    if (this.data.prenId) {
      const VideoContext = wx.createVideoContext(this.data.prenId);
      VideoContext.pause();
    }
    this.setData({
      prenId: vid
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    //查看用户是否有没有等录
    const cookie = wx.getStorageSync("cookies")
    //没登录提示跳转登录
    if (!cookie) {
      wx.showModal({
        title: '提示',
        content: '是否登录页面?',
        cancelText: "关闭页面",
        confirmText: "去登录",
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/log_subcontract/pages/log/log',
            })
          } else if (res.cancel) {
            return
          }
        }
      })

    }

    //登录后操作
    const { data: { data } } = await req.getInfo("/video/group/list", "GET", null)
    data[0].selectTab = true
    this.setData({
      tabList: data,
      listCurrentId: data[0].id
    }),
      wx.showLoading({
        title: "加载中"
      })
    this.getVideoList();
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
  onShareAppMessage: function (event) {
    if (event.from === "menu") {
      return {
        title: "硅谷云音乐",
        imageUrl: "/static/images/dazuo.jpeg",
        path: "/pages/index/index"
      }
    } else {
      const { target: { dataset: { imageurl, title } } } = event;
      // 如果是点击button组件转发,就分享当前歌曲图片和logo
      // 自定义属性名称,大写无效,会自动转为小写
      return {
        title,
        imageUrl: imageurl,
        path: "/pages/video/video"
      }
    }

  }
})