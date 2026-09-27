Component({
  properties: {
    icon: { type: String, value: '' },
    text: { type: String, value: '' },
    url: { type: String, value: '' }
  },
  methods: {
    onTap() {
      this.triggerEvent('navtap', { url: this.data.url })
    }
  }
})
