// pages/classify/classify.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ip: '',
    types: [
      // { img: '../images/classify_03.png', name: '休闲' },
      // { img: '../images/classify_05.png', name: '休闲' },
      // { img: '../images/classify_07.png', name: '休闲' },
      // { img: '../images/classify_09.png', name: '休闲' },
      // { img: '../images/classify_11.png', name: '休闲' },
      // { img: '../images/classify_19.png', name: '休闲' },
      // { img: '../images/classify_21.png', name: '休闲' },
      // { img: '../images/classify_22.png', name: '休闲' },
      // { img: '../images/classify_23.png', name: '休闲' },
      // { img: '../images/classify_24.png',name: '休闲' },
    ],
    route: [
      { id: 1, img: '../images/classify_30.png', name: '1天' },
      { id: 2, img: '../images/classify_32.png', name: '2天' },
      { id: 3, img: '../images/classify_34.png', name: '3天' },
      { id: 4, img: '../images/classify_37.png', name: '4~6天' },
      { id: 7, img: '../images/classify_39.png', name: '7天以上' }
    ],
    difficult: [
      { id: 1, img: '../images/classify_53.png', name: '休闲深度' },
      { id: 2, img: '../images/classify_56.png', name: '轻松徒步' },
      { id: 3, img: '../images/classify_59.png', name: '稍有难度' },
      { id: 4, img: '../images/classify_47.png', name: '中等难度' },
      { id: 5, img: '../images/classify_50.png', name: '较高难度' }
    ],
    address: [
      // { img: '../images/ind_20.png', name: '休闲深度' },
      // { img: '../images/ind_20.png', name: '轻松徒步' },
      // { img: '../images/ind_20.png', name: '稍有难度' },
      // { img: '../images/ind_20.png', name: '中等难度' },
      // { img: '../images/ind_20.png', name: '中等难度' }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var ip = getApp().globalData.ip;
    var that = this;
    that.setData({
      ip: ip,
      ipimg: getApp().globalData.ipimg
    })
    //活动类型
    wx.request({
      url: ip + '/applet/activity_type',
      data: '',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
      },
      method: 'POST',
      dataType: '',
      success: function (res) {
        var data = JSON.parse(res.data.data);
        console.log(data)
        that.setData({
          types: data
        })

      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
      },
    })
    //目的地
    wx.request({
      url: ip + '/applet/activity_province',
      data: '',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
      },
      method: 'POST',
      dataType: '',
      success: function (res) {
        var data = JSON.parse(res.data.data);
        console.log(data)
        that.setData({
          address: data
        })
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
      },
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