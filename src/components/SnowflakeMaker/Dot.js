class Dot {
  constructor (x, y, color, ctx) {
    this.x = x;
    this.y = y;
    this.rad = Dot.DOT_RAD;
    this.color = color;
    this.ctx = ctx;
  }

  drawMe () {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.rad, 0, 2*Math.PI, false);
    this.ctx.closePath();
    this.ctx.fill();
  }

  highlight () {
    this.ctx.strokeStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.rad+2, 0, 2*Math.PI, false);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  mouseOverMe (mouseX, mouseY) {
    var dx = this.x - mouseX;
    var dy = this.y - mouseY;
    return (dx*dx + dy*dy < this.rad*this.rad);
  }
};
Dot.DOT_RAD = 6.5;
Dot.FIRST_DOT_RAD = 10;
export default Dot;
