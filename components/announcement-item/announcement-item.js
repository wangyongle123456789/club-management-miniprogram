Component({
  properties: {
    itemId: { type: Number, value: 0 },
    title: { type: String, value: '' },
    time: { type: String, value: '' },
    type: { type: String, value: 'notice' }
  },
  methods: {
    onTap() {
      // 事件 key 仍叫 id，父页面 goToAnnouncementDetail 无需改动
      this.triggerEvent('tap', { id: this.properties.itemId })
    }
  }
})
