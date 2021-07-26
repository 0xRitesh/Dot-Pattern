class Dot {
  constructor() {
    this.speed = speed;
    this.vel = createVector(random(-1, 1), random(-1, 1)).normalize();
    this.x = random(0, width);
    this.y = random(0, height);
    this.found = [];
  }

  draw() {
    fill(255, 255 / 2);
    circle(this.x, this.y, 3, 3);

    this.x += this.vel.x * this.speed;
    this.y += this.vel.y * this.speed;
  }
}