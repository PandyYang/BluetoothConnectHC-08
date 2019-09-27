/** index.js */

var app = getApp()
Page({

  onLoad: function () {
    console.log('onLoad')

  },
  //扫描蓝牙列表
  scanList: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  //检测蓝牙状态
  bluetoothState:function() {
    //需要先开启蓝牙适配器
    var that = this;
    wx.openBluetoothAdapter({
      success: function(res) {
        //获取蓝牙设备状态
        wx.getBluetoothAdapterState({
          success: function (res) {
            console.log(JSON.stringify(res.errMsg) + "\n蓝牙是否可用" + res.available);
            wx.showToast({
              title: '当前蓝牙可用',
              icon:'loading',
              duration:3000
            })
            that.setData({
              info: JSON.stringify(res.errMsg) + "\n蓝牙是否可用" + res.available
              
            })
          },
          fail: function (res) {
            console.log(JSON.stringify(res.errMsg) + "\n蓝牙是否可用：" + res.available);
            wx.showToast({
              title: '当前蓝牙不可用',
              icon: 'loading',
              duration: 3000
            })
            that.setData({
              info: JSON.stringify(res.errMsg) + "\n蓝牙是否可用：" + res.available
            })
          }
        })
      },
      fail: function(){
        //获取蓝牙设备状态
        wx.getBluetoothAdapterState({
          success: function (res) {
            console.log(JSON.stringify(res.errMsg) + "\n蓝牙是否可用" + res.available);
            wx.showToast({
              title: '当前蓝牙不可用',
              icon: 'loading',
              duration: 3000
            })
            that.setData({
              info: JSON.stringify(res.errMsg) + "\n蓝牙是否可用" + res.available
            })
          },
          fail: function (res) {
            console.log(JSON.stringify(res.errMsg) + "\n蓝牙是否可用：" + res.available);
            wx.showToast({
              title: '当前蓝牙不可用',
              icon: 'loading',
              duration: 3000
            })
            that.setData({
              info: JSON.stringify(res.errMsg) + "\n蓝牙是否可用：" + res.available
            })
          }
        })
      }
    })
  }

})
