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
