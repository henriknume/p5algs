class Ray {
  constructor(point0, point1) {
    this.p0 = point0 //raygun
    this.p1 = point1
    this.angle = this.getAngleDeg(point0, point1)
  }

  getSlope() {
    return (this.p1[1] - this.p0[1]) / (this.p1[0] - this.p0[0])
  }

  calcEdgePoint() {
    let point
    if (this.p1[0] < this.p0[0]) {
      point = this.pointAtX(this.p0, this.p1, 0)
    } else {
      point = this.pointAtX(this.p0, this.p1, width)
    }
    return point
  }

  pointAtX(a, b, x) {
    let slope = (b[1] - a[1]) / (b[0] - a[0])
    let y = a[1] + (x - a[0]) * slope
    return [x, y]
  }

  getEdgeLineCoords() {
    let endOfCanvas = this.calcEdgePoint()
    return [this.p0[0], this.p0[1], endOfCanvas[0], endOfCanvas[1]]
  }

  drawRed() {
    stroke(255, 0, 0)
    let eoc = this.calcEdgePoint() // edge of canvas
    line(this.p0[0], this.p0[1], eoc[0], eoc[1])
  }

  // Calculate and draw a line to the edge of the canvas.
  drawGreen() {
    stroke(0, 255, 0)
    let eoc = this.calcEdgePoint() // edge of canvas
    line(this.p0[0], this.p0[1], eoc[0], eoc[1])
  }

  getAngleDeg(a, b) {
    return Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
  }

  //Rotating point p1 around point p0 with the angle in degrees.
  rotateLine(degrees) {
    this.angle = ((this.angle + degrees) % 360)
    let r = dist(this.p0[0], this.p0[1], this.p1[0], this.p1[1])
    let x = this.p0[0]
    let y = this.p0[1]
    let dx = r * cos(radians(this.angle))
    let dy = r * sin(radians(this.angle))
    this.p1[0] = x + dx;
    this.p1[1] = y + dy;
  }

  getSlope() {
    return (this.p1[1] - this.p0[1]) / (this.p1[0] - this.p0[0])
  }
}
