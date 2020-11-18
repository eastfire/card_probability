// pages/combo/newCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    card:{
      type:Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    properties:[],
    name: "",
    copyNumber: 1
  },
  observers:{
    card(){
      if ( this.data.card ) {
        this.setData({
          name: this.data.card.name,
          copyNumber: this.data.card.copyNumber
        })
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onConfirmPickProperty(event){
      let index = event.target.dataset.index;
      this.data.card.properties[index].name = this.data.properties[event.detail.value].name;
      this.setData({
        card: this.data.card
      })
      this.triggerEvent("currentCardChange",this.data.card)
    },

    addProperty(){
      this.data.card.properties.push({
        name: getApp().globalData.properties[0].name
      })
      this.setData({
        properties: getApp().globalData.properties,
        card: this.data.card
      })
      this.triggerEvent("currentCardChange",this.data.card)
    },
    onRemoveProperty(event){
      let index = event.target.dataset.index;
      this.data.card.properties.splice(index,1);
      this.setData({
        card:this.data.card
      })
      this.triggerEvent("currentCardChange",this.data.card)
    },
    onChangeValue(){
      this.data.card.copyNumber = this.data.copyNumber;      
      this.data.card.name = this.data.name;
      this.setData({
        card:this.data.card
      })
      this.triggerEvent("currentCardChange",this.data.card)
    }
  },
  attached(){
  }
})
