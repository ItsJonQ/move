export const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getRandomScreenX = () => {
  return getRandom(0, window.innerWidth)
}

export const getRandomScreenY = () => {
  const min = 0
  return getRandom(0, window.innerHeight)
}

export const getDistance = (t, m) => {
  const dX = t.x - m.x
  const dY = t.y - m.y
  return Math.sqrt(dX * dX + dY * dY)
}