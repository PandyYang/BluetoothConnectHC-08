/**connect.js */
Page({
  data: {
    receiveText: '', //接收到蓝牙传输数据
    name: '', //设备名称
    deviceId: '', //设备id
    serviceId: '', //服务id
    RSSI: '', //外部蓝牙设备信号
    advData: '', //设备数据
    serviceList: [], //服务列表
    services: {}, //服务集合
    characteristic: {}, //特征值集合
    connected: true, //连接状态
  },
  //生命周期函数 监听页面加载
  onLoad: function(opt) {
    var that = this;
    console.log('页面加载数据....')
    console.log('deviceId= ' + opt.deviceId);
    console.log('name = ' + opt.name);
    console.log('RSSI = ' + opt.RSSI);
    console.log('advData =' + opt.advData);
    //导航来的数据
    that.setData({
      RSSI: opt.RSSI,
      name: opt.name,
      deviceId: opt.deviceId,
      advData: opt.advData,
    });
  },
  //建立连接触发函数
  bindConnect: function() {
    var that = this;
    wx.createBLEConnection({
      deviceId: that.data.deviceId,
      success: function(res) {
        console.log("设备连接成功")
        console.log(res)
        //连接成功 获取设备服务
        wx.getBLEDeviceServices({
          deviceId: that.data.deviceId,
          success: function(res) {
            console.log(res.services)
            that.setData({
              services: res.services
            })
            //根据服务id 获取设备的特征值
            wx.getBLEDeviceCharacteristics({
              deviceId: that.data.deviceId,
              serviceId: res.services[0].uuid,
              success: function(res) {
                console.log(res.characteristics)
                that.setData({
                  characteristics: res.characteristics
                })
                //监控特征值的变化
                wx.notifyBLECharacteristicValueChange({
                  deviceId: that.data.deviceId,
                  serviceId: that.data.services[0].uuid,
                  characteristicId: that.data.characteristics[0].uuid,
                  state: true,
                  success: function(res) {
                    console.log('启用notify成功')
                  },
                })
              },
              fail: function() {
                //获取设备特征值失败
              }
            })
          },
          fail: function() {
            //获取设备服务失败
          }
        })
        wx.onBLEConnectionStateChange(function(res) {
            console.log(res.connected)
            that.setData({
              connected: res.connected
            })
          }),
          wx.onBLECharacteristicValueChange(function(res) {
            var receiveText = app.buf2string(res.value)
            console.log('接收到数据: ' + receiveText)
            that.setData({
              receiveText: receiveText
            })
          })
      },
      onReady: function() {

      },
      onShow: function() {

      },
      onHide: function() {

      },
      fail: function() {
        //创建连接失败
      }
    })
  }
})