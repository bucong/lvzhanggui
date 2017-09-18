// pages/leaderDetail/leaderDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ip: '',
    headImg: '',
    nickName: '',
    name: '',
    mobile: '',
    introduce: '',
    isShow: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id=options.id;
    var ip = getApp().globalData.ip;
    var ipimg = getApp().globalData.ipimg;
    var that = this;
    //活动类型
    wx.request({
      url: ip + '/applet/leader_list',
      data: '',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
      },
      method: 'POST',
      dataType: '',
      success: function (res) {
        var data = JSON.parse(res.data.data);
        for(var i=0;i<data.length;i++){
          if(id==data[i].id){
            that.setData({
              ip: ip,
              ipimg: ipimg,
              headImg: data[i].headImg,
              nickName: data[i].nickname,
              name: data[i].name,
              mobile: data[i].mobile,
              introduce: data[i].introduce,
              isShow: data[i].isShow
            })
          }
        }
        that.setData({
          leaderList: data,
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
  call: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.mobile //仅为示例，并非真实的电话号码
    })
  }
})