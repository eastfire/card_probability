//index.js
//获取应用实例
const _ = require('../../utils/underscore.js')._
const app = getApp()

Page({
  data: {
    deck: [],
    result: [],
    totalNumber : 0,
    flipNumber: 5,
    biggest:0,
    smallest:0,
    wrapAround: false,
    isShowSetupDesk: false,
    isShowSetCard: false,
    deckSmallest: 1,
    deckBiggest: 13,
    deckSuit: 4,
    deckCopy: 1,

    setCardDialogType: "",
    currentCardNumber: 0,
    currentCardSuit: 0,
    currentCardCopy: 1,

    progress: "",

    isShowSetType: false,
    judgeType:{
      "5同花顺": true,
      "5条": true,
      "4条": true,
      "3带2": true,
      "3条": true,
      "2对": true,
      "1对": true,
      "5顺子": true,
      "4顺子": true,
      "3顺子": true,
      "5同花": true,
      "4同花": true,
      "3同花": true, 
    },
    judgeTypeArray:[]
  },
  onLoad: function (){
    this.setData({
      judgeTypeArray:_.map(this.data.judgeType, function (value, key) { return key; })
    });
    var deck = wx.getStorageSync('deck');
    if ( !deck ) {
      this.setupDeck();
    } else {
      this.setData({deck:deck});
      this.calculateTotal();
    }
    
  },
  setupDeck(){
    var cards = [];
    for (var i = 0; i < this.data.deckSuit; i++) {
      for (var j = this.data.deckSmallest; j <= this.data.deckBiggest; j++) {
        cards.push({ suit: i, number: j, copyNumber: this.data.deckCopy })
      }
    }
    this.setData({ deck: cards });
    this.calculateTotal();
  },
  editCard(e){
    var index = e.currentTarget.id;
    this.currentCardIndex = index;
    this.setData({ isShowSetCard: true, setCardDialogType:"edit",
      currentCardNumber: this.data.deck[index].number,
      currentCardSuit: this.data.deck[index].suit,
      currentCardCopy: this.data.deck[index].copyNumber });
  },
  deleteCard(e){
    var deck = this.data.deck;
    deck.splice(this.currentCardIndex, 1)
    this.setData({
      deck:deck,
      isShowSetCard: false
    });
  },
  addCard(e){
    this.setData({
      isShowSetCard: true, setCardDialogType: "add",
      currentCardNumber: 1,
      currentCardSuit: 0,
      currentCardCopy: 1
    });
  },
  confirmCard(){
    var deck = this.data.deck;
    if (this.data.setCardDialogType == "edit" ) {
      deck[this.currentCardIndex].number = this.data.currentCardNumber
      deck[this.currentCardIndex].suit = this.data.currentCardSuit
      deck[this.currentCardIndex].copyNumber = this.data.currentCardCopy
    } else {
      deck.push({
        number: this.data.currentCardNumber,
        suit: this.data.currentCardSuit,
        copyNumber: this.data.currentCardCopy
      })
    }
    this.setData({
      deck: deck,
      isShowSetCard: false
    });
  },
  setCardNumber(e){
    this.setData({currentCardNumber:e.detail.value})
  },
  setCardSuit(e){
    this.setData({ currentCardSuit: e.detail.value })
  },
  setCardCopy(e){
    this.setData({ currentCardCopy: e.detail.value })
  },

  showSetType(){
    this.setData({
      isShowSetType: true
    });
  },
  changeType(e){
    var judgeType = {};
    for ( var key in this.data.judgeType ) {
      judgeType[key] = false;
    }
    for ( var i = 0; i < e.detail.value.length; i++ ) {
      judgeType[e.detail.value[i]] = true;
    }
    this.setData({judgeType: judgeType});
  },
  confirmType(){
    this.setData({
      isShowSetType: false
    });
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
  selectSmallest:function(e) {
    this.tempSmallest = parseInt(e.detail.value);
  },
  selectBiggest(e) {
    this.tempBiggest = parseInt(e.detail.value);
  },
  selectSuit(e) {
    this.tempSuit = parseInt(e.detail.value);
  },
  selectCopy(e) {
    this.tempCopy = parseInt(e.detail.value);
  },
  showSetupDeckDialog(){
    this.setData({ isShowSetupDesk: true });
    this.tempSmallest = this.data.deckSmallest;
    this.tempBiggest = this.data.deckBiggest;
    this.tempCopy = this.data.deckCopy;
    this.tempSuit = this.data.deckSuit;
  },
  confirmSetupDialog: function () {
    if ( this.tempSmallest > this.tempBiggest ) return;
    this.setData({ isShowSetupDesk: false });
    this.setData({
      deckSmallest: this.tempSmallest,
      deckBiggest: this.tempBiggest,
      deckSuit: this.tempSuit,
      deckCopy: this.tempCopy
    })
    this.setupDeck();
  },
  closeSetupDialog: function() {
    this.setData({ isShowSetupDesk : false});
  },
  startCalculate:function(){
    wx.setStorageSync('deck', this.data.deck)
    var realDeck = [];
    for (var i = 0; i < this.data.deck.length; i++) {
      var card = this.data.deck[i];
      for ( var j = 0; j < card.copyNumber; j++)
        realDeck.push({ suit: card.suit, number: card.number })
    }
    
    //real calculate
    var types = {
      "5条":0,
      "5同花顺":0,
      "4条":0,
      "3带2": 0,
      "3条": 0,
      "2对": 0,
      "1对": 0,
      "5顺子":0,
      "4顺子": 0,
      "3顺子": 0,
      "5同花": 0,
      "4同花":0,
      "3同花": 0,      
      "杂牌": 0
    };
    this.STRAIGHT5_LIST = [];
    for ( var i = this.data.smallest; i <= this.data.biggest - 4; i++ ) {
      this.STRAIGHT5_LIST.push([i, i+1, i+2, i+3, i+4].join("-"))
    }
    if ( this.data.wrapAround && this.data.biggest > this.data.smallest + 4) {
      this.STRAIGHT5_LIST.push([this.data.smallest, this.data.smallest + 1, this.data.smallest + 2, this.data.smallest+3, this.data.biggest].join("-"))
    }
    this.STRAIGHT4_LIST = [];
    for (var i = this.data.smallest; i <= this.data.biggest - 3; i++) {
      this.STRAIGHT4_LIST.push([i, i+1, i+2, i+3].join("-"))
    }
    if (this.data.wrapAround && this.data.biggest > this.data.smallest + 3) {
      this.STRAIGHT4_LIST.push([this.data.smallest, this.data.smallest + 1, this.data.smallest + 2, this.data.biggest].join("-"))
    }
    this.STRAIGHT3_LIST = [];
    for (var i = this.data.smallest; i <= this.data.biggest - 2; i++) {
      this.STRAIGHT3_LIST.push([i, i+1, i+2].join("-"))
    }
    if (this.data.wrapAround && this.data.biggest > this.data.smallest + 2) {
      this.STRAIGHT3_LIST.push([this.data.smallest, this.data.smallest + 1, this.data.biggest].join("-"))
    }
    realDeck = _.sortBy(realDeck, function (card) {
      return card.number * 100 + card.suit;
    })
    
    this.setData({ loading: true, progress: "" });
    var self = this;
    var progress = 0;
    var sampleCount = 1000000;

    var clusterCalculate = function () {
      var inner_progress = 0;
      do {
        var cards = _.sample(realDeck, self.data.flipNumber);
        cards = _.sortBy(cards, function (card) {
          return card.number * 100 + card.suit;
        })
        self.judgeCardType(types, cards);
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
  judgeCardType:function(types, cards) {
    var found = false;
    if ( this.data.judgeType["5条"] && this.is5ofAKind(cards) ) {
      types["5条"]++;
      found = true;
    } else if (this.data.judgeType["4条"] && this.is4ofAKind(cards)) {
      types["4条"]++;
      found = true;
    } else if (this.data.judgeType["3带2"] && this.isFullHouse(cards)) {
      types["3带2"]++;
      found = true;
    } else if (this.data.judgeType["3条"] && this.is3ofAKind(cards)) {
      types["3条"]++;
      found = true;
    } else if (this.data.judgeType["2对"] && this.is2Pair(cards)) {
      types["2对"]++;
      found = true;
    } else if (this.data.judgeType["1对"] && this.isPair(cards)) {
      types["1对"]++;
      found = true;
    }
    var flushCount = this.getFlushCount(cards);
    if (this.data.judgeType["5同花"] && flushCount === 5) {
      types["5同花"]++;
      found = true;
    } else if (this.data.judgeType["4同花"] && flushCount === 4) {
      types["4同花"]++;
      found = true;
    } else if (this.data.judgeType["3同花"] && flushCount === 3) {
      types["3同花"]++;
      found = true;
    }
    var straightCount = this.getStraightCount(cards);
    if (straightCount === 5 ) {
      if (this.data.judgeType["5同花顺"] && flushCount === 5) {
        types["5同花顺"]++;
        found = true;
      } else if (this.data.judgeType["5顺子"] ) {
        types["5顺子"]++;
        found = true;
      }      
    } else if (this.data.judgeType["4顺子"] && straightCount === 4) {
      types["4顺子"]++;
      found = true;
    } else if (this.data.judgeType["3顺子"] && straightCount === 3) {
      types["3顺子"]++;
      found = true;
    }
    if (!found) {      
      types["杂牌"]++;
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
  is5Straight: function (cards) {
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
  getFlushCount: function (cards) {
    var suits = [0,0,0,0,0,0,0,0]
    _.each(cards,function(card){
      suits[card.suit]++;
    })    
    return _.max(suits);
  },
  getStraightCount: function(cards) {
    var v = _.uniq(_.map(cards, function (card) {
      return card.number;
    }, this)).join("-")
    for ( var i = 0; i < this.STRAIGHT5_LIST.length; i++ ) {
      if ( v.indexOf(this.STRAIGHT5_LIST[i]) !== -1 ) {
        return 5
      }
    }
    for (var i = 0; i < this.STRAIGHT4_LIST.length; i++) {
      if ( v.indexOf(this.STRAIGHT4_LIST[i]) !== -1) {
        return 4
      }
    }
    for (var i = 0; i < this.STRAIGHT3_LIST.length; i++) {
      if ( v.indexOf(this.STRAIGHT3_LIST[i]) !== -1) {
        return 3
      }
    }
    return 0;
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
  },
  
})
