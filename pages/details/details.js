//index.js
var util = require('../../utils/util.js');
Page({
  //页面初始数据
  data: {
    text:"",
    numText:0
  },
  onLoad: function(options) {
    var that = this;
    //var detailsText = that.data.text;    this.customData.deviceId = options.deviceId
    var time = util.formatTime(new Date())
    var ss = time.toString();
    var ytime = ss.replace("/", "年");
    var mtime = ytime.replace("/", "月");
    var dtime = mtime.replace("/", "日");
    var fulltime = dtime;
    console.log("Ascii码:------------------------------->:" + options.receiveText)
    console.log("心率值------------------------------->:" + options.num)
    //为页面中time赋值
    this.setData({
      time: fulltime,
      text: options.receiveText,
      numText: options.num
    })
  }
})