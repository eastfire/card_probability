// pages/combo/newCombo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    combo: {
      type:Object,
      default: {
        requirements:[]
      }
    },
    cards: {
      type:Array,
      default: []
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    properties:[],
    name: "",
  },

  observers:{
    combo(){
      if ( this.data.combo ) {
        this.setData({
          name: this.data.combo.name
        })
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onConfirmPickCard(event){
      let index = event.target.dataset.index;
      this.data.combo.requirements[index].name = this.data.cards[event.detail.value].name;
      this.setData({
        combo: this.data.combo
      })
      this.triggerEvent("currentComboChange",this.data.combo)
    },

    addCard(){
      this.data.combo.requirements.push({
        type:"card",
        name: this.data.cards[0].name
      })
      this.setData({
        combo: this.data.combo
      })
      this.triggerEvent("currentComboChange",this.data.combo)
    },
    onRemoveRequire(event){
      let index = event.target.dataset.index;
      this.data.combo.requirements.splice(index,1);
      this.setData({
        combo:this.data.combo
      })
      this.triggerEvent("currentComboChange",this.data.combo)
    },
    onConfirmPickProperty(event){
      let index = event.target.dataset.index;
      this.data.combo.requirements[index].name = this.data.properties[event.detail.value].name;
      this.setData({
        combo: this.data.combo
      })
      this.triggerEvent("currentComboChange",this.data.combo)
    },

    addProperty(){
      this.data.combo.requirements.push({
        type:"property",
        name: getApp().globalData.properties[0].name
      })
      this.setData({
        properties: getApp().globalData.properties,
        combo: this.data.combo
      })
      this.triggerEvent("currentComboChange",this.data.combo)
    },    
    onChangeValue(){
      this.data.combo.name = this.data.name;
      this.setData({
        combo:this.data.combo
      })
      this.triggerEvent("currentComboChange",this.data.combo)
    }
  }
})
