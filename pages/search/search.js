/** scanble.js */

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

Page({
  //页面初始化数据
  data: {
    list: [],//存放设备
  },
  //监听页面的显示
  onShow: function () {
    console.log('onShow');
    var that = this;
    var dev = that.data.list; //设备列表
    
    /**
     * 初始化蓝牙模块
     * 参数列表:
     *    success  function  非必填 接口调用成功的回调函数
     *    fail     function  非必填 接口调用失败的回调函数
     *    complete function  非必填 接口调用结束的回调函数(调用成功或失败都会返回)
     */
    wx.openBluetoothAdapter({
      //打开蓝牙模块成功
      success: function (res) {
        console.log("openBluetoothAdapter: success");
        console.log(res);
        //开始搜寻附近的蓝牙外围设备
        wx.startBluetoothDevicesDiscovery({
          /**
           * 要搜索的蓝牙设备主 service 的 uuid 列表。某些蓝牙设备会广播自己的主 service 的 uuid。
           * 如果设置此参数，则只搜索广播包有对应 uuid 的主服务的蓝牙设备。建议主要通过该参数过滤掉
           * 周边不需要处理的其他蓝牙设备。
           * 此外参数allowDuplicatesKey还可以设置是否允许重复上报同一设备;
           * interval:上报设备的间隔,0表示立即上报.
           */
          services: [],
          success: function (res) {
            console.log("startBluetoothDevicesDiscovery: success");
            console.log(res);
            //监听寻找到新设备的事件
            wx.onBluetoothDeviceFound(function (res) {
              console.log('new device list has founded');
              console.log(res);
              //found one device only, reflesh device list each time
              dev.push(res.devices[0]);
              that.setData({
                list: dev
              });
              console.log('that.setData: list');
              console.log(that.data.list);
            })
          },
        })
      },

      //打开蓝牙模块失败
      fail: function (res) {
        console.log("openBluetoothAdapter: fail");
        console.log(res);
        //弹窗进行提醒 是否开启了蓝牙
        wx.showModal({
          title: '提示',
          content: '请确认是否开启了蓝牙',
          showCancel:false,
          success: function(res){
            if(res.confirm){
              console.log("用户点击了确定")
                //返回至搜索蓝牙设备页面
                wx.redirectTo({
                  url: '../index/index',
                  success: function () {
                    //success
                  },
                  fail: function () {
                    //fail
                  },
                  complete: function () {
                    //complete
                  }
                })
            }
          }
        })

        /**
         *  //显示消息提示框2
         *  wx.showToast({
         *  title: '搜索失败，请确认已经打开蓝牙',
         *  icon: "loading",
         *  duration: 3000
         *  })
         */
       
      },
    })
  },
  //页面进行卸载 设备已搜索成功
  onUnload: function () {
    //停止搜索蓝牙设备
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        console.log("stopBluetoothDevicesDiscovery: success");
      },
    })
    //关闭蓝牙模块
    wx.closeBluetoothAdapter({
      success: function (res) {
        console.log("closeBluetoothAdapter: success");
      },
    })

  },
  //开始连接设备 e对象中有当前标签属性值 其有两个对象currentTarget和target
  connectDevice: function (e) {
    //停止搜索附近的蓝牙外围设备 准备进行设备连接
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        console.log(res)
      }
    })
    //从scanble.wxml获取设备结构
    var deviceid = e.currentTarget.dataset.deviceid;
    var name = e.currentTarget.dataset.name;
    var rssi = e.currentTarget.dataset.rssi;
    var advdata = e.currentTarget.dataset.advdata;
    console.log(deviceid);
    console.log(name);
    console.log(rssi);
    console.log(advdata);
    //导航到包含数据的新connble页 ?后面可以携带信息
    wx.navigateTo({
      url: '../connect/connect?deviceId=' + deviceid + '&name=' + name + '&RSSI=' + rssi + '&advData=' + advdata,
    })

  },

})
