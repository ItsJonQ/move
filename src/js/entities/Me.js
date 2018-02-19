import Entity from './Entity.js'

class Me extends Entity {
  constructor (GEM) {
    super ()
    this.GEM = GEM
    this.reposition = this.reposition.bind(this)
    this.fire = this.fire.bind(this)
    this.prevX = 0
    this.prevY = 0
    this.x = 0
    this.y = 0
    this.canFire = true
    this.isMoving = false
    window.addEventListener('mousemove', this.reposition)
    window.addEventListener('click', this.fire)
  }

  didMount () {
    this.node.classList.add('Me')
    this.renderCanFire()
  }

  reload () {
    this.canFire = (this.prevX === this.x && this.prevY === this.y)
    this.isMoving = !this.canFire

    if (!this.isMoving) {
      this.GEM.emit('hideThem')
    } else {
      this.GEM.emit('showThem')
    }
  }

  draw () {
    // this.renderCanFire()
    this.node.style.transform = `translate(${this.x}px, ${this.y}px)`
    this.GEM.emit('meMove', this)
  }

  reposition (event) {
    const { pageX, pageY } = event
    this.prevX = this.x
    this.prevY = this.y
    this.x = pageX - (this.BCR.width / 2)
    this.y = pageY - (this.BCR.height / 2)
    // this.reload()
  }

  fire (event) {
    if (!this.canFire) return
    this.GEM.emit('meFire')
  }

  renderCanFire () {
    this.node.classList.toggle('can-fire', this.canFire)
  }
}

export default Me