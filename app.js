//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    var properties = wx.getStorageSync('properties') || []
    var combos = wx.getStorageSync('combos') || []
    this.globalData = {
      properties,
      combos
    }
    
  },
  globalData: {
    properties: [],
    combos: []
  }
})