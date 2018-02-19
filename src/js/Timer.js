export default class Timer {
  constructor(props) {
    const { deltaTime, update } = props
    this.deltaTime = deltaTime
    this.accumulatedTime = 0
    this.lastTime = 0
    this.update = update

    this.handleUpdate = this.handleUpdate.bind(this)
  }

  handleUpdate (time) {
    this.accumulatedTime += (time - this.lastTime) / 1000
    if (this.accumulatedTime > 1) {
      this.accumulatedTime = 1
    }
    while (this.accumulatedTime > this.deltaTime) {
      this.update(this.deltaTime)
      this.accumulatedTime -= this.deltaTime
    }

    this.lastTime = time

    this.enqueue()
  }

  enqueue () {
    requestAnimationFrame(this.handleUpdate)
  }

  start () {
    this.enqueue()
  }
}