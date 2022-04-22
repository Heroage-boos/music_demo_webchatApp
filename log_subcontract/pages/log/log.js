import req from "../../../utlis/indexInfo.js"
// pages/log/log.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    password: ""
  },
  handleInput(event) {
  let  key = event.currentTarget.id;
  console.log(key)
    //1.收集用户收集信息
    /* -尝试使用event收集 */
    if (key){
      this.setData({
        [key]: event.detail.value
      })
    }
      
  },
/*   handleInput(event) {
    //1.收集用户收集信息
    -尝试使用event收集 
      event.detail.value 
    this.setData({
      password: event.detail.value
    })
  }, */
  async handleLogin() {
    //1.收集信息
    const { phone, password } =this. data;
    //2.信息验证
    if (!phone.trim) {
      //提示报空错误
      wx.showToast({
        title: '手机号不能为空',
        icon: "none"
      })
      return
    }
    if (!password.trim) {
      //提示报空错误
      wx.showToast({
        title: '密码不能为空',
        icon: "none"
      })
      return
    }
    //3.整数数据  请求参数

    //4.发送请求
    const res = await req.getInfo("/login/cellphone", "GET", { phone:this.data.phone, password:this.data.password});
    //5.成功做什么
    if (res.statusCode === 200) {
      //1.提示登录成功
      wx.showToast({
        title: "账号信息正确，正在跳转登录页面",
        icon: "none"
      })
      //携带cookies 需要携带指定的
     const music= res.cookies.find((item)=>{
       return item.includes("MUSIC_");
      })
      console.log(music);
      wx.setStorageSync("cookies", music)

      //2.将信息存储到本地storage中
      wx.setStorage({
        key: "userLoginInfo",
        data: {
          avatarUrl:res.data.profile.avatarUrl,
          nickName:res.data.profile.nickname,
          userId:res.data.profile.userId,
        /*   token:res.data.token, */
         /*  cookies: music */
        }
      })
      //3.跳转到首页  可以条tabbar页面，并移除其他tabbar页面
      wx.switchTab({
        url: '/pages/Personal/Personal',
      })
    }
    //6.失败做什么
    if (res.statusCode === 502) {
      wx.showToast({
        title: "密码错误，请返回重新输入!",
        icon: "none"
      })
    }
    if (res.statusCode === 400) {
      wx.showToast({
        title: '账号信息错误，请返回重新输入!',
        icon: "none"
      })
    }
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