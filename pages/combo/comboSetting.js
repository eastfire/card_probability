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
          requirements: combo.requirements
        }
      })
    },
    onConfirmCombo(){
      if ( this.data.mode ==="create") {
        this.data.combos.push({
          name: this.getNotDuplicatedName(this.data.currentCombo.name),
          requirements: this.data.currentCombo.requirements,
        })
      } else {
        this.data.combos[this.data.currentComboIndex]={
          name: this.getNotDuplicatedName(this.data.currentCombo.name, this.data.currentComboIndex),
          requirements: this.data.currentCombo.requirements,
        }
      }
      this.setData({
        showComboEditDialog: false,
        combos: this.data.combos
      })
      wx.setStorageSync('combos', this.data.combos)
    },
    onRemoveCombo(event){
      let index = event.currentTarget.dataset.index;
      this.data.combos.splice(index,1);
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
          requirements:[]
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
          requirements:_.clone(combo.requirements),
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
