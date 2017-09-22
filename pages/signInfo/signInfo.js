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
    price: '',
    earlyPrice: '',
    peopleId: '',
    people: [],
    totalFee: 0,
    totalPrice: '',
    cardDisCount: 0,
    free: 0,
    addressSpot: '',
    address: [],
    cards: [],
    memberCouponId: '',
    discount: '',
    addressWidth: 1100,
    safeShow: 'none',
    readSafe: '',
    contactsIdList: ''
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
          address[i].time = app.getDate(address[i].time)
        }
        var batch = data.batchList;
        for(var k=0;k<batch.length;k++){
          if (batch[k].id == wx.getStorageSync('actId')) {
            var actStartTime = app.transDate2(batch[k].startTime);
            var actEndTime = app.transDate2(batch[k].endTime);
          }
        }
        that.setData({
          startTime: actStartTime,
          endTime: actEndTime,
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
                earlyPrice: data
              })
            }else{
              earlyPrice: that.data.price
            }
            //报名人员列表
            if (options.peopleList) {
              var people = JSON.parse(options.peopleList)
              var contactsIdList = '';
              console.log(people)
              for (var j = 0; j < people.length; j++) {
                contactsIdList += people[j].id + ';';
              }
              var earlyPrice = that.data.earlyPrice;
              var price = that.data.price;
              that.setData({
                people: people,
                contactsIdList: contactsIdList,
                totalFee: earlyPrice * people.length,
                free: (price - earlyPrice) * people.length,
                totalPrice: price*people.length
              })
              //使用卡劵和积分
              wx.request({
                url: ip + '/applet/user/get_member_act_discountRules',
                data: { actId: wx.getStorageSync('actId'), contactsIdList: contactsIdList  },
                header: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  "Cookie": 'access_token=' + wx.getStorageSync('access_token')
                },
                method: 'POST',
                dataType: '',
                success: function (res) {
                  var data = JSON.parse(res.data.data);
                  console.log(data)
                  that.setData({
                    cards: JSON.parse(data.memberDiscountRulesList)
                  })
                },
                fail: function (res) {
                  console.log(res)
                },
                complete: function (res) {
                },
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
          var earlyPrice = that.data.earlyPrice;
          var price = that.data.price;
          that.setData({
            people: people,
            contactsIdList: contactsIdList,
            totalFee: earlyPrice * people.length,
            free: (price - earlyPrice) * people.length,
            totalPrice: price * people.length
          })
          console.log(contactsIdList)
          //使用卡劵
          if (contactsIdList.length>0){
            wx.request({
              url: that.data.ip + '/applet/user/get_member_act_discountRules',
              data: { actId: wx.getStorageSync('actId'), contactsIdList: contactsIdList },
              header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": 'access_token=' + wx.getStorageSync('access_token')
              },
              method: 'POST',
              dataType: '',
              success: function (res) {
                var data = JSON.parse(res.data.data);
                that.setData({
                  cards: JSON.parse(data.memberDiscountRulesList)
                })
                if (JSON.parse(data.memberDiscountRulesList).length==0){
                  that.setData({
                    cardDisCount: 0
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
          
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    this.setData({
      peopleId: e.target.dataset.people
    })
  },
  //选择优惠卡
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var data = e.detail.value.split(';');
    this.setData({
      memberCouponId: data[0],
      cardDisCount: this.data.earlyPrice - data[1] + (this.data.price - this.data.earlyPrice)
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
        url: '../pay/pay?contactsIdList=' + that.data.contactsIdList + '&addressSpot=' + that.data.addressSpot + '&totalPrice=' + that.data.totalPrice + '&memberCouponId=' + that.data.memberCouponId,
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