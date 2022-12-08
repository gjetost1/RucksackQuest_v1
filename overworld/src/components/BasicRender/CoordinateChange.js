const coordinateChange = (baseHero, changeArr) => {
  for (let el of changeArr) {
    el.data.x += baseHero.frameXChange
    el.data.y += baseHero.frameYChange
    el.position.x = el.data.x
    el.position.y = el.data.y
  }
  return changeArr
}

export default coordinateChange
