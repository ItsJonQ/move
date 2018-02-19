import Entity from './Entity.js'
import {
  getRandomScreenX,
  getRandomScreenY
} from '../math.js'

class Them extends Entity {
  constructor (props) {
    super()
    const { GEM, targetMe, id, speed } = props
    this.id = id
    this.x = getRandomScreenX()
    this.y = getRandomScreenY()
    this.prevTransitionDuration = speed
    this.transitionDuration = this.prevTransitionDuration
    this.GEM = GEM
    this.top = null
    this.left = null
    this.opacity = 0
    this.targetMe = targetMe
    this.isDestroyed = false
    this._didMount = false

    this.hide = this.hide.bind(this)
    this.show = this.show.bind(this)

    // this.GEM.on('hideThem', this.hide)
    // this.GEM.on('showThem', this.show)
  }

  didMount () {
    this.node.style.transitionProperty = `opacity, transform`
    this.node.style.transitionDuration = `0ms, 0ms`
    this.node.style.transform = `translate(${this.x}px, ${this.y}px)`
    requestAnimationFrame(() => {
      this.node.classList.add('Them')
      this.opacity = 1
      this.node.style.opacity = this.opacity
      this.setTransitionDuration(800)
    })
    setTimeout(() => {
      this._didMount = true
      this.setTransitionDuration(10)
    }, 500)
  }

  setTransitionDuration (o = 500, t) {
    this.node.style.transitionDuration = `${o}ms, ${this.transitionDuration}ms`
  }

  draw () {
    if (!this.node || !this._didMount) return
    this.BCR = this.node.getBoundingClientRect()
    let x = this.targetMe.x
    let y = this.targetMe.y

    this.x = this.BCR.left
    this.y = this.BCR.top

    this.node.style.opacity = this.opacity
    this.node.style.transform = `translate(${x}px, ${y}px)`
  }

  speedUp () {
    if (!this.node) return
    this.transitionDuration = this.transitionDuration * 0.98
    this.setTransitionDuration()
  }

  slowDown () {
    if (!this.node) return
    this.transitionDuration = this.prevTransitionDuration
    this.setTransitionDuration()
  }

  destroy () {
    if (!this.isDestroyed) {
      this.node.style.transitionDuration = `0ms`
      this.node.style.transform = `translate(${this.x}px, ${this.y}px)`
      this.isDestroyed = true

      this.disappear()
    }
  }

  hide () {
    this.node.style.opacity = 0
  }
  show () {
    this.node.style.opacity = 1
  }

  disappear () {
    this.node.style.transitionDuration = `400ms`
    this.node.style.opacity = 0
    setTimeout(() => {
      this.node.parentNode.removeChild(this.node)
    }, 500)
  }
}

export default Them