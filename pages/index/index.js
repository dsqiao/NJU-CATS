//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database();
let dateString;
let dayMap = ['天', '一', '二', '三', '四', '五', '六'];
let answerCookie = wx.getStorageSync('answerCookie') || [];
// 规定背景色渐变时间
let clickAnimation = wx.createAnimation({
  delay: 0,
  duration: 700,
  timingFunction: "linear",
});
// 勾勾和叉叉的颜色
const green = "#1afa29";
const red = "#EF8C8C";

Page({
  data: {
    // 按钮文字
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    // 按钮状态
    flag1: -1,
    flag2: -1,
    flag3: -1,
    flag4: -1,
    // 按钮动画
    animation1: {},
    animation2: {},
    animation3: {},
    animation4: {},
    imgSrc: "", // 今日猫咪图片地址
    name: "", //今日猫咪姓名
    url: "", // 今日猫咪信息页面地址
    year: 0,
    month: 0,
    day: 0, // 星期几
    calendarURL: '',
    answered: false, // 标记用户是否已经回答过每日问题
    shortInfo: "", // 猫咪简介
    imgHeight: 0,
    imgWidth: 0,
  },

  // 设置已经回答过问题
  setAnswered: function(){
    // 渲染页面出猫咪简介，规定等待时间
    setTimeout(function(){
      this.setData({
        answered: true,
      })
    }.bind(this), 1000);
    answerCookie.push(dateString);
    wx.setStorageSync('answerCookie', answerCookie);
  },

  btn1tap: function(){
    if (this.data.option1 == this.data.name) {
      // 回答正确
      clickAnimation.backgroundColor(green).step();
      this.setData({
        flag1: 0,
        animation1: clickAnimation.export(),
      })
    } else {
      // 回答错误
      console.log("incorrect");
      clickAnimation.backgroundColor(red).step();
      this.setData({
        flag1: 1,
        animation1: clickAnimation.export(),
      })
    }
    this.setAnswered();
  },

  btn2tap: function(){
    if (this.data.option2 == this.data.name) {
      // 回答正确
      console.log("correct");
      clickAnimation.backgroundColor(green).step();
      this.setData({
        flag2: 0,
        animation2: clickAnimation.export(),
      })
    } else {
      // 回答错误
      clickAnimation.backgroundColor(red).step();
      this.setData({
        flag2: 1,
        animation2: clickAnimation.export(),
      })
    }
    this.setAnswered();
  },

  btn3tap: function(){
    if (this.data.option3 == this.data.name) {
      // 回答正确
      clickAnimation.backgroundColor(green).step();
      console.log("correct");
      this.setData({
        flag3: 0,
        animation3: clickAnimation.export(),
      })
    } else {
      // 回答错误
      console.log("incorrect");
      clickAnimation.backgroundColor(red).step();
      this.setData({
        flag3: 1,
        animation3: clickAnimation.export(),
      })
    }
    this.setAnswered();
  },

  btn4tap: function(){
    if (this.data.option4 == this.data.name) {
      // 回答正确
      console.log("correct");
      clickAnimation.backgroundColor(green).step();
      this.setData({
        flag4:0,
        animation4: clickAnimation.export(),
      })
    } else {
      // 回答错误
      console.log("incorrect");
      clickAnimation.backgroundColor(red).step();
      this.setData({
        flag4:1,
        animation4: clickAnimation.export(),
      })
    }
    this.setAnswered();
  },

  goToInfo: function(){
    wx.navigateTo({
      url: this.data.url,
    })
  },
  // 打开相册
  openAlbum: function(event){
    wx.chooseImage({
      count: 1,
      sourceType: ['album'],
      success: (res) => {
        // 得到图片临时地址
        const tempFilePath = res.tempFilePaths[0];
        wx.navigateTo({
          url: '../result/result?url=' + tempFilePath,
        })
      },
      complete: (res) => {},
    })
  },

  // 打开摄像头
  openCamera: function(){
    wx.chooseImage({
      count: 1,
      sourceType: ['camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        wx.navigateTo({
          url: '../result/result?url=' + tempFilePath,
        })
      },
      complete: (res) => {},
    })
  },

  onLoad: function () {
    
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let dateth = date.getDate();
    let day = date.getDay();

    this.setData({
      month: month,
      calendarURL: '../../images/calendar/rili_' + dateth + '.png',
      day: dayMap[day],
    })
    // 以日期为种子，生成今日猫咪的信息
    let id = year * 8 + month * 16 + day * 27;
    // 以日期为种子，随机生成正确选项位置
    let correctOpt = (year + month + day) % 4 + 1;
    db.collection('catsInfo').get().then(res => {
      let len = res.data.length;
      let correctName = res.data[id%len].name;
      let incorrectName1 = res.data[(id+5)%len].name;
      let incorrectName2 = res.data[(id+10)%len].name;
      let incorrectName3 = res.data[(id+15)%len].name;

      this.setData({
        imgSrc: res.data[id%len].imgSrc,
        name: correctName,
        url: '../../pages/info/info?cat=' + JSON.stringify(res.data[id%len]),
        shortInfo: res.data[id%len].description,
      })
      if (correctOpt == 1) {
        this.setData({
          option1: correctName,
          option2: incorrectName1,
          option3: incorrectName2,
          option4: incorrectName3,
        })
      } else if (correctOpt == 2) {
        this.setData({
          option1: incorrectName1,
          option2: correctName,
          option3: incorrectName2,
          option4: incorrectName3,
        })
      } else if (correctOpt == 3) {
        this.setData({
          option1: incorrectName1,
          option2: incorrectName2,
          option3: correctName,
          option4: incorrectName3,
        })
      } else {
        this.setData({
          option1: incorrectName1,
          option2: incorrectName2,
          option3: incorrectName3,
          option4: correctName,
        })
      }
      console.log(this.data.name);
    })

    
    // 获取日期字符串
    dateString = year + "" + month + dateth;
    // 用户本地有回答记录时
    if (answerCookie.includes(dateString)) {
      this.setData({
        answered: true,
      })
    }
  },
})
