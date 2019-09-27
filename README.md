# BlutoothConnectHc-08
我的毕业设计,通过硬件检测心率,脉搏,蓝牙连接微信小程序生成健康报告

### 开发消息提示框
**使用wx自带组件,设置标题以及内容,监听确认按钮,确认后进行页面跳转.**
```
        wx.showModal({
          title: '提示',
          content: '请确认是否开启了蓝牙和定位',
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
```
```
        /**
         *  //显示消息提示框2
         *  wx.showToast({
         *  title: '搜索失败，请确认已经打开蓝牙',
         *  icon: "loading",
         *  duration: 3000
         *  })
         */
```
在successfunction中无法使用wx.redirectTo()与wx.navicateTo()函数,原因待确定...
### 检测蓝牙与地理位置是否开启 并使用弹窗进行提示
```
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
          allowDuplicatesKey : false,
          success: function (res) {
            console.log("开启蓝牙搜寻周边设备");
            console.log(res);
            //监听寻找到新设备的事件
            wx.onBluetoothDeviceFound(function (res) {
              console.log('发现新的蓝牙设备');
              console.log(res);
              //本机记录设备信息
              dev.push(res.devices[0]);
              that.setData({
                list: dev
              });
              console.log('当前设备列表:');
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
          content: '请确认是否开启了蓝牙和定位',
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

```
**注意此模块之前的开发必须开启蓝牙的适配器模块**
### 判断蓝牙状态的可用性 在当前窗口弹出提示信息 持续三秒 自动消失
```
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
```
**此模块写的比较匆忙,代码冗余问题待解决**
### css解决单行溢出问题
```
.item2{
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
}
```
**有的serviceId信息很长,如果不进行溢出处理,信息会产生重叠.如果进行省略号省略,无法对信息进行完整性展示,所以进行多行溢出解决**
### 
