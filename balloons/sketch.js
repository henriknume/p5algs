// Balloon stuff
const MAX_NR_OF_ATTEMPTS = 10000
const NR_OF_BALLOONS = 20
const MIN_RADIUS = 20
const MAX_RADIUS = 80
const SPACING = 1

// Colors
const BG_COLOR = 200
const RAYGUN_COLOR = 50
const BLACK = 0
const WHITE = 255

const balloons = []
const rays = []
let raygun
let controlLine

function setup () {
  createCanvas(640, 400)
  background(BG_COLOR)
  generateRandomBalloons(NR_OF_BALLOONS, MAX_NR_OF_ATTEMPTS)
  raygun = new Raygun()

  controlLine = new MyLine([200, 200], [200, 50])

}

function draw() {
  background(BG_COLOR)
  for (var b of balloons) {
    b.draw()
  }
  for (var r of rays) {
    r.draw()
  }
  raygun.draw()
  controlLine.draw()
}

function mouseClicked() {
  if (!raygun.isPlaced()) {
    raygun.placeAt(mouseX, mouseY)
  } else {
    let ray = new Ray(mouseX, mouseY, raygun)
    rays.push(ray)
    scanForHitsBy(ray)
  }

}

function generateRandomBalloons(num, attempts) {
  let c = 0
  while(balloons.length < num) {
    c++
    let newBalloon = new Balloon()
    if (noCollision(newBalloon)) {
      balloons.push(newBalloon)
    }
    if (c > attempts) {
      console.log("All ballons can not be created within attempts:" + attempts)
      break
    }
  }
}

function noCollision(newB) {
  for (var currB of balloons) {
    let distance = dist(currB.xPos, currB.yPos, newB.xPos, newB.yPos)
    if (distance <= (currB.radius + newB.radius)){
      return false
    }
  }
  return true
}

function scanForHitsBy(ray) {
  for (var b of balloons) {
    let rl = ray.getLineCoords()
    let bl = b.getNormalLineFrom(ray)
    if (lineIntersect(rl[0], rl[1], rl[2], rl[3], bl[0], bl[1], bl[2], bl[3])) {
      b.popIt()
    }
  }
}

function lineIntersect(x1,y1,x2,y2, x3,y3,x4,y4) {
    var x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4))
    var y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4))
    if (isNaN(x)||isNaN(y)) {
        throw new Error("Error: invalid arguments isNan")
    } else {
        if (x1>=x2) {
            if (!(x2<=x&&x<=x1)) {return false}
        } else {
            if (!(x1<=x&&x<=x2)) {return false}
        }
        if (y1>=y2) {
            if (!(y2<=y&&y<=y1)) {return false}
        } else {
            if (!(y1<=y&&y<=y2)) {return false}
        }
        if (x3>=x4) {
            if (!(x4<=x&&x<=x3)) {return false}
        } else {
            if (!(x3<=x&&x<=x4)) {return false}
        }
        if (y3>=y4) {
            if (!(y4<=y&&y<=y3)) {return false}
        } else {
            if (!(y3<=y&&y<=y4)) {return false}
        }
    }
    return true
}

function randomIntBetween(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

//#################  CLASSES
class Ray {
  constructor(x, y, rg) {
    this.xPos = x
    this.yPos = y
    this.p0 = this.calcPoint(rg)
    this.p1 = [rg.xPos, rg.yPos] // raygunpos
  }

  getSlope() {
    return (this.p1[1] - this.p0[1]) / (this.p1[0] - this.p0[0])
  }

  calcPoint(rg) {
    let point
    if (this.xPos < rg.xPos) {
      point = this.pointAtX(rg, this, 0)
    } else {
      point = this.pointAtX(rg, this, width)
    }
    return point
  }

  pointAtX(a, b, x) {
    var slope = (b.yPos - a.yPos) / (b.xPos - a.xPos)
    var y = a.yPos + (x - a.xPos) * slope
    return [x, y]
  }

  getLineCoords() {
    return [this.p0[0], this.p0[1], this.p1[0], this.p1[1]]
  }

  draw() {
    // Calculate a point for an extended line to the edge of the canvas
    stroke(240, 0, 0)
    line(this.p0[0], this.p0[1], this.p1[0], this.p1[1])
  }
}

class Raygun {
  constructor(){
    this.xPos = null
    this.yPos = null
  }

  placeAt(x, y) {
    this.xPos = x
    this.yPos = y
  }

  isPlaced() {
    return this.xPos != null || this.yPos != null
  }

  draw() {
    if (this.isPlaced()) {
      fill(RAYGUN_COLOR)
      stroke(BLACK)
      ellipse(this.xPos, this.yPos, 15, 15)
    }
  }
}

class Balloon {
  constructor() {
    this.radius = randomIntBetween(MIN_RADIUS, MAX_RADIUS)
    this.xPos = randomIntBetween(this.radius, (width) - this.radius)
    this.yPos = randomIntBetween(this.radius, (height) - this.radius)
    this.popped = false
  }

  getNormalLineFrom(ray) {
    let r = this.radius
    let k = -1/(ray.getSlope())
    let a = sqrt(  sq(r)/(sq(k) + 1)  )
    let b = a * k
    // [x0, y0, x1, y1]
    return [this.xPos - a, this.yPos - b, this.xPos + a, this.yPos + b]
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

class MyLine{
  // point0 is the pivot point
  constructor(point0, point1) {
    this.p0 = point0
    this.p1 = point1
  }

  draw() {
    stroke(0, 0, 255)
    line(this.p0[0], this.p0[1], this.p1[0], this.p1[1])
  }
}
