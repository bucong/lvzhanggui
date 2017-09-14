// pages/signInfo/signInfo.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: '',
    endTime: '',
    actName: '',
    originalPrice: '',
    price: '',
    peopleId: '',
    people: [
      // { id: 1, name: '张学友', age: '成人' },
      // { id: 2, name: '郭富城', age: '成人' },
      // { id: 3, name: '胡歌', age: '孩子'},
    ],
    totalFee: 0,
    totalPrice: '',
    free: 0,
    addressSpot: '',
    address: [
      // { id: 1, address: '19:30一号线莲花路站，南方商城' },
      // { id: 2, address: '19:30一号线莲花路站，南方商城' },
      // { id: 3, address: '19:30一号线莲花路站，南方商城' },
      // {id: 4, address: '19:30一号线莲花路站，南方商城'},
    ],
    addressWidth: 1100,
    safeShow: 'none',
    readSafe: '',
    contactsIdList: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('login') == 'no') {
      wx.redirectTo({
        url: '../bindPhone/bindPhone',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    var ip = getApp().globalData.ip;
    var that = this;
    that.setData({
      ip: ip
    })
    if(options.infoId){
      wx.setStorageSync('infoId', options.infoId);
    }
    //初始化活动详情
    wx.request({
      url: ip + '/applet/activity_info_detail',
      data: { infoId: wx.getStorageSync('infoId') },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
      },
      method: 'POST',
      dataType: '',
      success: function (res) {
        var data = JSON.parse(res.data.data);
        console.log(data)
        var address=JSON.parse(data.gatherPlace)
        for(var i=0;i<address.length;i++){
          address[i].time = app.transDate2(address[i].time)
        }
        that.setData({
          startTime: app.transDate2(data.startTime),
          endTime: app.transDate2(data.endTime),
          actName: data.actName,
          price: data.price,
          originalPrice: data.price,
          address: address,
          addressSpot: address[0].spot,
          addressWidth: address.length*260
        })
        //获取早鸟价
        wx.request({
          url: ip + '/applet/get_act_discount_money',
          data: { actId: wx.getStorageSync('actId') },
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": 'access_token=' + wx.getStorageSync('access_token')
          },
          method: 'POST',
          dataType: '',
          success: function (res) {
            var data = JSON.parse(res.data.data);
            if (data) {//有早鸟价
              that.setData({
                price: data
              })
            }
            //报名人员列表
            if (options.peopleList) {
              var people = JSON.parse(options.peopleList)
              var contactsIdList = '';
              console.log(people)
              for (var j = 0; j < people.length; j++) {
                contactsIdList += people[j].id + ';';
              }
              var originalPrice = that.data.originalPrice;
              var price = that.data.price;
              that.setData({
                people: people,
                contactsIdList: contactsIdList,
                totalFee: price * people.length,
                free: (originalPrice - price) * people.length,
                totalPrice: originalPrice*people.length
              })
            }
          },
          fail: function (res) {
            console.log(res)
          },
          complete: function (res) {
          },
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
  address: function(e){
    console.log(e.target.dataset.address)
    this.setData({
      addressSpot: e.target.dataset.address
    })
  },
  delShow: function(e){
    this.setData({
      peopleId: e.target.dataset.people
    })
  },
  delHide: function (e) {
    this.setData({
      peopleId: ''
    })
  },
  del: function(e){
    var that=this;
    wx.showModal({
      title: '提示',
      content: '确定要删除该成员吗？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '',
      confirmText: '确定',
      confirmColor: '',
      success: function(res) {
        if(res.confirm){
          console.log(e.target.dataset.people)
          var delVal = e.target.dataset.people;
          var people = app.delArr(that.data.people,delVal)
          var contactsIdList = '';
          for (var j = 0; j < people.length; j++) {
            contactsIdList += people[j].id + ';';
          }
          var originalPrice = that.data.originalPrice;
          var price = that.data.price;
          that.setData({
            people: people,
            contactsIdList: contactsIdList,
            totalFee: price * people.length,
            free: (originalPrice - price) * people.length,
            totalPrice: originalPrice * people.length
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    this.setData({
      peopleId: e.target.dataset.people
    })
  },
  safe: function(){
    this.setData({
      safeShow: 'block'
    })
  },
  safeHide: function () {
    this.setData({
      safeShow: 'none'
    })
  },
  checkboxChange: function(e){
    this.setData({
      readSafe: e.detail.value[0]
    })
  },
  pay: function(){
    var that = this;
    // 支付
    if(that.data.people.length==0){
      wx.showModal({
        title: '提示',
        content: '请添加报名成员！',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '',
        confirmText: '确定',
        confirmColor: '',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      return;
    }
    if(that.data.readSafe=='yes'){
      wx.navigateTo({
        url: '../pay/pay?contactsIdList=' + that.data.contactsIdList + '&addressSpot=' + that.data.addressSpot + '&totalPrice=' + that.data.totalPrice,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请阅读安全事项说明',
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
  }
    
})