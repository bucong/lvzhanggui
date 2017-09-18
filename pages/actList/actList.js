// pages/actList/actList.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ip: '',
    actList: []
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
    var request = '';
    if (options.types) {
      request = { types: options.types };
      console.log(request)
    } else if (options.days){
      request = { days: options.days };
    } else if (options.difficulty) {
      request = { difficulty: options.difficulty };
    } else if (options.province) {
      request = { province: options.province };
    } else if (options.keyword) {
      request = { keyword: options.keyword };
    }
    //活动列表
    wx.request({
      url: ip + '/applet/activity_list',
      data: request,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
      },
      method: 'POST',
      dataType: '',
      success: function (res) {
        var data = JSON.parse(res.data.data);
        console.log(data)
        if(data.length==0){
          wx.showModal({
            title: '提示',
            content: '没有相关活动，请重新选择！',
            showCancel: false,
            cancelText: '',
            cancelColor: '',
            confirmText: '确定',
            confirmColor: '',
            success: function(res) {
              wx.navigateBack({
                delta: 1,
              })
            },
            fail: function(res) {},
            complete: function(res) {},
          })
        }
        for(var i=0;i<data.length;i++){
          data[i].startTime = app.transDate1(data[i].startTime);
          data[i].endTime = app.transDate1(data[i].endTime);
        }
        that.setData({
          actList: data
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