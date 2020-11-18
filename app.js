//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    var properties = wx.getStorageSync('properties') || [{"name":"K"},{"name":"P"}]
    var combos = wx.getStorageSync('combos') || [{"name":"回旋踢","requirements":[{"type":"property","name":"K"},{"type":"property","name":"K"},{"type":"property","name":"K"}]},{"name":"升龙拳","requirements":[{"type":"property","name":"P"},{"type":"property","name":"P"},{"type":"property","name":"P"}]},{"name":"无敌技","requirements":[{"type":"card","name":"轻脚"},{"type":"card","name":"重脚"},{"type":"card","name":"轻拳"},{"type":"card","name":"重拳"}]}];
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