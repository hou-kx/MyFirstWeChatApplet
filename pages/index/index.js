// index.js
// 获取应用实例
const app = getApp()
const TIMEGAP = "5"
const COUNTS = "3"
const IMAGEURL = "/pages/img/logo.png"
// const ACCESSURL = ['https://www.imssq.com/sq/#/SQFY?regionCode=411426000000&qrCodeId=7352&jznlUnitType=6']
const TOPAGE = "/pages/toPage/toPage?"
// 获取全局唯一的文件管理器
const fs = wx.getFileSystemManager()

Page({
  data: {
    timesGap: TIMEGAP,
    counts: COUNTS,
    targetUrl: ''
  },
  onLoad(options) {
    var that = this
    if (options.status != "1") {

      return
    }
    try {
      // 计数
      var curCounts = parseInt(options.counts)
      var gap = parseInt(this.data.timesGap)

      var qrCodeUrl = wx.getStorageSync('qrCodeUrl')
      console.log('index-qrCodeUrl', qrCodeUrl)
      // if (curCounts > 0 && ACCESSURL.indexOf(qrCodeUrl) != -1) {
      if (curCounts > 0) {
        this.setData({
          counts: curCounts.toString(),
        })
        // 跳转頁面
        setTimeout(() => {
          console.log(curCounts, +" " + gap);
          wx.redirectTo({
            url: TOPAGE + "gap=" + gap + "&counts=" + curCounts
          })
        }, gap * 1000)
      }else if (curCounts == 0) {
        wx.showModal({
          showCancel: false,
          title: 'Success',
          content: "当前任务已完成，共计 " + wx.getStorageSync('counts') + " 轮 ^_^!",
          success(res) {
            that.reset()
          }
        })
      }
    } catch (e) {
      console.log(e)
      return
    }
  },
  timesGapChanged: function (e) {
    this.setData({
      timesGap: e.detail.value,
    })
  },
  countsChanged: function (e) {
    this.setData({
      counts: e.detail.value,
    })
  },
  reset: function () {
    try {
      // 内存持久化存储
      wx.setStorageSync('qrCodeUrl', '')
      this.setData({
        timesGap: TIMEGAP,
        counts: COUNTS,
        targetUrl: '',
      })
    } catch (e) {
      console.log(e)
      return
    }
  },
  qrCodeToUrl: function () {
    var curCounts = this.data.counts
    var gap = this.data.timesGap
    // 判断间隔、次数是否合法
    if (!gap.match("^([1-9]|[1-5][0-9]|60|all)$") || !curCounts.match("^(?!00)(?:[0-9]{1,4}|10000)$")) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: "间隔时间：" + gap + " 应在 1~60 ，次数: " + curCounts + " 应在 1~10000 范围 ^_^!",
        success(res) {
          // reset()
        }
      })
      this.reset();
      return;
    }
    // 扫码
    wx.scanCode({
      // onlyFromCamera: true,
      desc: 'scanQRCode desc',
      success(res) {
        console.log("index-scan", res)
        var qrCodeUrl = res.result
        // if (ACCESSURL.indexOf(qrCodeUrl) == -1) {
        //   // 该二维码不合法
        //   wx.showModal({
        //     showCancel: false,
        //     title: '二维码暂不可用',
        //     content: "当前二维码暂不可用，请联系小程序管理员 ^_^!",
        //     success(res) {
        //       console.log(qrCodeUrl)
        //     }
        //   })
        //   return;
        // }
        try {
          // 内存持久化存储
          wx.setStorageSync('qrCodeUrl', qrCodeUrl)
          wx.setStorageSync('counts', curCounts)
        } catch (e) {
          console.log(e)
          return
        }
        //注意，此处如果不用缓存带链接去界面，可能会发生链接无法带参的情况。跳转页面
        wx.navigateTo({
          url: TOPAGE + "gap=" + gap + "&counts=" + curCounts
        })
      },
      complete(qrCodeUrl) {
        console.log("complete", qrCodeUrl)
      }
    })
  },
  resetWrite: function(){
    // // 将json转换成字符串
    const data = JSON.stringify(this.data)
    console.log(data)
    // const fs = wx.getFileSystemManager()
    // const ab = new ArrayBuffer(1024)
    const fd = fs.openSync({
      filePath: `${wx.env.USER_DATA_PATH}/dataurl.json`,
      flag: 'w+'
    })
    const res = fs.writeSync({
      fd: fd,
      data: data,
      encoding: "utf8"
    })
    console.log(res.bytesWritten)
  },
  goRead: function(){
    // const fs = wx.getFileSystemManager()
  // 同步接口
    try {
      const res = fs.readFileSync(`${wx.env.USER_DATA_PATH}/dataurl.json`, 'utf8', 0)
      console.log(res)
      var urls = JSON.parse(res)
      console.log(urls.timesGap)
      console.log(urls.counts)
    } catch(e) {

      console.error(e)
    }
  }
});