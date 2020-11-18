// pages/combo.js
const _ = require('../../utils/underscore.js')._
import {countBy} from "../../libs/lodash";
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
    deck: [], //全局的card
    result: [],
    flipNumber: 5,
    combos: [], //全局的combo
    attribute: [],
    flipNumber: 5,
    totalNumber: 0,

    properties: [], //全局的属性

    loading: false,
    progress: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var deck = wx.getStorageSync('comboDeck');
    if ( !deck ) {
      this.setData({
        deck:[{"name":"轻脚","properties":[{"name":"K"}],"copyNumber":"4"},{"name":"重脚","properties":[{"name":"K"},{"name":"K"}],"copyNumber":"4"},{"name":"轻拳","properties":[{"name":"P"}],"copyNumber":"4"},{"name":"重拳","properties":[{"name":"P"},{"name":"P"}],"copyNumber":"4"},{"name":"无关","properties":[],"copyNumber":"100"}]
      })
    } else {
      this.setData({deck:deck});
      this.calculateTotal();
    }
    this.setData({
      properties: getApp().globalData.properties
    });
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
  onCloseComboDialog(){
    this.setData({showComboDialog:false})
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
    this.combos = [];
    getApp().globalData.combos.forEach(combo=>{
      this.combos.push({
        name: combo.name,
        requirements: countBy(combo.requirements,item=>{
          return "{"+item.type+"}"+item.name
        })
      })
    })

    var realDeck = [];
    for (var i = 0; i < this.data.deck.length; i++) {
      var card = this.data.deck[i];
      for ( var j = 0; j < card.copyNumber; j++)
        realDeck.push({ name: card.name, properties: card.properties })
    }
    let types = {};
    this.setData({ loading: true, progress: "" });
    var self = this;
    var progress = 0;
    var sampleCount = 1000000;

    var clusterCalculate = function () {
      var inner_progress = 0;
      do {
        var cards = _.sample(realDeck, self.data.flipNumber);
        
        self.judgeComboType(types, cards);
        progress++
        inner_progress++
      } while (inner_progress < 10000 && progress < sampleCount)
      if (progress < sampleCount) {
        self.setData({ progress: (progress / sampleCount * 100).toFixed(2) })
        setTimeout(clusterCalculate, 1);
      } else {
        self.outputResult(sampleCount, types);
      }
    }
    
    clusterCalculate();

  },
  judgeComboType(types, cards) {
    let array = [];
    cards.forEach(card=>{
      array.push({
        type: "card",
        name: card.name
      })
      card.properties.forEach(property=>{
        array.push({
          type:"property",
          name: property.name
        })
      })     
    })
    let provide = countBy(array,item=>{
      return "{"+item.type+"}"+item.name
    })
    this.combos.forEach(combo=>{
      let pass = true;
      for(let key in combo.requirements){
        if (provide[key]===undefined || provide[key] < combo.requirements[key]){
          pass = false;
          break;
        }
      }
      if ( pass ) {
        if ( types[combo.name] ) {
          types[combo.name] ++
        } else {
          types[combo.name] =1;
        }
        
      }
    })
  },
  outputResult(total, types){
    var result = [];
    for (var key in types) {
      if (types[key] > 0) {
        result.push({ type: key, value: Math.round(types[key] / total * 100000) / 1000, count: types[key] });
      }
    }
    result = _.sortBy(result, function (item) {
      return item.count;
    })
    this.setData({ result: result, loading: false });
  },
  onClosePropertyDialog() {
    this.setData({
      properties: getApp().globalData.properties
    });
    wx.setStorageSync('properties', getApp().globalData.properties)
  }
})