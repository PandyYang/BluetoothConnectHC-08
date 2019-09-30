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

###  css解决多行溢出问题
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

### 蓝牙协议值服务与特征值分析

https://www.cnblogs.com/asam/p/8676369.html

### 安卓 是通过 deviceId 与mac 地址配对 然后ios是通过advertisData 通过建立 

```
//启动notify 蓝牙监听功能 然后使用 wx.onBLECharacteristicValueChange
//用来监听蓝牙设备传递数据
wx:notifyBLECharacteristicValueChange({
	deviceId: that.data.deviceId,
	serviceId: that.data.serviceId,
	characteristicId: that.data.characteristicId,
	state: true,
	success: function (res) { },
	fail: function (res) { },
	complete: function (res) {
//用来监听手机蓝牙设备的数据变化
wx: wx.onBLECharacteristicValueChange(function (res) {
	console.log('characteristic value comed:', res.value)
    /**
    * {value: ArrayBuffer, deviceId: "D8:00:D2:4F:24:17", serviceId: 
    * "ba11f08c-5f14-0b0d-1080-007cbe238851-0x600000460240",
    * characteristicId: "0000cd04-0000-1000-8000-00805f9b34fb-0x60800069fb80"}
    */
	console.log(ab2hex(res.value))
		})
	},
})
```

### 判断蓝牙状态可用性

```
wx.showToast({
	title: '当前蓝牙可用!',
	icon:'loading',
	duration:1000
})

wx.showToast({
	title: '当前蓝牙不可用,请确认是否开启!',
	icon: 'loading',
	duration: 1000
})
```

**检测蓝牙设备可用性,注意在必须先开启蓝牙适配器,否则后面任何模块无法开启,在蓝牙适配器模块开启之后,检测蓝牙的开启状态,值为真只可能在适配器开启以及蓝牙开启状态,其他三种状态均无法满足条件.**

### 检测定位服务是否开启

```
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

### this.setData介绍

总结一下就是：this.data与this.setData的关系就是this.setData里面存储的是this.data的副本，而界面是从this.setData里面托管的this.data的副本取数据的。所以我们更改this.data并不会直接更新界面，因为这个时候的this.setData里面的副本还是没有更新前的。

### 艺术字体生成网站

http://www.akuziti.com/

### 低功耗蓝牙无name 与去重问题

微信小程序只能搜索到低功耗蓝牙,无法搜索到安卓蓝牙信号

1.剔除参数allowDuplicatesKey,该参数设置是否允许重复上报同一设备

2.在wx:if中进行条件判断:

```
<view class="item2">

	<text wx:if="{{item.name && item.deviceId}}">

		新设备: {{item.deviceId}} - {{item.name}} - {{item.localName}}
	</text> 

</view>

```

### ArrayBuffer转字符串

```
// ArrayBuffer转16进度字符串示例 待用
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

```

### 携带数据进行页面跳转

```
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
```

注意跳转需要数据,通过data-参数绑定,例如data-a-b自动转换为aB

```
<view class="title">设备列表</view>

<view hover-class="hover_bgc" 
wx:for="{{list}}" 
wx:key="{{item.deviceId}}" 
bindtap="connectDevice" 
data-deviceid="{{item.deviceId}}" 
data-name="{{item.name}}" 
data-localName="{{item.localName}}"
data-rssi="{{item.RSSI}}"
data-advdata="{{item.advertisData}}">
  <view class="line"></view>

  <view class="item2">
    <text>
      新设备: {{item.deviceId}} - {{item.name}} - {{item.localName}}
    </text>  
  </view>
</view>
  
<view class="line"></view>
```

### 解决日期显示问题

用到了一个很简单的字符串拼接 希望将'/'修改成中文,必须分次进行,否则会报错,原因未知.

util.js

```
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  
  return [year, month, day].map(formatNumber).join('/') + '/'+ ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}

```

```
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
```

### 导航数据的加载读取

```

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
```

### 页面自动跳转函数

```
//setTimeout函数
setTimeout(function () {
	wx.redirectTo({
		url: '../welcome/welcome',
	})
})
```

### 检测授权状态,进行跳转或者重新授权

```
bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      that.setData({
        isHide: false
      });
      setTimeout(function () {
        wx.redirectTo({
          url: '../welcome/welcome',
        })
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  }
```

### 页面进行绝对位置布局

优点可以布置在任何位置,缺点在不同像素,屏幕大小的设备上,可能会造成布局异常

```
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
.xinlv{
  position: absolute;
  height: 50px;
  width: 50px;
  top: 200px;
  left: 100px;
}

.ceshi1{
  position: absolute;
  top: 200px;
  left: 170px;
}
.maibo{
  position: absolute;
  height: 50px;
  width: 50px;
  top: 270px;
  left: 100px;
}
.ceshi2{
  position: absolute;
  top: 270px;
  left: 170px;
}
.input1 {
  position: absolute;
  margin-top:3px;
  width: 120px;
  border: 1px solid lightgray;
  border-radius: 6px;
  top: 220px;
  left: 170px;
}

.input2 {
  position: absolute;
  margin-top:3px;
  width: 120px;
  border: 1px solid lightgray;
  border-radius: 6px;
  top: 290px;
  left: 170px;

}
.text1{
  position: absolute;
  color: rgba(7, 7, 7, 0.575);
  font-size: 150%;
  margin-top: 30px;
}


/* CSS Document */
.anniu{
    display:block;
    width:120px;
    height:40px;
    background-color:rgb(42, 228, 197);
    color:#FFFFFF;
    text-align:center;
    font-size:18px;
    line-height:40px;
    border-radius: 25px;
    border:none;
    box-shadow:none;
    text-decoration: none;
    transition: box-shadow 0.5s;
    -webkit-transition: box-shadow 0.5s;
}
.anniu:hover{
    box-shadow:0px 0px 5px 1px #808080;
}
.anniu:active{
    box-shadow:0px 0px 5px 1px #FF0000;
}
.button{
  position: absolute;
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  top: 350px;
  left: 100px;
}
```

