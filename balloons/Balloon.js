class Balloon {
  constructor() {
    this.radius = randomIntBetween(MIN_RADIUS, MAX_RADIUS)
    this.xPos = randomIntBetween(this.radius, (width) - this.radius)
    this.yPos = randomIntBetween(this.radius, (height) - this.radius)
    this.popped = false
    this.distToCtrl = -1
  }

  getNormalLineFrom(ray) {
    let r = this.radius
    let k = -1/(ray.getSlope())
    let a = sqrt(  sq(r)/(sq(k) + 1)  )
    let b = a * k
    // [x0, y0, x1, y1]
    return [this.xPos - a, this.yPos - b, this.xPos + a, this.yPos + b]
  }

  getRightPointOfNormalLineFrom(ray) {
    let r = this.radius
    let k = -1/(ray.getSlope())
    let a = sqrt(  sq(r)/(sq(k) + 1)  )
    let b = a * k
    // [x0, y0, x1, y1]
    return [this.xPos + a, this.yPos + b]
  }

  popIt() {
    console.log("popped")
    this.popped = true
  }

  draw() {
    if (this.popped) {
      fill(BG_COLOR)
    } else {
      fill(WHITE)
    }
    stroke(BLACK)
    ellipse(this.xPos, this.yPos, this.radius*2, this.radius*2)
  }
}
