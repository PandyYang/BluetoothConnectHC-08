//index.js
var util = require('../../utils/util.js');
Page({
  data: {},
  onLoad: function(options) {
    var that = this;
    //var detailsText = that.data.text;
    var time = util.formatTime(new Date())
    var ss = time.toString();
    var ytime = ss.replace("/", "年");
    var mtime = ytime.replace("/", "月");
    var dtime = mtime.replace("/", "日");
    var fulltime = dtime;
    //为页面中time赋值
    this.setData({
      time: fulltime,
      text: options.receiveText
    })
    //打印
    console.log(time)

  }
})