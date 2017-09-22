// pages/bindPhone/bindPhone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bindstatus: '免费获取',
    bg: 'grey',
    bindphone: '',
    checkNum: '',
    bindBottom: '-1000'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
  phoneCheck: function(e){
    if (/^1[3|4|5|7|8]\d{9}$/.test(e.detail.value)){
      this.setData({
        bg: '#3dbf7b',
        bindphone: e.detail.value
      })
      console.log(this.data.bindphone);
    }else{
      this.setData({
        bg: 'grey'
      })
    }
  },
  checkNum: function (e) {
    this.setData({
      checkNum: e.detail.value
    })
    console.log(this.data.checkNum);
  },
  sendCheck: function(){
    var that=this;
    var ip = getApp().globalData.ip;
    if (this.data.bg =='#3dbf7b'){
      that.setData({
        bg: 'grey'
      })
      wx.setStorageSync('checkPhone', that.data.bindphone);
      var i=60;
      var time=setInterval(function(){
        i--;
        that.setData({
          bindstatus: '已发送(' + i + ')'
        })
        if(i==0){
          clearInterval(time);
          that.setData({
            bindstatus: '免费获取',
            bg: '#3dbf7b'
          })
        }
      },1000)
      wx.request({
        url: ip + '/applet/send_verify_code',
        data: { phone: that.data.bindphone},
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": 'access_token=' + wx.getStorageSync('access_token')
        },
        success: function (res) {
          console.log(res)
        },
        fail: function (res) {
          console.log(res)
        },
        complete: function (res) {
        }
      })
    }
  },
  bindPhone:function(){
    var that = this;
    var ip = getApp().globalData.ip;
    if(this.data.phone==''){
      wx.showModal({
        title: '提示',
        content: "请输入手机号",
        showCancel: false,
        confirmText: "确定",
        cancelText: "取消"
      })
    } else if (this.data.checkNum==''){
      wx.showModal({
        title: '提示',
        content: "请输入验证码",
        showCancel: false,
        confirmText: "确定",
        cancelText: "取消"
      })
    } else if (this.data.bindphone != wx.getStorageSync('checkPhone')) {
      wx.showModal({
        title: '提示',
        content: "前后输入的手机号不一致",
        showCancel: false,
        confirmText: "确定",
        cancelText: "取消"
      })
    }else{
      wx.request({
        url: ip + '/applet/login.do',
        data: { phone: that.data.bindphone, vCode: that.data.checkNum },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": 'access_token=' + wx.getStorageSync('access_token')
        },
        success: function (res) {
          console.log(res)
          if(res.data.data){
            wx.setStorageSync('login', true);
            that.setData({
              bindBottom: '-1000',
              login: true
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
  },
  closeBindPhone: function(){
    this.setData({
      bindBottom: '-1000'
    })
  }
  
})