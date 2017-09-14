// pages/detail/detail.js
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ip: '',
    id: '',
    carousel: [],
    tab: 'intro',
    actName: '',
    birdPrice: '',
    discount: '',
    price: '',
    location: '',
    batchList: [],
    timeId: '',
    timeChoose: 0,
    people: [],
    peopleWidth: 1000,
    peopleNum: '',
    applyLimit: '',
    alreadyAttention: 'flex',
    alreadyHeight: 220,
    showpay: 'none',
    group: [],
    showGroup: 'none',
    wxImg: '',
    kfImg: '',
    phone: '18764538276',
    consult: 'none',
    seal: 'block'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    WxParse.emojisInit('[]', "/wxParse/emojis/", {});
    if (options.infoId) {
      wx.setStorageSync('infoId', options.infoId);
      this.setData({
        id: options.infoId
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
    var ip = getApp().globalData.ip;
    var that = this;
    that.setData({
      ip: ip
    })
    //初始化活动详情
    wx.request({
      url: ip + '/applet/activity_info_detail',
      data: { infoId: wx.getStorageSync('infoId')},
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
      },
      method: 'POST',
      dataType: '',
      success: function (res) {
        var data = JSON.parse(res.data.data);
        console.log(data)
        //活动轮播图
        var carousel = data.detailImg;
        carousel = carousel.substring(2, carousel.length-2);
        carousel = carousel.split('","');
        var location = data.destination;
        location = JSON.parse(location);
        if (!location.province){
          location.province=''
        }
        if (!location.counties) {
          location.counties = ''
        }
        if (!location.street) {
          location.street = ''
        }
        location = location.province + location.city + location.counties + location.street;
        var batchList = data.batchList;//时间
        for (var j = 0; j < batchList.length;j++){
          batchList[j].startTime = app.transDate(batchList[j].startTime);
        }
        data.actDetail = data.actDetail.replace('src="', 'src="' + ip);
        WxParse.wxParse('actDetail', 'html', data.actDetail, that);
        data.feeDetail = data.feeDetail.replace('src="', 'src="' + ip);
        WxParse.wxParse('feeDetail', 'html', data.feeDetail, that);
        data.travelTips = data.travelTips.replace('src="', 'src="' + ip);
        WxParse.wxParse('travelTips', 'html', data.travelTips, that);
        // for (var k = 0; k < data.scheduleList.length;k++){
        //   data.scheduleList[k].days = 'day'+k;
        //   data.scheduleList[k].detail = data.scheduleList[k].detail.replace('src="', 'src="' + ip);
        //   WxParse.wxParse(data.scheduleList[k].days, 'html', data.scheduleList[k].detail, that);
        // }
        for (var k = 0; k < data.scheduleList.length; k++) {
          data.scheduleList[k].detail = data.scheduleList[k].detail.substring(3, data.scheduleList[k].detail.length-4);
        }
        that.setData({
          carousel: carousel,
          actName: data.actName,
          price: data.price,
          location: location,
          batchList: batchList,
          timeId: data.batchList[0].id,
          date: data.scheduleList,
          applyLimit: data.applyLimit
        })
        wx.setStorageSync('actId', data.batchList[0].id);
        //参加人员
        wx.request({
          url: ip + '/applet/get_act_apply_list',
          data: { actId: that.data.timeId },
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": 'access_token=' + wx.getStorageSync('access_token')
          },
          method: 'POST',
          dataType: '',
          success: function (res) {
            var data = JSON.parse(res.data.data);
            var rand = Math.round(Math.random() * 12);
            for(var k=0;k<data.length;k++){
              rand++;
              if(rand >= 12){
                rand=0;
              }
              data[k].due = rand;
            }
            console.log(data)
            that.setData({
              people: data,
              peopleNum: data.length,
              peopleWidth: data.length*150
            })
          },
          fail: function (res) {
            console.log(res)
          },
          complete: function (res) {
          },
        })
        //获取早鸟价
        wx.request({
          url: ip + '/applet/get_act_discount_money',
          data: { actId: that.data.timeId },
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": 'access_token=' + wx.getStorageSync('access_token')
          },
          method: 'POST',
          dataType: '',
          success: function (res) {
            var data = JSON.parse(res.data.data);
            console.log(data)
            if(data){//有早鸟价
              data+='-';
              that.setData({
                birdPrice: data
              })
            }else{//无早鸟价
              that.setData({
                birdPrice: '',
                discount: 'true'
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
    //活动二维码及客服信息
    wx.request({
      url: ip + '/applet/get_club_config',
      data: '',
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
          wxImg: data.wxImg,
          phone: data.mobile,
          kfImg: data.kfImg
        })

      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
      },
    })
    //领队列表
    wx.request({
      url: ip + '/applet/leader_list',
      data: { actInfoId: wx.getStorageSync('actInfo')},
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
          group: data
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
  tab: function(e){
    this.setData({
      tab: e.target.dataset.tab
    })
  },
  times: function (e) {
    var timeId = e.target.dataset.timeid;
    var ip = this.data.ip;
    wx.setStorageSync('actId', timeId)
    this.setData({
      timeId: timeId,
      timeChoose: 1
    })
    var that=this;
    //获取早鸟价
    wx.request({
      url: ip + '/applet/get_act_discount_money',
      data: { actId: timeId },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
      },
      method: 'POST',
      dataType: '',
      success: function (res) {
        var data = JSON.parse(res.data.data);
        console.log(data)
        if (data) {//有早鸟价
          data += '-';
          that.setData({
            birdPrice: data
          })
        } else {//无早鸟价
          that.setData({
            birdPrice: '',
            discount: 'true'
          })
        }
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
      },
    })
    //参加人员
    wx.request({
      url: ip + '/applet/get_act_apply_list',
      data: { actId: timeId },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
      },
      method: 'POST',
      dataType: '',
      success: function (res) {
        var data = JSON.parse(res.data.data);
        console.log(data)
        var rand = Math.round(Math.random() * 12);
        for (var k = 0; k < data.length; k++) {
          rand++;
          if (rand >= 12) {
            rand = 0;
          }
          data[k].due = rand;
        }
        that.setData({
          people: data,
          peopleNum: data.length,
          peopleWidth: data.length * 150
        })
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
      },
    })
  },
  closeAttention: function(){
    this.setData({
      alreadyAttention: 'none',
      alreadyHeight: 120
    })
  },
  showPay: function(){
    this.setData({
      showpay: 'block'
    })
  },
  closePay: function () {
    this.setData({
      showpay: 'none'
    })
  },
  closeGroup: function(){
    this.setData({
      showGroup: 'none'
    })
  },
  showGroup: function () {
    this.setData({
      showGroup: 'block',
      seal: 'block'
    })
  },
  closeSeal: function(){
    this.setData({
      seal: 'none'
    })
  },
  consult: function () {
    this.setData({
      consult: 'block'
    })
  },
  closeConsult: function () {
    this.setData({
      consult: 'none'
    })
  },
  call: function(){
    var that=this;
    wx.makePhoneCall({
      phoneNumber: that.data.phone //仅为示例，并非真实的电话号码
    })
  },
  sign: function(){
    var that=this;
    if(that.data.timeChoose==1){
      wx.navigateTo({
        url: '../signInfo/signInfo?infoId=' + that.data.id,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请确认出发时间',
        showCancel: false,
        cancelText: '',
        cancelColor: '',
        confirmText: '确定',
        confirmColor: '',
        success: function(res) {
          that.setData({
            timeChoose: 1
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    }
    
  }
})