Page({
  data: {
    latitude: 31.12,
    longitude: 121.38,
    markers: [{
      latitude: 31.12,
      longitude: 121.38,
      name: '上海硕道'
    }],
    id: ''
  },
  onLoad: function (options) {
    var ip = getApp().globalData.ip;
    var that = this;
    that.setData({
      ip: ip,
      id: options.id
    })
    //初始化活动详情
    wx.request({
      url: ip + '/applet/activity_info_detail',
      data: { infoId: that.data.id },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": 'access_token=' + wx.getStorageSync('access_token')
      },
      method: 'POST',
      dataType: '',
      success: function (res) {
        var data = JSON.parse(res.data.data);
        console.log(data)
        var location = data.actLocation.split(',');
        console.log(location)
        that.setData({
          latitude: location[1],
          longitude: location[0],
          markers: [{
            latitude: location[1],
            longitude: location[0],
            name: ''
          }]
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
