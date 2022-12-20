import globalVars from "./GlobalVars";
/* A utility function to calculate area of triangle formed by (x1, y1),
(x2, y2) and (x3, y3) */
const area = (x1, y1, x2, y2, x3, y3) =>
{
return Math.abs((x1*(y2-y3) + x2*(y3-y1)+ x3*(y1-y2))/2.0);
}

const triangleCheck = (x, y, mouseAreas, dataVisCtx) => {

  x += globalVars.offscreenBoundarySide
  y += globalVars.offscreenBoundarySide

  // dataVisCtx.fillRect(x, y, 4, 4)

  for (let el of mouseAreas) {
    const x1 = el.x1
    const x2 = el.x2
    const x3 = el.x3
    const y1 = el.y1
    const y2 = el.y2
    const y3 = el.y3

    //uncomment to show the zone borders
    // dataVisCtx.fillStyle = 'rgba(255, 0, 0, 1)'
    // dataVisCtx.moveTo(x1, y1)
    // dataVisCtx.lineTo(x2, y2)
    // dataVisCtx.lineTo(x3, y3)
    // dataVisCtx.lineTo(x1, y1)
    // dataVisCtx.lineWidth = 4;
    // dataVisCtx.stroke();

    /* Calculate area of triangle ABC */
    let A = area (x1, y1, x2, y2, x3, y3);

    /* Calculate area of triangle PBC */
    let A1 = area (x, y, x2, y2, x3, y3);

    /* Calculate area of triangle PAC */
    let A2 = area (x1, y1, x, y, x3, y3);

    /* Calculate area of triangle PAB */
    let A3 = area (x1, y1, x2, y2, x, y);

    /* Check if sum of A1, A2 and A3 is same as A */
    if (A === A1 + A2 + A3) {
      return el.zone
    }
  }
  return false
}

export default triangleCheck
