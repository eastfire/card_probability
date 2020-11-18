// pages/combo/comboSetting.js
const _ = require('../../utils/underscore.js')._

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cards:{
      type:Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    combos:[],
    showComboEditDialog: false,
    currentCombo: null,
    currentComboIndex: -1,
    mode:null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCurrentComboChange(event){
      let combo = event.detail;
      this.setData({
        currentCombo: {
          name: combo.name,
          properties: combo.properties,
          cards: combo.cards
        }
      })
    },
    onConfirmCombo(){
      if ( this.data.mode ==="create") {
        this.data.combos.push({
          name: this.getNotDuplicatedName(this.data.currentCombo.name),
          properties: this.data.currentCombo.properties,
          cards: this.data.currentCombo.cards,
        })
      } else {
        this.data.combos[this.data.currentComboIndex]={
          name: this.getNotDuplicatedName(this.data.currentCombo.name, this.data.currentComboIndex),
          properties: this.data.currentCombo.properties,
          cards: this.data.currentCombo.cards,
        }
      }
      this.setData({
        showComboEditDialog: false,
        combos: this.data.combos
      })
      wx.setStorageSync('combos', this.data.combos)
    },
    onRemoveCombo(event){
      this.data.combos.splice(this.data.currentComboIndex,1);
      this.setData({
        showComboEditDialog: false,
        combos: this.data.combos
      })
      wx.setStorageSync('combos', this.data.combos)
    },
    onAddCombo(event){
      this.setData({
        currentCombo: {
          name:"",
          cards:[],
          properties:[]
        },
        showComboEditDialog:true,
        mode:"create"
      })
    },
    onEditCombo(event){
      let index = event.currentTarget.dataset.index;
      let combo = this.data.combos[index];
      this.setData({
        currentCombo: {
          name:combo.name,
          cards:_.clone(combo.cards),
          properties:_.clone(combo.properties),
        },
        currentComboIndex: index,
        showComboEditDialog:true,
        mode:"edit"
      })
    },
    getNotDuplicatedName(name, meIndex=-1){
      let n = name;
      let index = 1;
      while(_.some(this.data.combos, (card,index)=>{return card.name === n && meIndex!==index})){
        n = name+index;
        index++;
      }
      return n;
    },
  },

  attached(){
    this.setData({
      combos: getApp().globalData.combos
    })
  }
})
