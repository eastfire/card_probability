//index.js
//获取应用实例
const _ = require('../../utils/underscore.js')._
const app = getApp()

Page({
  
  onLoad: function (){
   
  },
  toDice:function(){
    wx.navigateTo({
      url: '../dice/index'
    })
  },
  toCard: function () {
    wx.navigateTo({
      url: '../card/index'
    })
  },
  toCombo: function () {
    wx.navigateTo({
      url: '../combo/combo'
    })
  }
  
})
