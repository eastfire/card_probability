// pages/combo/propertySetting.js
const _ = require('../../utils/underscore.js')._

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    mode: "display",
    properties: [],
    newProperty: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    addProperty() {
      this.setData({mode: "input"})
    },
    removeProperty(event) {
      let index = event.target.dataset.index;
      this.data.properties.splice(index,1);
      this.setData({properties: this.data.properties});
      // getApp().globalData.properties.splice(index,1)
    },
    onInputProperty(event){
      let value = event.detail.value;
      if (value) value =value.trim();
      if ( value && value!=="" && !_.some(this.data.properties, item=>{
        return item.name === value;
      }) ) {
        this.data.properties.push({
          name: value
        })
      }
      this.setData({mode:"display", properties: this.data.properties})
    }
  },

  attached(){
    this.setData({
      properties: getApp().globalData.properties
    })
  }
})
