const spriteBuffer = (baseHero, enemyObj) => {

  const heroSprites = Object.values(baseHero.spriteSheets)
  for (let el of heroSprites) {
    const img = new Image()
      img.src = el
  }

  for (let el of enemyObj) {
  const enemySprites = Object.values(el.data.spriteSheets)
    for (let sprite of enemySprites) {
      const img = new Image()
      img.src = sprite
    }
  }

}

export default spriteBuffer
