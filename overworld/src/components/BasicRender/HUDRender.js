const hudRender = (ctx, currentStam, maxStam, attackCooldownOff, coolDownLevel, coolDownLevelMax, upscale, playerSprite, heroBlockSize, swordIcon, ) => {

  // sets color of stamina bar based on remaining stamina percentage
  if (currentStam > maxStam - maxStam / 3) {
    ctx.fillStyle = 'rgb(57, 201, 237)'
  } else if (currentStam > maxStam - (maxStam / 3) * 2) {
    ctx.fillStyle = 'rgb(240, 143, 33)'
  } else {
    ctx.fillStyle = 'rgb(240, 57, 33)'
  }



  // stamDisplay turns stamina bar into the proper length based on percentage of stamina remaining
  const stamDisplay = (currentStam / maxStam) * (heroBlockSize - (heroBlockSize / 2))
  // renders stamina bar if stamina is less than maximum
  if (currentStam < maxStam) {
    ctx.fillStyle = 'rgba(65, 65, 65, .5)'
    ctx.fillRect(playerSprite.position.x + (heroBlockSize / upscale), playerSprite.position.y, (heroBlockSize - (heroBlockSize / 2)), upscale)
    if (currentStam > maxStam - maxStam / 3) {
      ctx.fillStyle = 'rgba(57, 201, 237, .7)'
    } else if (currentStam > maxStam - (maxStam / 3) * 2) {
      ctx.fillStyle = 'rgb(240, 143, 33, .7)'
    } else {
      ctx.fillStyle = 'rgb(240, 57, 33, .7)'
    }
    ctx.fillRect(playerSprite.position.x + (heroBlockSize / upscale), playerSprite.position.y, stamDisplay, upscale)
  }

  // ability display with cooldown level
  if (!attackCooldownOff) {
    const cooldownDisplay = (coolDownLevel / coolDownLevelMax) * (upscale * 5)
    ctx.fillStyle = 'rgb(65, 65, 65)'
    ctx.fillRect(playerSprite.position.x, playerSprite.position.y + heroBlockSize, upscale * 5, upscale * 5)
    if (attackCooldownOff || coolDownLevel === coolDownLevelMax) {
      ctx.fillStyle = 'rgb(57, 201, 237)'
      ctx.fillRect(playerSprite.position.x, playerSprite.position.y + heroBlockSize + 1, upscale * 5, upscale * 5)
    } else {
      ctx.fillStyle = 'rgb(240, 57, 33)'
      ctx.fillRect(playerSprite.position.x, playerSprite.position.y + heroBlockSize + upscale * 5 - cooldownDisplay, upscale * 5, cooldownDisplay)
    }

    ctx.drawImage(swordIcon, playerSprite.position.x, playerSprite.position.y + heroBlockSize, upscale * 5, upscale * 5)
  }

}

export default hudRender
