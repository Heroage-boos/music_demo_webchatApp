import config from "./config.js"


export default {
 getInfo(url, method = "GET", data) {
  return new Promise((resolve, object) => {
    wx.request({
      url: config.config + url,
      method,
      data,
      header:{
        Cookie:wx.getStorageSync('cookies')
      },
      
      success(res) {
        console.log(res);
        return resolve(res);
      }
    })
  })
},

}

/* {
  swiperInfo(){
   return  wx.request({
     url:"http://localhost:3000/banner",
      method:"GET",
      data:{
        type:2,
      },
      success(res) {
       console.log(res);
       return res;
     }
  })
  }, */
/*   personalizedInfo() {
    return wx.request({
      url: "http://localhost:3000/personalized",
      method: "GET",
    })
  } */