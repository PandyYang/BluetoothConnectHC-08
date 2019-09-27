/** connble.js */

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function(bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join(',');
}

Page({
  data: {
    status: "",
    sousuo: "",
    connectedDeviceId: "", //已连接设备uuid
    services: [], //连接设备的服务
    readServiceweId: "", //可读服务uuid
    readCharacteristicsId: "", //可读特征值uuid
    deviceId: '',
    name: '',
    RSSI: '',
    advData: '',
    serviceId: '',
    serviceList: [],
    serviceUUID: '',
    select: '',
    characteristics: [], //连接设备的状态值
  },

  onLoad: function(opt) {
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

  bindConnect: function() {
    var that = this;
    //连接已发现的低功耗蓝牙设备 当前信息值已经由search页面传递而来
    wx.createBLEConnection({
      deviceId: that.data.deviceId,
      //create conn. success
      success: function(res) {
        console.log('连接成功:')
        console.log(res);
        that.setData({
          connectedDeviceId: e.currentTarge.id,
          info: "MAC地址:" + that.data.deviceId + "调试信息:" + res.errMsg,
        })
        //获取蓝牙设备所有服务 services的结构:uuid:蓝牙设备服务的uuid; isPrimary:该服务是否为主服务
        //获取在小程序蓝牙模块生效期间所有已发现的蓝牙设备，包括已经和本机处于连接状态的设备
        wx.getBLEDeviceServices({
          deviceId: that.data.deviceId,
          success: function(res) {
            that.data.services = res.services
            console.log('获取蓝牙设备所有服务成功:', that.data.services);

            //for(var i = 0;i< res.services.length;i++){
            //  console.log("第" + (i + 1) + "个UUID:" + res.services[i].uuid + "\n")
            //}
            that.setData({
              serviceId: that.data.services[0].uuid,
              info: JSON.stringify(res.services),
            })
            console.log('服务uuid:', that.data.serviceId);

            //获取设备的特征值
            wx.getBLEDeviceCharacteristics({
              // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
              deviceId: that.data.connectedDeviceId,
              // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取  
              serviceId: that.data.serviceId, //-----注意是that.data.services[0].uuid
              success: function(res) {
                console.log('serviceId: that.data.services[0].uuid: ', that.data.serviceId)
                console.log(res)
                for (var i = 0; i < res.characteristics.length; i++) {
                  if (res.characteristics[i].properties.notify) { //注意characteristic(特征值)信息,properties对象
                    that.setData({
                      notifyServiceId: that.data.services[0].uuid,
                      notifyCharacteristicsId: res.characteristics[i].uuid,
                    })
                    console.log("notifyServiceId:", that.data.notifyServiceId, "notifyCharacteristicsId", that.data.notifyCharacteristicsId)
                  }
                  if (res.characteristics[i].properties.write) {
                    that.setData({
                      writeServicweId: that.data.services[0].uuid,
                      writeCharacteristicsId: res.characteristics[i].uuid,
                    })
                    console.log("writeServicweId:", that.data.writeServicweId, "writeCharacteristicsId", that.data.writeCharacteristicsId)
                  } else if (res.characteristics[i].properties.read) {
                    that.setData({
                      readServicweId: that.data.services[0].uuid,
                      readCharacteristicsId: res.characteristics[i].uuid,
                    })
                    console.log("readServicweId:", that.data.readServicweId, "readCharacteristicsId", that.data.readCharacteristicsId)
                  }
                }
              },
              fail: function() {
                console.log("获取连接设备的所有特征值：", res);
              },
              complete: function() {
                console.log("complete!");
              }
            })

          },
          fail: function() {
            //...
          },
          complete: function() {
            //...
          }
        })
      },
      //res.services结构的uuid 蓝牙设备服务的uuid
      selectUUID: function(e) {
        var that = this;
        var uuid = e.currentTarget.dataset.uuid;
        console.log(uuid);
        //show selected service uuid
        that.setData({
          serviceUUID: uuid,
          select: 1,
        })
      },

      //此函数用于进行校验 在没有选择serviceId之前 无法进行特殊值的获取
      getCharc: function() {
        var that = this;
        if (that.data.select == '') {
          wx.showToast({
            title: '请先选择service uuid',
            icon: 'loading',
            duration: 2000
          })
        }
        //低功耗蓝牙设备特征值变化时的notify功能
        wx.notifyBLECharacteristicValueChange({
          deviceId: that.data.connectedDeviceId,
          serviceId: that.data.notifyServiceId,
          characteristicId: that.data.notifyCharacteristicsId,
          state: true,
          success: function(res) {
            console.log('notifyBLECharacteristicValueChange success', res.errMsg)
          },
          fail: function() {
            console.log('启用notify功能失败！');
            console.log(that.data.notifyServicweId);
            console.log(that.data.notifyCharacteristicsId);
          },
        })
        //接收消息
        wx.onBLECharacteristicValueChange(function(characteristic) {
          let hex = Array.prototype.map.call(new Uint8Array(characteristic.value), x => ('00' + x.toString(16)).slice(-2)).join('');
          console.log(hex)
        })
        console.log(that.data.readServicweId);
        console.log(that.data.readCharacteristicsId);
        wx.readBLECharacteristicValue({
          deviceId: that.data.connectedDeviceId,
          serviceId: that.data.readServicweId,
          characteristicId: that.data.readCharacteristicsId,
          success: function(res) {
            console.log('readBLECharacteristicValue:', res.errMsg);
          }
        })
      },
    })

  }

})