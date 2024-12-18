let fireworks = [];
let gravity;

function setup() {
  createCanvas(windowWidth, windowHeight);
  gravity = createVector(0, 0.2);
}

function draw() {
  background(0);
  
  if (random(1) < 0.03) {
    fireworks.push(new Firework());
  }

  for (let firework of fireworks) {
    firework.update();
    firework.show();
  }

  for (let i = fireworks.length - 1; i >= 0; i--) {
    if (fireworks[i].done()) {
      fireworks.splice(i, 1);
    }
  }
}

class Firework {
  constructor() {
    this.firework = new Particle(random(width), height, true);
    this.exploded = false;
    this.particles = [];
  }

  update() {
    if (!this.exploded) {
      this.firework.applyForce(gravity);
      this.firework.update();
      if (this.firework.vel.y >= 0) {
        this.exploded = true;
        this.explode();
      }
    }

    for (let particle of this.particles) {
      particle.update();
    }
  }

  explode() {
    for (let i = 0; i < 100; i++) {
      this.particles.push(new Particle(this.firework.position.x, this.firework.position.y, false));
    }
  }

  done() {
    return this.exploded && this.particles.length === 0;
  }

  show() {
    if (!this.exploded) {
      this.firework.show();
    }

    for (let particle of this.particles) {
      particle.show();
    }

    if (this.exploded && this.particles.length === 0) {
      this.showMessage();
    }
  }

  showMessage() {
    fill(255);
    textSize(64);
    textAlign(CENTER);
    text("I Love You", width / 2, height / 2);
  }
}

class Particle {
  constructor(x, y, firework) {
    this.position = createVector(x, y);
    this.firework = firework;
    this.vel = createVector(0, firework ? random(-12, -8) : random(-2, 2));
    this.acc = createVector(0, 0);
    this.lifespan = 255;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.position.add(this.vel);
    this.acc.mult(0);
    if (!this.firework) {
      this.lifespan -= 4;
    }
  }

  show() {
    if (this.firework) {
      stroke(255);
      strokeWeight(4);
      point(this.position.x, this.position.y);
    } else {
      stroke(255, this.lifespan);
      strokeWeight(2);
      ellipse(this.position.x, this.position.y, 8);
    }
  }

  done() {
    return this.lifespan < 0;
  }
}
