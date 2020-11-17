// pages/combo.js
const _ = require('../../utils/underscore.js')._

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPropertyDialog: false,
    showComboDialog: false,
    showCardDialog: false,
    deck: [],
    result: [],
    flipNumber: 5,
    combos: [],
    attribute: [],
    flipNumber: 5,
    totalNumber: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var deck = wx.getStorageSync('comboDeck');
    if ( !deck ) {
      
    } else {
      this.setData({deck:deck});
      this.calculateTotal();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onShowPropertyDialog(){
    this.setData({showPropertyDialog:true})
  },

  addCard(){
    this.setData({showCardDialog:true})
  },
  calculateTotal(){
    var total = 0;
    for (var i = 0; i < this.data.deck.length; i++ ) {
      total += this.data.deck[i].copyNumber;
    }
    this.setData({ totalNumber: total})
  },
  selectFilpNumber:function(){
    wx.showActionSheet({
      itemList: ["翻2张","翻3张","翻4张","翻5张","翻6张","翻7张"],
      success:(res)=>{
        this.setData({flipNumber: res.tapIndex+2})
      }
    })
  },
  startCalculate:function(){
    wx.setStorageSync('comboDeck', this.data.deck)
    
  },
  onClosePropertyDialog() {
    console.log(getApp().globalData.properties)
    wx.setStorageSync('properties', getApp().globalData.properties)
  }
})