//index.js
//获取应用实例
const _ = require('../../utils/underscore.js')._
const app = getApp()

Page({
  data: {
    deck: [{ suit: 0, number: 2, copyNumber: 2 }, { suit: 0, number: 3, copyNumber: 3 }],
    result: [],
    totalNumber : 0,
    flipNumber: 5,
  },
  onLoad: function (){
    var cards = [];
    for ( var i = 0; i < 4; i++ ) {
      for ( var j = 2; j <= 14; j++ ) {
        cards.push({ suit: i, number: j, copyNumber: 1})
      }
    }
    this.setData({ deck: cards });
    this.setData({ totalNumber: this.calculateTotal() });
  },
  calculateTotal: function() {
    var total = 0;
    for (var i = 0; i < this.data.deck.length; i++ ) {
      total += this.data.deck[i].copyNumber;
    }
    return total;
  },
  startCalculate:function(){
    var realDeck = [];
    for (var i = 0; i < this.data.deck.length; i++) {
      var card = this.data.deck[i];
      for ( var j = 0; j < card.copyNumber; j++)
        realDeck.push({ suit: card.suit, number: card.number })
    }
    //real calculate
    
  }
})
