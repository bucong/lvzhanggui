// pages/myActivity/myActivity.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ip: '',
    infoId: '',//活动
    actId:'',//批次
    carousel: [],
    operationId: '',
    operation: '删除',
    actPartId: '',
    operationShow: 'none',
    applayStatus: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var ip = getApp().globalData.ip;
    var ipimg = getApp().globalData.ipimg;
    var that = this;
    //获取报名活动信息
    wx.request({
      url: ip + '/applet/user/act_apply_detail',
      data: { 
        actId: options.actId 
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
      },
      success: function (res) {
        var data=JSON.parse(res.data.data);
        console.log(data);
        var gatherPlace = JSON.parse(data.activity.gatherPlace);
        for(var i=0;i<gatherPlace.length;i++){
          gatherPlace[i].time = app.getDate(gatherPlace[i].time);
        }
        var actApplyList = data.actApplyList;
        var actStatus=data.activity.status;
        for (var j = 0; j < actApplyList.length; j++){
          actApplyList[j].parMobile = actApplyList[j].parMobile.substring(0, 3) + '****' + actApplyList[j].parMobile.substring(7, 11);
          actApplyList[j].parNum = actApplyList[j].parNum.substring(0, 4) + '**********' + actApplyList[j].parNum.substring(14, 18);
          if (actApplyList[j].status==0){
            actApplyList[j].status = '已付全款';
            if (actStatus==1){
              actApplyList[j].usePoint = '取消报名';//操作
              actApplyList[j].memberGrade = '930';//列表总宽度
              actApplyList[j].remarks = '180';//列表初始位置（为负值）
              actApplyList[j].isMember = 'showOperation';//列表操作事件名
              actApplyList[j].clubRemarks = '左滑取消报名';//列表操作显示名称
            }else{
              actApplyList[j].memberGrade = '750';
              actApplyList[j].remarks = '0';
              actApplyList[j].clubRemarks = '';
            }
          } else if (actApplyList[j].status == 1){
            actApplyList[j].status = '待付余款';
            actApplyList[j].usePoint = '支付余款';
            actApplyList[j].clubRemarks = '左滑支付余款';//列表操作显示名称
            actApplyList[j].isMember = 'payRest';//列表操作事件名
            if (actStatus == 1) {
              actApplyList[j].memberGrade = '1110';
              actApplyList[j].remarks = '360';
            }else{
              actApplyList[j].memberGrade = '930';
              actApplyList[j].remarks = '180';
            }
          } else if (actApplyList[j].status == 2) {
            actApplyList[j].status = '待退款';
            actApplyList[j].clubRemarks = '';//列表操作显示名称
            actApplyList[j].memberGrade = '750';
            actApplyList[j].remarks = '0';
          } else if (actApplyList[j].status == 3) {
            actApplyList[j].status = '已退款';
            actApplyList[j].usePoint = '删除';
            actApplyList[j].isMember = 'showDel';//列表操作事件名
            actApplyList[j].clubRemarks = '左滑删除';//列表操作显示名称
            actApplyList[j].memberGrade = '930';
            actApplyList[j].remarks = '180';
          }
        }
        that.setData({
          ip: ip,
          ipimg: ipimg,
          actId: options.actId,
          infoId: data.activity.infoId,
          carousel: data.imgList,
          actName: data.activity.actName,
          price: data.activity.price,
          startTime: app.transDate2(data.activity.startTime),
          endTime: app.transDate2(data.activity.endTime),
          gatherPlace: gatherPlace,
          leaderList: data.leaderList,
          actApplyList: data.actApplyList,
          allPayMoney: data.allPayMoney,
          applayStatus: data.activity.applayStatus
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
  addPeople: function(){
    wx.setStorageSync('actId', this.data.actId)
    wx.navigateTo({
      url: '../signInfo/signInfo?infoId='+this.data.infoId,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  mytouchstart: function(e){
    console.log(e.touches[0].pageX);
    this.setData({
      start: e.touches[0].pageX
    })
  },
  mytouchmove: function (e) {
    var moveX = e.touches[0].pageX
    if(moveX < this.data.start){
      this.setData({
        operationId: e.currentTarget.dataset.id
      })
    }else{
      this.setData({
        operationId: ''
      })
    }
  },
  cancel: function(){
    this.setData({
      operationShow: 'none'
    })
  },
  showOperation: function (e) {
    this.setData({
      operationShow: 'block',
      actPartId: e.currentTarget.dataset.actpartid,
      operation: '取消报名'
    })
  },
  showDel: function(e){
    this.setData({
      operationShow: 'block',
      actPartId: e.currentTarget.dataset.actpartid,
      operation: '删除'
    })
  },
  payRest: function(e){
    var that = this;
    wx.request({
      url: that.data.ip + '/applet/user/pay_balance',
      data: {
        actPartId: e.currentTarget.dataset.actpartid
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
        wx.navigateTo({
          url: '../requestPay/requestPay?money=' + data.price + '&orderStr=' + data.orderId,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
      },
    })
  },
  sureOperation: function(){
    var that=this;
    if (that.data.operation=='取消报名'){
      wx.request({
        url: that.data.ip + '/applet/user/act_part_cancel',
        data: {
          actPartId: that.data.actPartId
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": 'access_token=' + wx.getStorageSync('access_token')
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 0) {
            that.setData({
              operationShow: 'none'
            })
            wx.redirectTo({
              url: '../myActivity/myActivity?actId=' + that.data.actId,
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
          }
        },
        fail: function (res) {
          console.log(res)
        },
        complete: function (res) { },
      })
    } else if (that.data.operation=='删除'){
      wx.request({
        url: that.data.ip + '/applet/user/act_part_delete',
        data: {
          actPartId: that.data.actPartId
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": 'access_token=' + wx.getStorageSync('access_token')
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 0) {
            that.setData({
              operationShow: 'none'
            })
            wx.redirectTo({
              url: '../myActivity/myActivity?actId=' + that.data.actId,
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          }

        },
        fail: function (res) {
          console.log(res)
        },
        complete: function (res) { },
      })
    }
  }
})