class Entity {
  constructor () {
    this.node = null
    this.BCR = {}

    requestAnimationFrame(() => {
      this.willMount()
      this.mount()
      this.didMount()
    })
  }

  mount () {
    this.node = document.createElement('div')
    document.body.append(this.node)

    this.node.classList.add('Entity')
    this.node.innerHTML = `<div class='EntityGlow'></div>`
    this.BCR = this.node.getBoundingClientRect()
  }

  didMount () {}
  willMount () {}
}

export default Entity