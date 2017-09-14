// pages/addPeople/addPeople.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ip: '',
    len: '',
    infoName: '手机号',
    infoVal: '输入手机号',
    sex: 0,
    array: ['男', '女'],
    idCard: '',
    phone: '',
    name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var ip = getApp().globalData.ip;
    var that=this;
    wx.request({
      url: ip + '/applet/user/get_contacts_list',
      data: '',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
      },
      success: function (res) {
        console.log(res)
        var data=JSON.parse(res.data.data)
        that.setData({
          ip: ip,
          len: data.length
        })
        if(data.length==0){
          that.setData({
            infoName: '紧急联系人',
            infoVal: '格式（联系人/手机号）'
          })
        }
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
      }
    })
    this.setData({
      ip: ip
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
  bindPickerChange: function (e) {
    this.setData({
      sex: e.detail.value
    })
  },
  checkIdCard: function(e){
    if (app.isCardID(e.detail.value)!=true){
      wx.showModal({
        title: '提示',
        content: app.isCardID(e.detail.value),
        showCancel: false,
        cancelText: '',
        cancelColor: '',
        confirmText: '确定',
        confirmColor: '',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }else{
      this.setData({
        idCard: e.detail.value
      })
    }
  },
  checkPhone: function(e){
    var that = this;
    if(that.data.len==0){
      that.setData({
        phone: e.detail.value
      })
    }else{
      if (!/^1[3|4|5|7|8]\d{9}$/.test(e.detail.value)) {
        wx.showModal({
          title: '提示',
          content: '您输入的手机号格式不正确',
          showCancel: false,
          cancelText: '',
          cancelColor: '',
          confirmText: '确定',
          confirmColor: '',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }else{
        that.setData({
          phone: e.detail.value
        })
      }
    }
  },
  name: function(e){
    this.setData({
      name: e.detail.value
    })
  },
  sub: function(){
    var that=this;
    if(that.data.name.length==0){
      wx.showModal({
        title: '提示',
        content: '请输入姓名',
        showCancel: false,
        cancelText: '',
        cancelColor: '',
        confirmText: '确定',
        confirmColor: '',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      return;
    } else if (that.data.idCard.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请输入身份证号',
        showCancel: false,
        cancelText: '',
        cancelColor: '',
        confirmText: '确定',
        confirmColor: '',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      return;
    } else if (that.data.phone.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请输入手机号',
        showCancel: false,
        cancelText: '',
        cancelColor: '',
        confirmText: '确定',
        confirmColor: '',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      return;
    } else{
      var sex='男';
      if(that.data.sex==1){
        sex='女';
      }
      if(that.data.len==0){
        wx.request({
          url: that.data.ip + '/applet/user/add_my_info',
          data: { 
            name: that.data.name,
            sex: sex,
            idNum: that.data.idCard,
            emerContact: that.data.phone
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": 'access_token=' + wx.getStorageSync('access_token')
          },
          success: function (res) {
            console.log(res)
            if(res.data.data){
              wx.redirectTo({
                url: '../usualContact/usualContact',
                success: function(res) {},
                fail: function(res) {},
                complete: function(res) {},
              })
            } else {
              wx.showModal({
                title: '提示',
                content: '添加失败',
                showCancel: false,
                cancelText: '',
                cancelColor: '',
                confirmText: '确定',
                confirmColor: '',
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
            }
          },
          fail: function (res) {
            console.log(res)
          },
          complete: function (res) {
          }
        })
      }else{
        wx.request({
          url: that.data.ip + '/applet/user/contacts_add',
          data: {
            name: that.data.name,
            sex: sex,
            idNum: that.data.idCard,
            phone: that.data.phone
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": 'access_token=' + wx.getStorageSync('access_token')
          },
          success: function (res) {
            console.log(res)
            if (res.data.data) {
              wx.redirectTo({
                url: '../usualContact/usualContact',
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
            }else{
              wx.showModal({
                title: '提示',
                content: '添加失败',
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
    }
  }
})