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
    currentCard: null,
    currentCardIndex: 0,
    mode: null,
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
  onShowComboDialog(){
    this.setData({showComboDialog:true})
  },
  onAddCard(){
    this.setData({showCardDialog:true, currentCard: {
      name:"",
      properties:[],
      copyNumber:1
    }, mode:"create" })
    
  },
  onCurrentCardChange(event){
    let card = event.detail;
    this.setData({
      currentCard: {
        name: card.name,
        properties: card.properties,
        copyNumber: card.copyNumber
      }
    })
  },
  onConfirmCard(){
    if ( this.data.mode ==="create") {
      this.data.deck.push({
        name: this.getNotDuplicatedName(this.data.currentCard.name),
        properties: this.data.currentCard.properties,
        copyNumber: this.data.currentCard.copyNumber,
      })
    } else {
      this.data.deck[this.data.currentCardIndex]={
        name: this.getNotDuplicatedName(this.data.currentCard.name, this.data.currentCardIndex),
        properties: this.data.currentCard.properties,
        copyNumber: this.data.currentCard.copyNumber,
      }
    }
    this.setData({
      showCardDialog: false,
      deck: this.data.deck
    })
    wx.setStorageSync('comboDeck', this.data.deck)
    this.calculateTotal();
  },
  onRemoveCard(){
    this.data.deck.splice(this.data.currentCardIndex,1);
    this.setData({
      showCardDialog: false,
      deck: this.data.deck
    })
    wx.setStorageSync('comboDeck', this.data.deck)
    this.calculateTotal();
  },
  getNotDuplicatedName(name, meIndex=-1){
    let n = name;
    let index = 1;
    while(_.some(this.data.deck, (card,index)=>{return card.name === n && meIndex!==index})){
      n = name+index;
      index++;
    }
    return n;
  },
  onEditCard(event){
    let index = event.currentTarget.dataset.index;
    let card = this.data.deck[index];
    this.setData({
      currentCardIndex: index,
      showCardDialog:true, 
      currentCard: {
        name:card.name,
        properties:_.clone(card.properties),
        copyNumber:card.copyNumber}, 
      mode:"edit" })
  },
  calculateTotal(){
    var total = 0;
    for (var i = 0; i < this.data.deck.length; i++ ) {
      total += Number(this.data.deck[i].copyNumber);
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
    
    
  },
  onClosePropertyDialog() {
    console.log(getApp().globalData.properties)
    wx.setStorageSync('properties', getApp().globalData.properties)
  }
})