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
    biggest:0,
    smallest:0
  },
  onLoad: function (){
    var cards = [];
    for ( var i = 0; i < 4; i++ ) {
      for ( var j = 2; j <= 14; j++ ) {
        cards.push({ suit: i, number: j, copyNumber: 1})
      }
    }
    this.setData({ deck: cards });
    this.calculateTotal();
  },
  calculateTotal: function() {
    var total = 0;
    var biggest = 0;
    var smallest = 100;
    for (var i = 0; i < this.data.deck.length; i++ ) {
      total += this.data.deck[i].copyNumber;
      var number = this.data.deck[i].number
      if (number > biggest ) {
        biggest = number;
      }
      if (number < smallest) {
        smallest = number;
      }
    }
    this.setData({ biggest: biggest, smallest: smallest, totalNumber: total})
  },
  startCalculate:function(){
    var realDeck = [];
    for (var i = 0; i < this.data.deck.length; i++) {
      var card = this.data.deck[i];
      for ( var j = 0; j < card.copyNumber; j++)
        realDeck.push({ suit: card.suit, number: card.number })
    }
    
    //real calculate
    var sampleCount = 10000;
    var types = {
      "5条":0,
      "5同花顺":0,
      "4条":0,
      "5同花":0,
      "5顺子":0,
      "3带2":0,
      "3条":0,
      "4顺子":0,
      "4同花":0,
      "2对":0
    };
    this.straight5List = [];
    for ( var i = this.data.smallest; i <= this.data.biggest - 4; i++ ) {
      this.straight5List.push([i + 4, i + 3, i + 2, i + 1, i].join("-"))
    }
    this.straight4List = [];
    for (var i = this.data.smallest; i <= this.data.biggest - 3; i++) {
      this.straight5List.push([i + 3, i + 2, i + 1, i].join("-"))
    }
    this.straight3List = [];
    for (var i = this.data.smallest; i <= this.data.biggest - 2; i++) {
      this.straight5List.push([i + 2, i + 1, i].join("-"))
    }
    for ( var i = 0; i < sampleCount; i++ ){
      var cards = _.sample(realDeck, this.data.flipNumber);
      this.judgeCardType(types, cards);
    }
    
    var total = 0;
    for ( var key in types ) {
      total += types[key];
    }
    this.data.result = [];
    for (var key in types) {
      if ( types[key] > 0) {
        this.data.result.push[{type: key, value: Math.round(types[key]/total*100)}];
      }
    }
    this.setData({result: this.data.result})
  },
  judgeCardType:function(types, cards) {
    cards = _.sortBy(cards, function (card) {
      return card.number * 100 + card.suit;
    })
    if ( this.is5ofAKind(cards) ) {
      types["5条"]++;
    } else if (this.is4ofAKind(cards)) {
      types["4条"]++;
    } else if (this.isFullHouse(cards)) {
      types["3带2"]++;
    } else if (this.is2Pair(cards)) {
      types["3带2"]++;
    }
  },
  is5ofAKind: function (cards) {
    if (cards.length >= 5 && cards[0].number === cards[1].number && cards[0].number === cards[2].number && cards[0].number === cards[3].number && cards[0].number === cards[4].number) {
      return true;
    }
    return false;
  },
  isFlushStraight: function (cards) {
    return this.isFlush(cards) && this.isStraight(cards);
  },
  is4ofAKind: function (cards) {
    if (cards.length >= 4 && cards[0].number === cards[1].number && cards[0].number === cards[2].number && cards[0].number === cards[3].number) {
      return true;
    } else if (cards.length >= 5 && cards[1].number === cards[2].number && cards[1].number === cards[3].number && cards[1].number === cards[4].number) {
      return true;
    }
    return false
  },
  isFullHouse: function (cards) {
    if (cards.length < 5 ) return false;
    if (cards[0].number === cards[1].number &&
      cards[0].number === cards[2].number &&
      cards[3].number === cards[4].number) {
      return true;
    } else if (cards[0].number === cards[1].number &&
      cards[2].number === cards[3].number &&
      cards[3].number === cards[4].number) {
      return true;
    }
    return false;
  },
  isStraight: function (cards) {
    var v = _.map(cards, function (card) {
      return card.number;
    }, this).join("-");
    return this.STRAIGHT5_LIST[v];
  },
  is3ofAKind: function (cards) {
    if (cards[0].number === cards[1].number && cards[0].number === cards[2].number) {
      return cards[0];
    } else if (cards[1].number === cards[2].number && cards[1].number === cards[3].number) {
      return cards[1];
    } else if (cards[2].number === cards[3].number && cards[2].number === cards[4].number) {
      return cards[2];
    }
    return false
  },
  isFlush: function (cards) {
    var v = cards[0].get("suit");
    if (v === SUIT_NUMBER_BLANK) return false;
    for (var i = 1; i < cards.length; i++) {
      if (v != cards[i].get("suit") || cards[i].get("suit") === SUIT_NUMBER_BLANK)
        return false;
    }
    return true;
  },
  is2Pair: function (cards) {
    if (cards.length >= 4 && cards[0].number === cards[1].number && cards[2].number === cards[3].number) {
      return true;
    } else if (cards[0].number === cards[1].number && cards[3].number === cards[4].number) {
      return true;
    } else if (cards[1].number === cards[2].number && cards[3].number === cards[4].number) {
      return true;
    }
    return false;
  },
  isPair: function (cards) {
    if (cards[0].number === cards[1].number) {
      return cards[0];
    } else if (cards[1].number === cards[2].number) {
      return cards[1];
    } else if (cards[2].number === cards[3].number) {
      return cards[2];
    } else if (cards[3].number === cards[4].number) {
      return cards[3];
    }
    return false;
  }
})
