// pages/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ip: '',
    totalFee: '',
    actualFee: '',
    contactsIdList: '',
    addressSpot: '',
    payList: [],
    payType: '',
    memberCouponId: '',
    canUsePoint: '',
    pointUser: '',
    useIntegral: 0,
    usePoint: '',
    pointCheck: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var ip = getApp().globalData.ip;
    var that = this;
    that.setData({
      ip: ip,
      addressSpot: options.addressSpot,
      contactsIdList: options.contactsIdList,
      totalFee: options.totalPrice,
      memberCouponId: options.memberCouponId
    })
    
    //支付方式
    wx.request({
      url: ip + '/applet/get_club_info',
      data: '',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
      },
      method: 'POST',
      dataType: '',
      success: function (res) {
        var data = JSON.parse(res.data.data).payTypeList;
        var payList=[];
        for(var k=0;k<data.length;k++){
          var obj={ id: '', name: '' };
          if(data[k] == 0){
            obj.id = 0;
            obj.name = "全额支付";
          } else if (data[k] == 1){
            obj.id = 1;
            obj.name = "定金支付";
          } else if (data[k] == 2) {
            obj.id = 2;
            obj.name = "其他支付";
          } else if (data[k] == 3) {
            obj.id = 3;
            obj.name = "金币支付";
          }
          payList.push(obj);
        }
        that.setData({
          payList: payList,
          payType: payList[0].id
        })
        //支付金额
        wx.request({
          url: ip + '/applet/user/get_order_detail',
          data: {
            activityId: wx.getStorageSync('actId'),
            contactsIdList: that.data.contactsIdList,
            payType: payList[0].id,
            memberCouponId: that.data.memberCouponId
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": 'access_token=' + wx.getStorageSync('access_token')
          },
          method: 'POST',
          dataType: '',
          success: function (res) {
            if(res.data.data){
              var data = JSON.parse(res.data.data)
              console.log(data)
              that.setData({
                actualFee: data.allPayMoney
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
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      payType: e.detail.value
    })
    if (e.detail.value!=0){
      this.setData({
        useIntegral: 0,
        usePoint: '',
        pointCheck: false
      })
    }
    var that=this;
    if (e.detail.value!=2){
      //支付金额
      wx.request({
        url: that.data.ip + '/applet/user/get_order_detail',
        data: {
          activityId: wx.getStorageSync('actId'),
          contactsIdList: that.data.contactsIdList,
          payType: e.detail.value,
          memberCouponId: that.data.memberCouponId,
          usePoint: that.data.usePoint
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": 'access_token=' + wx.getStorageSync('access_token')
        },
        method: 'POST',
        dataType: '',
        success: function (res) {
          var data = JSON.parse(res.data.data)
          console.log(data)
          that.setData({
            actualFee: data.allPayMoney
          })
          if (e.detail.value==0){
            wx.request({
              url: that.data.ip + '/applet/user/get_member_act_discountRules',
              data: { actId: wx.getStorageSync('actId'), contactsIdList: that.data.contactsIdList },
              header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": 'access_token=' + wx.getStorageSync('access_token')
              },
              method: 'POST',
              dataType: '',
              success: function (res) {
                var data = JSON.parse(res.data.data);
                console.log(data)
                if(data.canUsePoint){
                  that.setData({
                    canUsePoint: data.canUsePoint,
                    pointUser: data.pointUser
                  })
                }
              },
              fail: function (res) {
                console.log(res)
              },
              complete: function (res) {
              },
            })
          }else{
            that.setData({
              canUsePoint: '',
              pointUser: ''
            })
          }
        },
        fail: function (res) {
          console.log(res)
        },
        complete: function (res) {
        },
      })
    }else{
      that.setData({
        actualFee: 0
      })
    }
    
  },
  checkboxChange: function (e) {
    console.log(e.detail.value[0])
    if (e.detail.value[0]!='undefined'){
      this.setData({
        useIntegral: e.detail.value[0] / 100,
        usePoint: 1
      })
    }else{
      this.setData({
        useIntegral: 0,
        usePoint: ''
      })
    }
  },
  requestPayment: function () {
    var that = this;
    that.setData({
      loading: true
    })
    var ip=that.data.ip;
    //提交订单，获取订单号和价格
    wx.request({
      url: ip + '/applet/user/act_apply',
      data: {
        activityId: wx.getStorageSync('actId'),
        contactsIdList: that.data.contactsIdList,
        actAplGatherPlace: that.data.addressSpot,
        payType: that.data.payType,
        memberCouponId: that.data.memberCouponId,
        usePoint: that.data.usePoint
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
      },
      method: 'POST',
      dataType: '',
      success: function (res) {
        if(!res.data.data){
          wx.showModal({
            title: '提示',
            content: '支付成功！',
            showCancel: false,
            cancelText: '',
            cancelColor: '',
            confirmText: '确定',
            confirmColor: '',
            success: function (res) {
              wx.reLaunch({
                url: '../index/index',
                success: function(res) {},
                fail: function(res) {},
                complete: function(res) {},
              })
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        } else {
          var applyOrderId = JSON.parse(res.data.data).applyOrderId;
          //付费，获取支付参数
          wx.request({
            url: ip + '/applet/user/applet_wx_pay',
            data: {
              payOrderIdsStr: applyOrderId
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              "Cookie": 'access_token=' + wx.getStorageSync('access_token')
            },
            method: 'POST',
            dataType: '',
            success: function (res) {
              if(res.data.data){
                var payargs = JSON.parse(res.data.data);
                console.log(payargs)
                wx.requestPayment({
                  timeStamp: payargs.timeStamp,
                  nonceStr: payargs.nonceStr,
                  package: payargs.package,
                  signType: payargs.signType,
                  paySign: payargs.paySign,
                  success: function (res) {
                    console.log(res)
                    wx.showModal({
                      title: '提示',
                      content: "支付成功!",
                      showCancel: false,
                      confirmText: "确定",
                      cancelText: "取消",
                      success: function (res) {
                        if (res.confirm) {
                          wx.reLaunch({
                            url: '../index/index',
                            success: function (res) { },
                            fail: function (res) { },
                            complete: function (res) { },
                          })
                        }
                      }
                    })
                  },
                  fail: function (res) {
                    console.log(res)
                    wx.showModal({
                      title: '提示',
                      content: "支付失败，请重新报名!",
                      showCancel: false,
                      confirmText: "确定",
                      cancelText: "取消",
                      success: function (res) {
                        if (res.confirm) {
                          wx.reLaunch({
                            url: '../index/index',
                            success: function (res) { },
                            fail: function (res) { },
                            complete: function (res) { },
                          })
                        }
                      }
                    })
                  },
                  complete: function (res) {
                  },
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
                  success: function(res) {
                    wx.reLaunch({
                      url: '../index/index',
                      success: function(res) {},
                      fail: function(res) {},
                      complete: function(res) {},
                    })
                  },
                  fail: function(res) {},
                  complete: function(res) {},
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
        
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
      },
    })
  }
})