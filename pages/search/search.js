// pages/search/search.js
const app = getApp()
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    catsData: [],
    scrollHeight: 100,
    focus:false,
    inputVal:"",
    noData:false,
  },

  //bindsubmit 提交处理函数
  formSubmit:function(event){
    wx:wx.showLoading({
      title: '加载中',
      mask:true,
      success:function(res){},
      fail:function(res){},
      complete:function(res){},
    })

    setTimeout(function(){
      wx.hideLoading()
    },2000)
    
    db.collection('catsInfo').where({
      name:db.RegExp({
        regexp:this.data.inputVal,//作为关键字进行匹配
        option:'i',//不区分大小写，虽然这里好像没什么用
      })
    }).get().then(res => {
      if (res.data.length > 0) {
        this.setData({
          catsData:res.data,
          noData: false,
        })
      } else {
        this.setData({
          catsData: res.data,
          noData: true,
        })
      }
      console.log(res.data);
      wx.hideLoading();
    }).catch(err=>{
      console.log("error: ")
      console.log(err);
      wx.hideLoading();
    })

  },

  //bindinput:inputTyping 输入处理函数
  inputTyping:function(e){
    this.setData({
      inputVal:e.detail.value,
    })
    console.log(e.detail.value)
  },
  
  //clearInput  清空输入函数
  clearInput:function(event){
    console.log('清空输入')
    db.collection('catsInfo').get().then(res => {
      this.setData({
        inputVal: "",
        catsData: res.data,
        noData: false,
      })
    })
  },

  // bindTap 点击处理函数
  goToInfo: function(event){
    wx.navigateTo({
      url: '../../pages/info/info?cat=' + JSON.stringify(this.data.catsData[event.currentTarget.id])
    });
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 计算 scroll-view 组件的高度,
    let query = wx.createSelectorQuery();
    query.select('.container').boundingClientRect();
    query.select('.search-bar').boundingClientRect();
    query.exec(res => {
      let totalHeight = res[0].height; // 可用总高度
      let searchBarHeight = res[1].height;  // 搜索框的高度
      let marginHeight = 130 * res[0].width / 750;
      // 留白的高度，需要换算, 170是search-bar的margin-top和margin-bottom
      this.setData({
        scrollHeight: totalHeight - searchBarHeight - marginHeight
      })
    });
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

    // 每次显示页面时都要从数据库中更新数据
    db.collection('catsInfo').get().then(res => {
      this.setData({
        catsData: res.data,
        noData: false,
      })
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