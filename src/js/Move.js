import mitt from './mitt.js'
import Timer from './Timer.js'
import Me from './entities/Me.js'
import Them from './entities/Them.js'
import { getRandom, getDistance } from './math.js'

class Move {
  constructor () {
    this.SETTINGS = {
      THEM_SPEED_RANGE: [800, 5000],
      MAX_THEM: 100
    }
    this.GEM = mitt()
    this.Me = new Me(this.GEM)
    this.them = []
    this.closestThem = null
    this.distanceThreshold = 300

    this.draw = this.draw.bind(this)

    this.timer = new Timer({
      deltaTime: 1/60,
      update: (deltaTime) => {
        this.draw()
      }
    })

    this.addThem = this.addThem.bind(this)
    this.startAddingThem = this.startAddingThem.bind(this)
    this.handleCollision = this.handleCollision.bind(this)
    this.handleMeFire = this.handleMeFire.bind(this)

    this.GEM.on('meFire', this.handleMeFire)
    this.startAddingThem()
    this.timer.start()
  }

  startAddingThem () {
    setInterval(this.addThem, 1000)
  }

  addThem () {
    const { MAX_THEM, THEM_SPEED_RANGE: SPEED } = this.SETTINGS
    if (this.them.length >= MAX_THEM) return
    const them = new Them({
      GEM: this.GEM,
      targetMe: this.Me,
      id: this.them.length,
      speed: getRandom(SPEED[0], SPEED[1])
    })
    this.them.push(them)
  }

  draw () {
    this.Me.draw()
    this.them.forEach(t => t.draw())
    this.handleCollision()
    this.calculateClosestThem()
  }

  calculateClosestThem () {
    let them = null
    if (this.them.length === 1) {
      them = this.them[0]
    }
    else if (this.them.length) {
      them = this.closestThem = this.them.reduce((p, n) => {
        const d1 = getDistance(p, this.Me)
        const d2 = getDistance(n, this.Me)
        return d1 < d2 ? p : n
      })
    }
    this.closestThem = them
  }

  handleCollision (them) {
    const m = this.Me
    this.them.filter(t => t._didMount).forEach(t => {
      const d = getDistance(t, m)
      const end = 50
      t.opacity = (100 - (d / 6)) * 0.01
      if (d > end && d < this.distanceThreshold) {
        return t.speedUp()
      }
      if (d > end) {
        return t.slowDown()
      }
      if (d < end) {
        window.location.reload()
      }
    })
  }

  handleMeFire () {
    if (this.closestThem) {
      const index = this.them.indexOf(this.closestThem)
      if (this.them.length) {
        const d = getDistance(this.closestThem, this.Me)
        if (d <= 400) {
          this.closestThem.destroy()
          this.them.splice(index, 1)
        }
      }
    }
  }
}

new Move()