// pages/result/result.js

var tf = require('@tensorflow/tfjs-core');
var tfl = require('@tensorflow/tfjs-layers');
const db = wx.cloud.database();
let ans = ["纯白猫", "纯黑猫", "玳瑁猫", "橘猫", "狸花猫", "奶牛猫"];
let type = ["纯白", "纯黑", "玳瑁", "橘猫", "狸花", "奶牛"];
let array = []; // 存储图片的rgb信息

Page({

  data: {
    url: "",
    imgWidth: 0,
    imgHeight: 0,
    res: "",
    catsData: [],
  },

  // 载入图片，并将图片的rgb信息存入array
  loadImg(canvas, context){
    const img = canvas.createImage()
    img.src = this.data.url
    img.onload = function (e) {
      context.drawImage(img, 0, 0, 192, 192);
      let imageData = context.getImageData(0, 0, 192, 192);
      for (let i=0; i<147456; i++){
        if ((i+1) % 4 != 0){
          array.push(imageData.data[i]);
        }
      }
    }
  },

  // 从数据库中获取猫咪信息
  goToInfo: function(event){
    wx.navigateTo({
      url: '../../pages/info/info?cat=' + JSON.stringify(this.data.catsData[event.currentTarget.id])
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx: wx.showLoading({
      title: '识别中',
      mask: true,
    })

    // 如果不是第一次访问，需要清空之前的数据
    array.length = 0;
    this.setData({
      url: options.url,
    })
    wx.getImageInfo({
      src: this.data.url,
      success: res => {
        this.setData({
          imgWidth: res.width,
          imgHeight: res.height,
        })
      },
    })
    wx.createSelectorQuery()
    .select('#canvas')
    .fields({ node: true, size: true })
    .exec( res => {
      const canvas = res[0].node
      const context = canvas.getContext('2d')
      canvas.width = 192;
      canvas.height = 192;
      this.loadImg(canvas, context);
      setTimeout(async function(){
        console.log(array);
        let tensor = tf.tensor4d(array, [1, 192, 192, 3]);
        try {
          console.log("开始加载");
          const model = await tfl.loadLayersModel('https://orzorzorzorz.oss-cn-beijing.aliyuncs.com/model/model.json');
          console.log("加载完成");
          let predictResult = model.predict(tensor).as1D().arraySync();
          for(let i = 0; i<predictResult.length; i++){
            if (predictResult[i] == 1){
              this.setData({
                res: ans[i],
              })
              db.collection('catsInfo').where({
                type: type[i],
              }).get().then(res => {
                this.setData({
                  catsData: res.data,
                })
              });
              wx: wx.hideLoading();
              break;
            }
          }
          console.log(predictResult);
        } catch (error) {
          let e = JSON.stringify(error);
          this.setData({
            res: e,
          })
        } 
      }.bind(this), 500);
    })
  },
})