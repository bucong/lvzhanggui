// pages/requestPay/requestPay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ip: '',
    money: '',
    orderStr: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var ip=getApp().globalData.ip;
    this.setData({
      ip: ip,
      money: options.money,
      orderStr: options.orderStr
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
  requestPayment:function(){
    var that=this;
    //付费，获取支付参数
    wx.request({
      url: that.data.ip + '/applet/user/applet_wx_pay',
      data: {
        payOrderIdsStr: that.data.orderStr
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
      },
      method: 'POST',
      dataType: '',
      success: function (res) {
        if (res.data.data) {
          var payargs = JSON.parse(res.data.data);
          console.log(payargs)
          wx.requestPayment({
            timeStamp: payargs.timeStamp,
            nonceStr: payargs.nonceStr,
            package: payargs.package,
            signType: payargs.signType,
            paySign: payargs.paySign,
            success: function (res) {
              console.log(res)
              wx.showModal({
                title: '提示',
                content: "支付成功!",
                showCancel: false,
                confirmText: "确定",
                cancelText: "取消",
                success: function (res) {
                  wx.reLaunch({
                    url: '../index/index',
                    success: function (res) { },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                }
              })
            },
            fail: function (res) {
              console.log(res)
              wx.showModal({
                title: '提示',
                content: "支付失败!",
                showCancel: false,
                confirmText: "确定",
                cancelText: "取消",
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateBack({
                      delta: 1,
                    })
                  }
                }
              })
            },
            complete: function (res) {
            },
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false,
            cancelText: '',
            cancelColor: '',
            confirmText: '确定',
            confirmColor: '',
            success: function (res) {
              wx.reLaunch({
                url: '../index/index',
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        }

      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
      },
    })
  }
})