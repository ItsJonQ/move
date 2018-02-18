const meMoveEvent = new Event('me:move')
const MAX_THEM = 100
let SCORE = 0

document.body.style.position = 'relative'
document.body.style.overflow = 'hidden'

const Score = document.createElement('div')
Score.style.position = 'fixed'
Score.style.left = '0'
Score.style.width = '100%'
Score.style.textAlign = 'center'
Score.style.bottom = '10px'
Score.style.pointerEvents = 'none'
Score.style.userSelect = 'none'
Score.style.fontSize = '48px'
Score.style.zIndex = '2'
document.body.append(Score)

const Me = document.createElement('div')
Me.style.width = '50px'
Me.style.height = '50px'
Me.style.borderRadius = '9999px'
Me.style.backgroundColor = 'dodgerblue'
Me.style.opacity = 0
Me.style.willChange = 'transform'
document.body.append(Me)
const MeBCR = Me.getBoundingClientRect()

const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getRandomScreenX = () => {
  return getRandom(0, window.innerWidth)
}
const getRandomScreenY = () => {
  const min = 0
  return getRandom(0, window.innerHeight)
}

let themCount = 0

const addThem = () => {
  themCount = themCount + 1
  if (themCount > MAX_THEM) return
  const Them = document.createElement('div')
  Them.style.width = '50px'
  Them.style.height = '50px'
  Them.style.borderRadius = '9999px'
  Them.style.backgroundColor = 'orangered'
  Them.style.opacity = 0
  Them.style.willChange = 'transform'
  Them.style.transitionDuration = `${getRandom(100, 5000)}ms`
  Them.style.position = 'absolute'
  Them.style.top = `${getRandomScreenX()}px`
  Them.style.right = `${getRandomScreenY()}px`
  Them.style.transitionTimingFunction = 'linear'
  Them.classList.add('them')
  document.body.append(Them)
  const BCR = Them.getBoundingClientRect()
  const { top, left } = BCR
  Them.setAttribute('data-top', top)
  Them.setAttribute('data-left', left)

  Them.addEventListener('transitionend', maybeCatchMe)
}

const repositionMe = (event) => {
  const { pageX, pageY } = event
  const x = pageX - (MeBCR.width / 2) - MeBCR.left
  const y = pageY - (MeBCR.height / 2) - MeBCR.top
  requestAnimationFrame(() => {
    Me.style.opacity = 1
    Me.style.transform = `translate(${x}px, ${y}px)`
    const BCR = Me.getBoundingClientRect()
    Me.setAttribute('data-current-x', BCR.left)
    Me.setAttribute('data-current-y', BCR.top)
    Me.dispatchEvent(meMoveEvent)
  })
}

const repositionThem1 = (event) => {
  const me = event.target
  const currentBCR = me.getBoundingClientRect()
  const { x, y } = currentBCR
  const ThemNodes = document.querySelectorAll('.them')
  ThemNodes.forEach(n => {
    n.style.opacity = 1
    const left = n.getAttribute('data-left')
    const top = n.getAttribute('data-top')
    const tX = x - left
    const tY = y - top
    requestAnimationFrame(() => {
      n.style.transform = `translate(${tX}px, ${tY}px)`
      const BCR = n.getBoundingClientRect()
      n.setAttribute('data-current-x', BCR.left)
      n.setAttribute('data-current-y', BCR.top)
    })
  })
}

const maybeCatchMe = (event) => {
  const node = event.target
  const BCR = node.getBoundingClientRect()
  const t = 25
  const x = Math.round(BCR.left) - t
  const y = Math.round(BCR.top) - t
  const mX = parseInt(Me.getAttribute('data-current-x'), 10)
  const mY = parseInt(Me.getAttribute('data-current-y'), 10)

  if (
    mX >= (x - t) && mX <= (x + t + t) &&
    mY >= (y - t) && mY <= (y + t + t)
  ) {
    window.location.reload()
  }
}

const destroyThem = (event) => {
  const { pageX, pageY } = event
  let closestThem = Array.from(document.querySelectorAll('.them'))
  if (!closestThem.length) return

  closestThem = closestThem
    .reduce((prev, curr) => {
      const pBCR = prev.getBoundingClientRect()
      const cBCR = curr.getBoundingClientRect()
      const pX = pBCR.left
      const pY = pBCR.top
      const cX = cBCR.left
      const cY = cBCR.top
      return (
        (
          Math.abs(cX - pageX) < Math.abs(pX - pageX) &&
          Math.abs(cY - pageY) < Math.abs(pY - pageY)
        )
        ? curr : prev
      )
    })

  if (closestThem) {
    document.body.removeChild(closestThem)
    themCount = themCount - 1
    SCORE = SCORE + 1
    renderScore()
  }
}

const resetThemCoords = () => {
  let themNodes = Array.from(document.querySelectorAll('.them'))
  themNodes.map(n => {
    const t = n.getAttribute('data-top')
    const l = n.getAttribute('data-left')
    const ot = n.offsetTop
    const ol = n.offsetLeft
    if (t === ot || l === ol) return
    n.setAttribute('data-top', ot)
    n.setAttribute('data-left', ol)
  })
}

const renderScore = () => {
  Score.innerHTML = SCORE
}

window.addEventListener('mousemove', repositionMe)
window.addEventListener('click', destroyThem)
window.addEventListener('resize', resetThemCoords)
Me.addEventListener('me:move', repositionThem1)

renderScore()
setInterval(addThem, 500)
