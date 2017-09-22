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
    integral: 0,
    coin: 0,
    authority: '普通会员',
    tab: 'cards',
    cardsNum: '',
    cardPadding: '20',
    updown: 'up',
    cardsInfo: [],
    cardsList: [],
    powerId: '',
    activityList: [],
    contactList: [],
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
    if (!wx.getStorageSync('login')) {
      this.setData({
        name: '授权登录',
        headImg: '../images/unlogin_03.png',
        login: wx.getStorageSync('login')
      })
    }else{
      var ip = getApp().globalData.ip;
      var ipimg = getApp().globalData.ipimg;
      var that = this;
      that.setData({
        ip: ip,
        ipimg: ipimg,
        login: true
      })
      //获取用户信息
      getApp().getUserInfo(function (userInfo) {
        console.log(userInfo)
        if (userInfo.gender = 0) {
          userInfo.gender = '女';
        } else {
          userInfo.gender = '男';
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
          var data = JSON.parse(res.data.data)
          console.log(data);
          if (data.name) {
            that.setData({
              name: data.name
            })
          }
          if (data.gender) {
            that.setData({
              sex: data.gender
            })
          }
          if (!data.coin) {
            data.coin = 0;
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
              if (!res.data.data) {
                that.setData({
                  cardsNum: 0
                })
              } else {
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
      if (options.myAct =='activity') {
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
      } else if (options.myAct == 'contact'){
        that.setData({
          tab: 'contact'
        })
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
            var data = JSON.parse(res.data.data);
            for (var k = 0; k < data.length; k++) {
              data[k].mobile = data[k].mobile.substring(0, 3) + '****' + data[k].mobile.substring(7, 11);
              data[k].idNum = data[k].idNum.substring(0, 4) + '**********' + data[k].idNum.substring(14, 18);
            }
            that.setData({
              contactList: data
            })
          },
          fail: function (res) {
            console.log(res)
          },
          complete: function (res) {
          },
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
          if (res.data.data == "null") {
            var integral = 0
          } else {
            var data = JSON.parse(res.data.data);
            var integral = data.currentPoint;
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
    }
    
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
  login:function(){
    if (!this.data.login) {
      this.setData({
        bindBottom: 0
      })
    }
  },
  loginCoin: function () {
    if(this.data.login){
      wx.navigateTo({
        url: '../myCoin/myCoin',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }else{
      this.setData({
        bindBottom: 0
      })
    }
  },
  loginEdit: function () {
    if (this.data.login) {
      wx.navigateTo({
        url: '../peopleEdit/peopleEdit',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else{
      this.setData({
        bindBottom: 0
      })
    }
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
          var data = JSON.parse(res.data.data);
          for(var k=0;k<data.length;k++){
            data[k].mobile = data[k].mobile.substring(0, 3) + '****' + data[k].mobile.substring(7, 11);
            data[k].idNum = data[k].idNum.substring(0, 4) + '**********' + data[k].idNum.substring(14, 18);
          }
          that.setData({
            contactList: data
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
              var data = JSON.parse(res.data.data);
              for (var k = 0; k < data.length; k++) {
                data[k].mobile = data[k].mobile.substring(0, 3) + '****' + data[k].mobile.substring(7, 11);
                data[k].idNum = data[k].idNum.substring(0, 4) + '**********' + data[k].idNum.substring(14, 18);
              }
              that.setData({
                contactList: data
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
            var ip = getApp().globalData.ip;
            var ipimg = getApp().globalData.ipimg;
            var that = this;
            that.setData({
              ip: ip,
              ipimg: ipimg,
              login: true
            })
            //获取用户信息
            getApp().getUserInfo(function (userInfo) {
              console.log(userInfo)
              if (userInfo.gender = 0) {
                userInfo.gender = '女';
              } else {
                userInfo.gender = '男';
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
                var data = JSON.parse(res.data.data)
                console.log(data);
                if (data.name) {
                  that.setData({
                    name: data.name
                  })
                }
                if (data.gender) {
                  that.setData({
                    sex: data.gender
                  })
                }
                if (!data.coin) {
                  data.coin = 0;
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
                    if (!res.data.data) {
                      that.setData({
                        cardsNum: 0
                      })
                    } else {
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