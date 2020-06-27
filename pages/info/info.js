/**
 * 展示指定猫的详细信息，包括图片(imgSrc)，名字(name)等
 * 实现对猫咪的点赞，留言功能
 */

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    like: false,
    icon_like: "../../images/aixinfa3564.png",
    icon_unlike: "../../images/aixin8a8a8a.png",
    imgSrc: "",
    name: "",
    gender: "",
    area: "",
    sterilization: "",
    feature: "",
    description: "",
    likeNum: 0,
    id: "",
    animation: {},
    scrollHeight: 0,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  // 用户点击小爱心的相应
  like: function(event){
    let id = event.currentTarget.id;
    let coocki_id = wx.getStorageSync('like') || [];

    // 若已经点过赞了，取消点赞
    if (this.data.like) {
      for (let i = 0; i < coocki_id.length; i++){
        if (coocki_id[i] === id) {
          coocki_id.splice(i, 1);
          break;
        }
      }
      wx.setStorageSync('like', coocki_id);

      // 更新数据库中的记录
      const db = wx.cloud.database();
      db.collection('catsInfo')
        .where({
          _id: this.data.id
        })
        .update({
          data: {
            likeNum: this.data.likeNum - 1
          },
          success: res => {
            // 重新渲染页面
            this.setData({
              likeNum: this.data.likeNum - 1,
              like: false,
            })
          },
          fail: res => {
            console.log("更新数据失败");
          }
        })
    }

    // 还没有点过赞
    else {
      coocki_id.push(id);
      wx.setStorageSync('like', coocki_id);

      this.animation = wx.createAnimation({
        delay: 5,
        duration: 300,
        timingFunction: 'linear',
        transformOrigin: '50% 50%',
      })

      setTimeout(function(){
        this.animation.scale(1.5).step();
        this.animation.scale(1.0).step();
        this.setData({
          animation: this.animation.export(),
        })
      }.bind(this), 50);
      
      // 更新数据库中的记录
      const db = wx.cloud.database();
      db.collection('catsInfo')
        .where({
        _id: this.data.id
        })
        .update({
          data: {
            likeNum: this.data.likeNum + 1
          },
          success: res => {
            // 重新渲染页面
            this.setData ({
              likeNum: this.data.likeNum + 1,
              like: true,
            })
          },
          fail: res => {
            console.log("更新数据失败");
          }
        })
    }
  },

  // 未登陆状态时，获取用户信息
  getUserInfo: function(e) {
    // 若用户同意授权：
    if (e.detail.errMsg !== 'getUserInfo:fail auth deny') {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }
  },

  // 登陆状态下，用户提交留言
  submitComment: function(event) {
    let comment = event.detail.value;
    console.log(comment);
    console.log(event);
    console.log(this.data.userInfo);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (event) {
    let cat = JSON.parse(event.cat);
    this.setData({
      imgSrc: cat.imgSrc,
      name: cat.name,
      gender: cat.gender,
      area: cat.area,
      sterilization: cat.sterilization,
      feature: cat.feature,
      description: cat.description,
      likeNum: cat.likeNum,
      id: cat._id,
    });

    let coocki_id = wx.getStorageSync('like') || [];
    if (coocki_id.includes(this.data.id)) {
      this.setData ({
        like: true,
      })
    }

    // 计算scroll-view的高度
    // let query = wx.createSelectorQuery();
    // query.select('.container').boundingClientRect();
    // query.select('.comment').boundingClientRect();
    // query.exec(res => {
    //   let totalHeight = res[0].height; // 可用屏幕高度
    //   let commentHeight = res[1].height; // 评论栏高度
    //   this.setData({
    //     scrollHeight: totalHeight - commentHeight
    //   })
    // });

    // 检查是否处于登陆状态
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
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