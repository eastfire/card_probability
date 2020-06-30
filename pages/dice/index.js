//index.js
//获取应用实例
const _ = require('../../utils/underscore.js')._
const app = getApp()

Page({
  data: {
    dices: [],
    results: [],
    loading: false,
    progress: ""
  },  
  //事件处理函数
  delDice:function(event){
    var index = event.target.id - 1;
    this.data.dices.splice(index, 1);
    //recalculate number
    for (var i = 0; i < this.data.dices.length; i++) {
      this.data.dices[i].number = i + 1;
    }
    this.setData({
      dices: this.data.dices
    })
  },
  addD4() {
    this.data.dices.push({ number: this.data.dices.length + 1, faces: [1, 2, 3, 4] })
    this.setData({
      dices:this.data.dices
    })
  },
  addD6() {
    this.data.dices.push({ number: this.data.dices.length + 1, faces: [1, 2, 3, 4, 5, 6] })
    this.setData({
      dices: this.data.dices
    })
  },
  addD8() {
    this.data.dices.push({ number: this.data.dices.length + 1, faces: [1, 2, 3, 4, 5, 6, 7, 8] })
    this.setData({
      dices: this.data.dices
    })
  },
  addD10() {
    this.data.dices.push({ number: this.data.dices.length + 1, faces: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] })
    this.setData({
      dices: this.data.dices
    })
  },
  addD12() {
    this.data.dices.push({ number: this.data.dices.length + 1, faces: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] })
    this.setData({
      dices: this.data.dices
    })
  }, 
  changeFace:function(event){
    var dices = this.data.dices;
    dices[event.target.dataset.dice].faces[event.target.dataset.face] = event.detail.value;
    this.setData({
      dices: dices
    })
  },
  startCalculate:function(){
    wx.setStorageSync('dices', this.data.dices)
    this.setData({ loading: true, progress: ""});
    var face_indexs = [];
    var totalMap = {};
    var maxMap = {};
    var minMap = {};
    var diffMap = {};
    var sameCountOneTotalMap = {};
    var removeSameMaxMap = {};
    var removeSameTotalMap = {};
    var typeMap = {};
    var dices = this.data.dices;
    var diceCount = dices.length
    var currentIndex = 0;
    for (var i = 0; i < diceCount; i++) {
      face_indexs.push(0);
      for (var j = 0; j < dices[i].faces.length; j++) {
        dices[i].faces[j] = parseInt(dices[i].faces[j]);
      }
    }
    var isFinished = false;
    var improveIndex = function (dices) {
      face_indexs[currentIndex]++;
      if (face_indexs[currentIndex] >= dices[currentIndex].faces.length) {
        face_indexs[currentIndex] = 0;
        currentIndex++;
        if (currentIndex >= diceCount) {
          isFinished = true;
        } else {
          improveIndex(dices);
        }
      }
    }
    var saveType = function (count, threshold, typeName, typeMap) {
      if (count >= threshold) {
        //save typeMap
        var key = typeName + count;
        if (undefined === typeMap[key]) {
          typeMap[key] = 1;
        } else typeMap[key]++;
      }
    }
    var judgeType = function (sortedArray, typeMap) {
      var sameCount = 0;
      var straightCount = 0;
      var currentSameFace = null;
      var currentSameCount = 0;
      var currentStraightCount = 0;
      var currentStraightHead = null;
      var maxSameCount = 0;
      var maxStraightCount = 0;
      for (var i = 0; i < sortedArray.length; i++) {
        var currentFace = sortedArray[i];
        if (currentFace === currentSameFace) {
          currentSameCount++;
        } else {
          if (maxSameCount < currentSameCount) {
            maxSameCount = currentSameCount;
          }
          currentSameFace = currentFace;
          currentSameCount = 1;
        }

        if (currentFace === currentStraightHead + 1) {
          currentStraightCount++;
        } else {
          if (maxStraightCount < currentStraightCount) {
            maxStraightCount = currentStraightCount;
          }

          currentStraightHead = currentFace;
          currentStraightCount = 1;
        }
      }
      if (maxSameCount < currentSameCount) {
        maxSameCount = currentSameCount;
      }
      if (maxStraightCount < currentStraightCount) {
        maxStraightCount = currentStraightCount;
      }
      if (maxSameCount == 1) {
        saveType(sortedArray.length, 0, "全不同", typeMap);
      }
      saveType(maxSameCount, 2, "同数", typeMap);
      saveType(maxStraightCount, 3, "顺子", typeMap);
    }

    var sum = _.reduce(dices, function (memo, dice) { return memo * dice.faces.length; }, 1);
    var progress = 0;
    var self = this;
    var calculateSingleCombination = function(){
      var currentFaces = [];
      var total = 0;
      for (var i = 0; i < diceCount; i++) {
        total += (currentFaces[i] = dices[i].faces[face_indexs[i]]);
      }
      let max = Math.max(...currentFaces);
      let min = Math.min(...currentFaces);
      let diff = max - min;

      if (undefined === totalMap[total]) {
        totalMap[total] = 1;
      } else totalMap[total]++;

      if (undefined === maxMap[max]) {
        maxMap[max] = 1;
      } else maxMap[max]++;

      if (undefined === minMap[min]) {
        minMap[min] = 1;
      } else minMap[min]++;

      if (undefined === diffMap[diff]) {
        diffMap[diff] = 1;
      } else diffMap[diff]++;
      //judge type
      var sortedFaces = currentFaces.sort();
      judgeType(sortedFaces, typeMap)
    }
    var clusterCalculate = function(){
      var inner_progress = 0;
      do {
        calculateSingleCombination();
        progress++
        inner_progress ++
        currentIndex = 0;
        improveIndex(dices);
      } while (inner_progress < 100000 && !isFinished )
      if ( !isFinished ) {
        self.setData({ progress: (progress / sum * 100).toFixed(2) })
        setTimeout(clusterCalculate, 0);
      } else {
        outputResult();
      }
    }
    
    setTimeout(clusterCalculate, 0);      
    
    var outputResult = function(){
      self.data.results = [];
      //output
      self.data.results.push("------总值分布-------");
      var keys = _.keys(totalMap);
      _.each(keys, function (key) {
        this.data.results.push("总值" + key + "：" + totalMap[key] + "/" + sum + " " + (totalMap[key] / sum * 100).toFixed(4) + "%")
      }, self)

      self.data.results.push("------最大值分布-------");
      keys = _.keys(maxMap);
      _.each(keys, function (key) {
        this.data.results.push("最大值" + key + "：" + maxMap[key] + "/" + sum + " " + (maxMap[key] / sum * 100).toFixed(4) + "%")
      }, self)

      self.data.results.push("------最小值分布-------");
      keys = _.keys(minMap);
      _.each(keys, function (key) {
        this.data.results.push("最大值" + key + "：" + minMap[key] + "/" + sum + " " + (minMap[key] / sum * 100).toFixed(4) + "%")
      }, self)

      self.data.results.push("------最大值减最小值分布-------");
      keys = _.keys(diffMap);
      _.each(keys, function (key) {
        this.data.results.push("最大最小差值" + key + "：" + diffMap[key] + "/" + sum + " " + (diffMap[key] / sum * 100).toFixed(4) + "%")
      }, self)

      self.data.results.push("------类型分布------");

      var keys = _.keys(typeMap).sort();
      _.each(keys, function (key) {
        this.data.results.push(key + "：" + typeMap[key] + "/" + sum + " " + (typeMap[key] / sum * 100).toFixed(4) + "%")
      }, self)

      self.setData({ results: self.data.results, loading: false });
    }    
  },
  onLoad: function () {
    var dices = wx.getStorageSync('dices') || [{ number: 1, faces: [1, 2, 3, 4, 5, 6] }, { number: 2, faces: [1, 2, 3, 4, 5, 6] }]
    this.setData({ dices: dices })
  }
})
