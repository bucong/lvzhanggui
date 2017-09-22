// pages/usualContact/usualContact.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ip: '',
    list: [],
    contactIdList: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var ip = getApp().globalData.ip;
    var that = this;
    that.setData({
      ip: ip
    })
    // 获取常用联系人列表
    wx.request({
      url: ip + '/applet/user/get_contacts_list',
      data: '',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
      },
      method: 'POST',
      dataType: '',
      success: function (res) {
        var data = JSON.parse(res.data.data);
        for (var k = 0; k < data.length; k++) {
          data[k].mobile = data[k].mobile.substring(0, 3) + '****' + data[k].mobile.substring(7, 11);
          data[k].idNum = data[k].idNum.substring(0, 4) + '**********' + data[k].idNum.substring(14, 18);
        }
        that.setData({
          list: data
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
  
  },
  checkboxChange: function (e) {
    this.setData({
      contactIdList: e.detail.value.join(';')
    })
    console.log(this.data.contactIdList)
  },
  sub: function(){
    var that = this;
    wx.request({
      url: that.data.ip + '/applet/user/choose_contact',
      data: {
        actId: wx.getStorageSync('actId'),
        contactIdList: that.data.contactIdList
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
      },
      success: function (res) {
        console.log(res)
        if(res.data.code==0){
          wx.redirectTo({
            url: '../signInfo/signInfo?peopleList=' + res.data.data,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false,
            cancelText: '',
            cancelColor: '',
            confirmText: '确定',
            confirmColor: '',
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