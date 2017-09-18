 //app.js
App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    // ip: 'http://127.0.0.1:8088/club_2',
    ip: 'https://xiaochengxu.sodo-tech.com/club_2',
    ipimg: 'https://xiaochengxu.sodo-tech.com',
    appid: 'wxb2178abdca45ba17',
    secret: '4ee7f4781199b79b327afd6021cc0836',
    title: '俱乐部2'
  },
  transDate:function (mescStr){
    var n= mescStr; 
    var date = new Date(n);   
    // var Y = date.getFullYear() + '/';  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';  
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();  
    return(M + D)
  },
  transDate1: function (mescStr) {
    var n = mescStr;
    var date = new Date(n);
    // var Y = date.getFullYear() + '/';  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return (M +'月'+ D +'日')
  },
  transDate2: function (mescStr) {
    var n = mescStr;
    var date = new Date(n);
    // var Y = date.getFullYear() + '/';  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return (M + D)
  },
  transDate3: function (mescStr) {
    var n = mescStr;
    var date = new Date(n);
    var Y = date.getFullYear() + '.';  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return (Y + M + D)
  },
   isCardID: function(sId){
    var aCity = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" };
    var iSum= 0 ;
    var info= "" ;
    if(!/^\d{17}(\d|x)$/i.test(sId)) return "你输入的身份证长度或格式错误";
    sId = sId.replace(/x$/i, "a");
    if (aCity[parseInt(sId.substr(0, 2))] == null) return "你的身份证地区非法";
    var sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
    var d = new Date(sBirthday.replace(/-/g, "/"));
    if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) return "身份证上的出生日期非法";
    for (var i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
    if (iSum % 11 != 1) return "你输入的身份证号非法";
    //aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女");//此次还可以判断出输入的身份证号的人性别
    return true;
	},
  delArr: function(arr,val){
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id == val) {
        continue;
      }
      newArr.push(arr[i])
    }
    return newArr;
  }
})
// 后台管理
// http://127.0.0.1:8088/admin/activity_city_list
// 活动列表
// http://2.www.wj.com:8088/wx/wx_index
// 活动管理
// http://127.0.0.1:8088/club/activity_info_list