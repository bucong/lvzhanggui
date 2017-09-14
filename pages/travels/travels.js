// pages/travels/travels.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ip: '',
    travelType: [],
    travelList: [],
    swiperCurrent: 0,
    tabLeft: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var ip = getApp().globalData.ip;
    var that = this;
    //游记类型
    wx.request({
      url: ip + '/applet/note_type_list',
      data: '',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
      },
      method: 'POST',
      dataType: '',
      success: function (res) {
        var travelType = JSON.parse(res.data.data);
        // console.log(travelType)
        //游记列表
        wx.request({
          url: ip + '/applet/note_list',
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
              data[k].takeNoteTime = app.transDate3(data[k].takeNoteTime);
            }
            var travelQR=[];//二维数组
            for (var i = 0; i < travelType.length;i++){
              var travel = [];//一维数组
              for(var j=0;j<data.length;j++){
                if (data[j].type == travelType[i].typeName){
                  travel.push(data[j]);
                }
              }
              travelQR.push(travel);
            }
            console.log(travelQR);
            that.setData({
              travelList: travelQR,
              travelType: travelType
            })
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
  swiperChange: function(e){
    var that=this;
    var n = e.detail.current;
    this.setData({
      swiperCurrent: n
    })
    if (n > 2 && n < that.data.travelType.length-4){
      this.setData({
        tabLeft: 120 * (n-2)
      })
    }else if(n<=2){
      this.setData({
        tabLeft: 0
      })
    }else{
      this.setData({
        tabLeft: (that.data.travelType.length - 6) * 120
      })
    }
  },
  tabChange: function (e) {
    this.setData({
      swiperCurrent: e.currentTarget.dataset.ind
    })
  }
})