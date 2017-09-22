// pages/peopleEdit/peopleEdit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    name: '',
    nickName: '',
    mobile: '',
    idNum: '',
    emerContact: '',
    passport: '',
    mengshow: 'none',
    value: '',
    placeholder: '',
    editaim: ''
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
    //获取用户信息
    wx.request({
      url: ip + '/applet/get_member_info',
      data: '',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
      },
      success: function (res) {
        var data = JSON.parse(res.data.data)
        console.log(data);
        if(data.name==null){
          data.name=''
        }
        if (data.nickName == null) {
          data.nickName = ''
        }
        if (data.idNum == null) {
          data.idNum = ''
        }
        if (data.emerContact == null) {
          data.emerContact = ''
        }
        if (data.passport == null) {
          data.passport = ''
        }
        that.setData({
          name: data.name,
          nickName: data.nickName,
          mobile: data.mobile,
          idNum: data.idNum,
          emerContact: data.emerContact,
          passport: data.passport
        })
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) { },
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
  edit: function(e){
    var that=this;
    var editaim=e.currentTarget.dataset.editaim
    this.setData({
      mengshow: 'block',
      editaim: editaim
    })
    if (editaim=='name'){
      that.setData({
        value: that.data.name,
        placeholder: '请输入姓名'
      })
    } else if (editaim =='idNum'){
      that.setData({
        value: that.data.idNum,
        placeholder: '证件号修改将清空活动记录'
      })
    } else if (editaim == 'passport') {
      that.setData({
        value: that.data.passport,
        placeholder: '请输入护照号'
      })
    } else if (editaim == 'emerContact') {
      that.setData({
        value: that.data.emerContact,
        placeholder: '请输入常用联系人/电话，如：张三/18888888888'
      })
    }
  },
  chooseNo: function () {
    this.setData({
      mengshow: 'none'
    })
  },
  chooseYes: function () {
    //修改信息请求
    var that=this;
    this.setData({
      mengshow: 'none'
    })
    if (that.data.editaim=='name'){
      var requestData = { editName: that.data.value, item: 'name' }
    } else if (that.data.editaim == 'idNum'){
      var requestData = { editIdNum: that.data.value, item: 'idNum' }
    } else if (that.data.editaim == 'emerContact') {
      var requestData = { editEmerContact: that.data.value, item: 'emerContact' }
    } else if (that.data.editaim == 'passport') {
      var requestData = { editPassport: that.data.value, item: 'passport' }
    }
    wx.request({
      url: that.data.ip + '/applet/user/edit_mer_contact',
      data: requestData,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
      },
      success: function (res) {
        if(res.data.data){
          wx.showModal({
            title: '提示',
            content: '修改成功！',
            showCancel: false,
            cancelText: '',
            cancelColor: '',
            confirmText: '确定',
            confirmColor: '',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
          var data = JSON.parse(res.data.data)
          console.log(data);
          if (data.name == null) {
            data.name = ''
          }
          if (data.idNum == null) {
            data.idNum = ''
          }
          if (data.emerContact == null) {
            data.emerContact = ''
          }
          if (data.passport == null) {
            data.passport = ''
          }
          that.setData({
            name: data.name,
            nickName: data.nickName,
            mobile: data.mobile,
            idNum: data.idNum,
            emerContact: data.emerContact,
            passport: data.passport
          })
        }
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) { },
    })
  },
  textInput: function(e){
    this.setData({
      value: e.detail.value
    })
  }
})