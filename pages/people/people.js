// pages/people/people.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ip: '',
    name: '',
    headImg: '',
    sex: '',
    integral: '0',
    coin: '',
    authority: '普通会员',
    tab: 'cards',
    cardsNum: '',
    cardPadding: '20',
    updown: 'up',
    cardsInfo: [],
    cardsList: [],
    powerId: '',
    activityList: [],
    contactList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(wx.getStorageSync('login')=='no'){
      wx.redirectTo({
        url: '../bindPhone/bindPhone',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    var ip = getApp().globalData.ip;
    var ipimg = getApp().globalData.ipimg;
    var that = this;
    that.setData({
      ip: ip,
      ipimg: ipimg
    })
    //获取用户信息
    getApp().getUserInfo(function (userInfo) {
      console.log(userInfo)
      if (userInfo.gender=0){
        userInfo.gender='女';
      }else{
        userInfo.gender='男';
      }
      that.setData({
        headImg: userInfo.avatarUrl,
        name: userInfo.nickName,
        sex: userInfo.gender
      })
    })
    wx.request({
      url: ip + '/applet/get_member_info',
      data: '',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
      },
      success: function (res) {        
        var data=JSON.parse(res.data.data)
        console.log(data);
        if(data.name){
          that.setData({
            name: data.name
          })
        }
        if (data.gender) {
          that.setData({
            sex: data.gender
          })
        }
        if(!data.coin){
          data.coin=0;
        }
        that.setData({
          coin: data.coin,
          cardsInfo: JSON.parse(data.couponsInfo),
          authority: res.data.message
        })
        //个人卡劵
        wx.request({
          url: ip + '/applet/user/member_coup_list',
          data: '',
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": 'access_token=' + wx.getStorageSync('access_token')
          },
          success: function (res) {
            if (!res.data.data){
              that.setData({
                cardsNum: 0
              })
            }else{
              var cards = JSON.parse(res.data.data)
              var cardsInfo = that.data.cardsInfo;
              for (var i = 0; i < cards.length; i++) {
                cards[i].couponDetail = cards[i].couponDetail.replace('<p>', '');
                cards[i].couponDetail = cards[i].couponDetail.replace('</p>', '');
                cards[i].couponDetail = cards[i].couponDetail.replace('<br/>', '');
                cards[i].cardExplain = cards[i].cardExplain.replace('<p>', '');
                cards[i].cardExplain = cards[i].cardExplain.replace('</p>', '');
                cards[i].cardExplain = cards[i].cardExplain.replace('<br/>', '');
                for (var j = 0; j < cardsInfo.length; j++) {
                  if (cards[i].id == cardsInfo[j].id) {
                    cards[i].actTimes = app.transDate3(cardsInfo[j].deadLine)
                  }
                }
              }
              console.log(cards)
              that.setData({
                cardsList: cards,
                cardsNum: cards.length
              })
            }
            
          },
          fail: function (res) {
            console.log(res)
          },
          complete: function (res) { },
        })
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) { },
    })
    if (options.myAct) {
      that.setData({
        tab: 'activity'
      })
      wx.request({
        url: that.data.ip + '/applet/user/my_activity',
        data: '',
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": 'access_token=' + wx.getStorageSync('access_token')
        },
        success: function (res) {
          var data = JSON.parse(res.data.data)
          console.log(data);
          for (var i = 0; i < data.length; i++) {
            data[i].startTime = app.transDate2(data[i].startTime);
            data[i].endTime = app.transDate2(data[i].endTime);
          }
          that.setData({
            activityList: data
          })
        },
        fail: function (res) {
          console.log(res)
        },
        complete: function (res) { },
      })
    }
    //会员积分
    wx.request({
      url: ip + '/applet/user/member_point',
      data: '',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
      },
      success: function (res) {
        if(res.data.data=="null"){
          var integral = 0
        }else{
          var integral = res.data.data
        }
        that.setData({
          integral: integral
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
  //tab切换交互信息
  tabClick: function(e){
    var tabData = e.currentTarget.dataset.tab
    this.setData({
      tab: tabData
    })
    var that=this;
    //卡券信息
    if(tabData=='cards'){

    }
    //权益
    else if(tabData=='power'){

    }
    //活动
    else if (tabData == 'activity') {
      wx.request({
        url: that.data.ip + '/applet/user/my_activity',
        data: '',
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": 'access_token=' + wx.getStorageSync('access_token')
        },
        success: function (res) {
          var data = JSON.parse(res.data.data)
          console.log(data);
          for(var i=0;i<data.length;i++){
            data[i].startTime = app.transDate2(data[i].startTime);
            data[i].endTime = app.transDate2(data[i].endTime);
          }
          that.setData({
            activityList: data
          })
        },
        fail: function (res) {
          console.log(res)
        },
        complete: function (res) { },
      })
    }
    //联系人列表
    else {
      // 获取常用联系人列表
      wx.request({
        url: that.data.ip + '/applet/user/get_contacts_list',
        data: '',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": 'access_token=' + wx.getStorageSync('access_token')
        },
        method: 'POST',
        dataType: '',
        success: function (res) {
          that.setData({
            contactList: JSON.parse(res.data.data)
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
  spread: function(){
    if(this.data.updown=='up'){
      this.setData({
        updown: 'down',
        cardHeight: 140,
        cardPadding: 56
      })
    }else{
      this.setData({
        updown: 'up',
        cardHeight: '',
        cardPadding: 20
      })
    }
  },
  powerOpen: function(e){
    var powerId = e.currentTarget.dataset.id
    this.setData({
      powerId: powerId
    })
  },
  delContact: function (e) {
    var that=this;
    console.log(e.currentTarget.dataset.id)
    wx.showModal({
      title: '提示',
      content: '确定要删除该联系人吗？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '',
      confirmText: '确定',
      confirmColor: '',
      success: function(res) {
        if(res.confirm){
          wx.request({
            url: that.data.ip + '/applet/user/contacts_del',
            data: { contactId: e.currentTarget.dataset.id },
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              "Cookie": 'access_token=' + wx.getStorageSync('access_token')
            },
            method: 'POST',
            dataType: '',
            success: function (res) {
              that.setData({
                contactList: JSON.parse(res.data.data)
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
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})