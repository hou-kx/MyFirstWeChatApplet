// pages/toPage/toPage.js
const INDEXPAGE = "/pages/index/index?status=1"

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var timesGap = parseInt(options.gap)
    var curCounts = parseInt(options.counts)
    var that = this
    try {
      var result = wx.getStorageSync('qrCodeUrl')
      console.log('toPage-result', result)
      this.setData({
        url: result
      })
      // 跳转頁面
      setTimeout(() => {
        console.log(timesGap * 1000);
        wx.redirectTo({
          url: INDEXPAGE + "&counts=" + (curCounts - 1)
        })
      }, timesGap * 1000)
    } catch (e) {
      // Do something when catch error
      console.log(e)
      return
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})