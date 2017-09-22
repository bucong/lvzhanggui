//index.js
var app = getApp();
var searchbg = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAn4AAAA8CAIAAAB3vSB5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDphZjUzNmU4Yy0wNzMzLTQzMzYtOTVkMC0zMzU0OTAyZTdiNjYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjZGRTlFREY4M0MwMTFFN0E4M0ZFQzg2QzlCOTQ1NUIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjZGRTlFREU4M0MwMTFFN0E4M0ZFQzg2QzlCOTQ1NUIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMzRjNTIwNC1lYjMzLTQ1MTYtYTMzNy05NzFjNDFlMTc3ZjIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6YWY1MzZlOGMtMDczMy00MzM2LTk1ZDAtMzM1NDkwMmU3YjY2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")';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ip: '',
    carousel: [],
    search: '',
    searchbg: '',
    navIcon: [
      { img: '../images/ind_12.png', name: '我的活动', url: '../people/people?myAct=activity' },
      { img: '../images/ind_14.png', name: '领队风采', url: '../leaderList/leaderList' },
      { img: '../images/ind_09.png', name: '卡券', url: '../cardList/cardList' },
      { img: '../images/ind_06.png', name: '游记', url: '../travels/travels' }
    ],
    timeTab: 'thisMon',
    swiperCurrent: 0,  
    actHeight: 680,
    act: [],
    command: [],
    // like: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var ip = getApp().globalData.ip;
    var that = this;
    that.setData({
      ip: ip,
      searchbg: searchbg,
      ipimg: getApp().globalData.ipimg
    })
    //登录
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
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
        if (res.data.data==null) {
          wx.setStorageSync('login', false);
          wx.login({
            success: function (res) {
              var jsCode = res.code;
              wx.request({
                url: ip + '/applet/wx_login',
                data: {
                  appid: app.globalData.appid,
                  secret: app.globalData.secret,
                  jsCode: jsCode
                },
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                method: 'POST',
                dataType: '',
                success: function (res) {
                  console.log(res)
                  if (res.data.data) {
                    wx.setStorageSync('access_token', res.data.data);
                    wx.request({
                      url: ip + '/applet/get_member_info',
                      data: '',
                      method: 'POST',
                      header: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
                      },
                      success: function (res) {
                        if (res.data.data) {
                          wx.setStorageSync('login', true);
                        }
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
                complete: function (res) { },
              })
            },
            fail: function(res){
              console.log(res)
            },
            complete: function (res) {
              console.log(res)
             },
          })
        }else{
          wx.setStorageSync('login', true);
        }
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) { },
    })

    // 顶部轮播图
    wx.request({
      url: ip + '/applet/index_lunbo_img',
      data: '',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
      },
      method: 'POST',
      dataType: '',
      success: function (res) {
        console.log(JSON.parse(res.data.data))
        that.setData({
          carousel: JSON.parse(res.data.data)
        })
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
      },
    })
    //本月活动
    wx.request({
      url: ip + '/applet/index_activity_list',
      data: { types: 0 },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
      },
      method: 'POST',
      dataType: '',
      success: function (res) {
        var data = JSON.parse(res.data.data)
        console.log(data)
        if(data[0].length<=3){
          that.setData({
            actHeight: 330
          })
        }
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < data[i].length; j++) {
            data[i][j].startTime = app.transDate1(data[i][j].startTime);
          }
        }
        that.setData({
          act: data
        })
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
      },
    })
    //精品推荐
    wx.request({
      url: ip + '/applet/recomment_activity_list',
      data: '',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
      },
      method: 'POST',
      dataType: '',
      success: function (res) {
        var command = JSON.parse(res.data.data);
        console.log(command);
        that.setData({
          command: command
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
    wx.setNavigationBarTitle({ title: app.globalData.title });
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
  search: function(event){
    if (event.detail.value.length != 0){
      this.setData({
        searchbg: '#fff'
      })
    }else{
      this.setData({
        searchbg: searchbg
      })
    }
    this.setData({
      search: event.detail.value
    })
  },
  searchAct: function(e){
    console.log('点击了回车键')
    if (e.detail.value==''){
      wx.showModal({
        title: '提示',
        content: '您未输入任何搜索内容！',
        showCancel: false,
        cancelText: '',
        cancelColor: '',
        confirmText: '确定',
        confirmColor: '',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }else{
      wx.navigateTo({
        url: '../actList/actList?keyword=' + e.detail.value,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  timeTab: function(e){
    this.setData({
      timeTab: e.target.dataset.time,
      swiperCurrent: 0
    })
    if (e.target.dataset.time =='thisMon'){
      var val = 0;
    } else if (e.target.dataset.time == 'nextMon'){
      var val = 1;
    }else{
      var val = 2;
    }
    var ip = getApp().globalData.ip;
    var that = this;
    //本月活动
    wx.request({
      url: ip + '/applet/index_activity_list',
      data: { types: val },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
      },
      method: 'POST',
      dataType: '',
      success: function (res) {
        var data = JSON.parse(res.data.data)
        console.log(data)
        if (data[0].length <= 3) {
          that.setData({
            actHeight: 330
          })
        }else{
          that.setData({
            actHeight: 680
          })
        }
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < data[i].length; j++) {
            data[i][j].startTime = app.transDate1(data[i][j].startTime);
          }
        }
        that.setData({
          act: data
        })
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
      },
    })
  }
})
