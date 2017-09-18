// pages/cardDetail/cardDetail.js
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ip: '',
    id: '',
    img: '',
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    coupon: '',
    explain: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    WxParse.emojisInit('[]', "/wxParse/emojis/", {});
    var ip = getApp().globalData.ip;
    var that = this;
    wx.request({
      url: ip + '/applet/coupon_detail',
      data: {
        id: options.id
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
      },
      success: function (res) {
        var data = JSON.parse(res.data.data)
        console.log(data)
        that.setData({
          ip: ip,
          ipimg: getApp().globalData.ipimg,
          id: data.id,
          img: data.detailImg,
          name: data.name,
          description: data.description,
          price: data.preferentialPrice,
          originalPrice: data.originalPrice
        })
        data.couponDetail = data.couponDetail.replace('src="', 'src="' + ipimg);
        data.cardExplain = data.cardExplain.replace('src="', 'src="' + ipimg);
        WxParse.wxParse('couponDetail', 'html', data.couponDetail, that);
        WxParse.wxParse('cardExplain', 'html', data.cardExplain, that);
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
      }
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
  
  },
  buy: function(){
    if (wx.getStorageSync('login') == 'no') {
      wx.redirectTo({
        url: '../bindPhone/bindPhone',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    var that = this;
    wx.request({
      url: that.data.ip + '/applet/user/buy_coupon',
      data: {
        coupId: that.data.id
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
      },
      success: function (res) {
        if(res.data.code!=0){
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: true,
            cancelText: '取消',
            cancelColor: '',
            confirmText: '确定',
            confirmColor: '',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        }else{
          var data = JSON.parse(res.data.data)
          console.log(data)
          wx.redirectTo({
            url: '../requestPay/requestPay?money=' + data.price +'&orderStr='+data.orderId,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        }
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
      }
    })
  }
})