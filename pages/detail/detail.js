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
    alreadyHeight: 120,
    showpay: 'none',
    group: [],
    showGroup: 'none',
    wxImg: '',
    kfImg: '',
    phone: '18764538276',
    consult: 'none',
    seal: 'block',
    login: '',
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
    WxParse.emojisInit('[]', "/wxParse/emojis/", {});
    if (options.infoId) {
      wx.setStorageSync('infoId', options.infoId);
      this.setData({
        id: options.infoId
      })
    }
    var ip = getApp().globalData.ip;
    var ipimg = getApp().globalData.ipimg;
    var that = this;
    that.setData({
      ip: ip,
      ipimg: ipimg,
      login: wx.getStorageSync('login')
    })
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
        //活动轮播图
        var carousel = data.detailImg;
        carousel = carousel.substring(2, carousel.length - 2);
        carousel = carousel.split('","');
        var location = data.destination;
        location = JSON.parse(location);
        if (!location.province) {
          location.province = ''
        }
        if (!location.counties) {
          location.counties = ''
        }
        if (!location.street) {
          location.street = ''
        }
        location = location.province + location.city + location.counties + location.street;
        var batchdata = JSON.parse(data.actBatchJSON);//时间
        var batchList = [];
        for (var j = 0; j < batchdata.length; j++) {
          if (batchdata[j].applayStatus == 3) {
            continue;
          }
          batchdata[j].startTime = app.transDate(batchdata[j].startTime);
          batchList.push(batchdata[j]);
        }
        console.log(batchList)
        data.actDetail = data.actDetail.replace('src="', 'src="' + ipimg);
        WxParse.wxParse('actDetail', 'html', data.actDetail, that);
        data.feeDetail = data.feeDetail.replace('src="', 'src="' + ipimg);
        WxParse.wxParse('feeDetail', 'html', data.feeDetail, that);
        data.travelTips = data.travelTips.replace('src="', 'src="' + ipimg);
        WxParse.wxParse('travelTips', 'html', data.travelTips, that);
        for (var k = 0; k < data.scheduleList.length; k++) {
          data.scheduleList[k].days = 'day' + k;
          data.scheduleList[k].detail = data.scheduleList[k].detail.replace('src="', 'src="' + ipimg);
          WxParse.wxParse(data.scheduleList[k].days, 'html', data.scheduleList[k].detail, that);
        }
        that.setData({
          carousel: carousel,
          actName: data.actName,
          price: data.price,
          location: location,
          batchList: batchList,
          date: data.scheduleList,
          applyLimit: data.applyLimit
        })
        if (batchList.length != 0) {
          that.setData({
            timeId: batchList[0].id
          })
          wx.setStorageSync('actId', batchList[0].id);
        }
        if (options.actId) {
          that.setData({
            timeId: options.actId
          })
          wx.setStorageSync('actId', options.actId);
        }
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
            for (var k = 0; k < data.length; k++) {
              rand++;
              if (rand >= 12) {
                rand = 0;
              }
              data[k].due = rand;
            }
            console.log(data)
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
      data: { actInfoId: wx.getStorageSync('actInfo') },
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
    console.log(that.data.timeId)
    if (that.data.batchList.length==0){
      wx.showModal({
        title: '提示',
        content: '该活动已结束',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '',
        confirmText: '确定',
        confirmColor: '',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }else{
      if (that.data.login) {
        wx.navigateTo({
          url: '../signInfo/signInfo?infoId=' + that.data.id,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      } else {
        that.setData({
          bindBottom: 0
        })
      }
    }
    
  },
  phoneCheck: function (e) {
    if (/^1[3|4|5|7|8]\d{9}$/.test(e.detail.value)) {
      this.setData({
        bg: '#3dbf7b',
        bindphone: e.detail.value
      })
      console.log(this.data.bindphone);
    } else {
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
  sendCheck: function () {
    var that = this;
    var ip = getApp().globalData.ip;
    if (this.data.bg == '#3dbf7b') {
      that.setData({
        bg: 'grey'
      })
      wx.setStorageSync('checkPhone', that.data.bindphone);
      var i = 60;
      var time = setInterval(function () {
        i--;
        that.setData({
          bindstatus: '已发送(' + i + ')'
        })
        if (i == 0) {
          clearInterval(time);
          that.setData({
            bindstatus: '免费获取',
            bg: '#3dbf7b'
          })
        }
      }, 1000)
      wx.request({
        url: ip + '/applet/send_verify_code',
        data: { phone: that.data.bindphone },
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
  bindPhone: function () {
    var that = this;
    var ip = getApp().globalData.ip;
    if (this.data.phone == '') {
      wx.showModal({
        title: '提示',
        content: "请输入手机号",
        showCancel: false,
        confirmText: "确定",
        cancelText: "取消"
      })
    } else if (this.data.checkNum == '') {
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
    } else {
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
          if (res.data.data) {
            wx.setStorageSync('login', true);
            that.setData({
              bindBottom: '-1000',
              login: true
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
    }
  },
  closeBindPhone: function () {
    this.setData({
      bindBottom: '-1000'
    })
  }
})