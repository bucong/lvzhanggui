// pages/travelDetail/travelDetail.js
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    author: '',
    time: '',
    viewCount: '',
    content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    WxParse.emojisInit('[]', "/wxParse/emojis/", {});
    var ip = getApp().globalData.ip;
    var ipimg = getApp().globalData.ipimg;
    var that = this;
    //游记类型
    wx.request({
      url: ip + '/applet/note_detail',
      data: { id: options.id },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
      },
      method: 'POST',
      dataType: '',
      success: function (res) {
        var data = JSON.parse(res.data.data)
        console.log(data)
        that.setData({
          title: data.title,
          author: data.author,
          takeNoteTime: getApp().transDate3(data.takeNoteTime),
          viewCount: data.viewCount
        })
        data.content = data.content.replace('src="', 'src="' + ipimg);  //给图片添加路径
        WxParse.wxParse('content', 'html', data.content, that);
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