// returns true if coordinate x2,y2 is within the radius of a circle with
// center point x1,y1 and false if it is outside that radius

const checkRadius = (x1, y1, x2, y2, radius) => {
  const distance = Math.sqrt((x2 - x1)**2 + (y2 - y1)**2)
  // console.log(x1, y1, x2, y2, radius, distance)
  // console.log(distance, radius)
  return distance <= radius
}

export default checkRadius
