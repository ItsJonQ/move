class Score {
  constructor (GEM) {
    this.countNode = null
    this.count = 0
    this.step = 0
    this.mount()
    this.GEM = GEM
  }

  increment (game) {
    game.SETTINGS.score += 1
    this.count += 1
    this.render()
  }

  adjustDifficulty () {
    const c = this.count
    if (c > 20 && this.step === 0) {
      SLOWEST_THEM -= 1000
      this.step = 1
    }
    if (c > 50 && this.step === 1) {
      SLOWEST_THEM -= 1000
      this.step = 2
    }
    if (c > 70 && this.step === 2) {
      SLOWEST_THEM -= 1000
      this.step = 3
    }
  }

  mount () {
    this.node = document.createElement('div')
    this.node.classList.add('Score')
    document.body.append(this.node)

    this.countNode = document.createElement('div')
    this.countNode.classList.add('ScoreCount')
    this.node.append(this.countNode)
    this.render()
  }

  render () {
    this.countNode.innerHTML = this.count
  }
}

export default Score