/** connble.js */

Page({
  data: {
    deviceId: '',
    name: '',
    RSSI: '',
    advData: '',
    serviceId: '',
    serviceList: [],
    serviceUUID: '',
    select: '',
    characteristics: [],
  },

  onLoad: function (opt) {
    var that = this;
    console.log("onLoad");
    console.log('deviceId=' + opt.deviceId);
    console.log('name=' + opt.name);
    console.log('RSSI=' + opt.RSSI);
    console.log('advData=' + opt.advData);
    //从scanble导航来的数据
    that.setData({
      RSSI: opt.RSSI,
      name: opt.name,
      deviceId: opt.deviceId,
      advData: opt.advData,
    });
  },

  bindConnect: function () {
    var that = this;
    //连接低功耗蓝牙设备 deviceId timeout success fail complete
    wx.createBLEConnection({
      deviceId: that.data.deviceId,
      //create conn. success
      success: function (res) {
        console.log(res);
        //获取蓝牙设备所有服务
        wx.getBLEDeviceServices({
          deviceId: that.data.deviceId,
          success: function (res) {
            console.log('device services:', res.services);
            that.setData({
              serviceList: res.services,
            })
            console.log('serviceList:', that.data.serviceList);
          },
        });
      },
      //连接失败
      fail: function (res) {
        wx.showToast({
          title: '建立连接失败',
          icon: 'loading',
          duration: 2000
        })
      },
    })

  },

  //res.services结构的uuid 蓝牙设备服务的uuid
  selectUUID: function (e) {
    var that = this;
    var uuid = e.currentTarget.dataset.uuid;
    console.log(uuid);
    //show selected service uuid
    that.setData({
      serviceUUID: uuid,
      select: 1,
    })

  },

  getCharc: function () {
    var that = this;
    if (that.data.select == '') {
      wx.showToast({
        title: '请先选择service uuid',
        icon: 'loading',
        duration: 2000
      })
    }
    //获取蓝牙设备某个服务中所有特征值 deviceId:蓝牙设备id,serviceId:蓝牙服务uuid
    wx.getBLEDeviceCharacteristics({
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceUUID,
      success: function (res) {
        console.log('getBLEDeviceCharacteristics:', res.characteristics)
        that.setData({
          characteristics: res.characteristics,
        })
        wx.notifyBLECharacteristicValueChange({
          deviceId: that.data.deviceId,
          serviceId: that.data.serviceId,
          characteristicId: that.data.characteristics.uuid,
          state: true,
          success: function(res) {
            console.log('启用notify成功')
          },
        })
      },
    })
    wx.onBLEConnectionStateChange(function (res) {
      console.log(res.connected)
      that.setData({
        connected: res.connected
      })
    })
    wx.onBLECharacteristicValueChange(function (res) {
      var receiveText = app.buf2string(res.value)
      console.log('接收到数据：' + receiveText)
      that.setData({
        receiveText: receiveText
      })
    })
  },
})