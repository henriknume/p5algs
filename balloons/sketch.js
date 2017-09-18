// Balloon stuff
const MAX_NR_OF_ATTEMPTS = 10000
const NR_OF_BALLOONS = 4
const MIN_RADIUS = 20
const MAX_RADIUS = 80
const SPACING = 1

// Colors
const BG_COLOR = 200
const RAYGUN_COLOR = 50
const BLACK = 0
const WHITE = 255

const balloons = []
const sortedBalloons = []
const rays = []
let raygun
let controlLine

function setup () {
  createCanvas(640, 400)
  background(BG_COLOR)
  generateRandomBalloons(NR_OF_BALLOONS, MAX_NR_OF_ATTEMPTS)
  raygun = new Raygun()
}

function draw() {
  background(BG_COLOR)
  for (var b of balloons) {
    b.draw()
  }
  for (var r of rays) {
    r.drawRed()
  }
  raygun.draw()
  if (controlLine != undefined) {
    controlLine.drawGreen()
  }
}

function mouseClicked() {
  if (!raygun.isPlaced()) {
    raygun.placeAt(mouseX, mouseY)
  } else {

    if (controlLine == undefined) {
      controlLine = new Ray([raygun.xPos, raygun.yPos], [mouseX, mouseY])
    } else {

      sortb(balloons, controlLine)
      solve()
    }
  }
}

function solve() {
    for (var b of balloons) {

      b.getRightPointOfNormalLineFrom()

      let rl = controlLine.getEdgeLineCoord()
      let bl = b.getNormalLineFrom(controlLine)
      if (lineIntersect(rl[0], rl[1], rl[2], rl[3], bl[0], bl[1], bl[2], bl[3]) && !b.popped) {
        //fire ray
        let ray = new Ray([raygun.xPos, raygun.yPos], [controlLine.p1[0],controlLine.p1[1]])
        rays.push(ray)
        scanForHitsBy(ray)
      }
    }
  }
}

function sortb(balloons, line){
  for (let b of balloons) {
    b.distToCtrl = getAngleToB(b, line)
  }
  let res = balloons.sort(function(a, b) {
    return parseFloat(a.distToCtrl) - parseFloat(b.distToCtrl);
  })
}

function getAngleToB(balloon, fromLine) {
  let b = getAngleDegB([fromLine.p0[0], fromLine.p0[1]], [balloon.xPos, balloon.yPos])
  let a = fromLine.angle
  let res = b - a
  console.log("res:" + res)
  return res
}

function getAngleDegB(a, b) {
  return Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
}

function ballonsLeft() {
  for (let b of balloons) {
    if (!b.popped) {
      return true
    }
  }
  return false
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
    let rl = ray.getEdgeLineCoords()
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
        //throw new Error("Error: invalid arguments isNan")
        console.log("isNan")
        return false
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
