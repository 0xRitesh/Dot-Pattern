let dots = [];
let user = true, tree = false, started = false;

const FREQ = 5, DIST = 100, SPEED = 0.2;
let freq = FREQ, speed = SPEED;

function setup() {
  createCanvas(windowWidth, windowHeight);
  document.querySelector("canvas").addEventListener("contextmenu", e => {
    e.preventDefault();
    tree = !tree;
  });
  noStroke();
}

function draw() {
  if (!started) return;
  
  background("#0e1117");

  let quadtree = new QuadTree(new Boundary(width / 2, height / 2, width / 2, height / 2), 4);

  if (frameCount % freq == 0) {
    let d = new Dot();
    dots.push(d);
  }

  for (let i = dots.length - 1; i >= 0; i--) {
    let dot = dots[i];
    dot.draw();

    quadtree.insert(dot);

    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      dots.splice(i, 1);
      continue;
    }
  }

  if (tree) {
    drawTree(quadtree);
  }

  if (user) {
    let found = quadtree.query(new Boundary(mouseX, mouseY, DIST, DIST));

    for (const dot of found) {
      const d = dist(dot.x, dot.y, mouseX, mouseY);

      if (d < DIST) {
        push();
        strokeWeight(1);
        stroke(255, 255 / map(d, 0, DIST, 0, 10));
        line(dot.x, dot.y, mouseX, mouseY);
        pop();
      }
    }
  } else {
    for (let i = 0; i < dots.length; i++) {
      let dot = dots[i];
      
      const candidates = quadtree.query(new Boundary(dot.x, dot.y, DIST / 2, DIST / 2));

      for (let j = 0; j < candidates.length; j++) {
        let candidate = candidates[j];
        if (candidate.x == dot.x) continue;

        const d = dist(dot.x, dot.y, candidate.x, candidate.y);

        if (d < DIST) {
          candidate.found.push(i);
          push();
          strokeWeight(1);
          stroke(255, 255 / map(d, 0, DIST, 0, 20));
          line(dot.x, dot.y, candidate.x, candidate.y);
          pop();
        }
      }
    }
  }
}

function drawTree(tree) {
  push();
  noFill();
  strokeWeight(1);
  stroke(255, 255 / 10);
  rect(tree.boundary.x - tree.boundary.w, tree.boundary.y - tree.boundary.h, tree.boundary.w * 2, tree.boundary.h * 2);
  pop();

  if (tree.hasDivided) {
    drawTree(tree.tr);
    drawTree(tree.tl);
    drawTree(tree.br);
    drawTree(tree.bl);
  }
}

function mouseClicked() {
  if (mouseButton == LEFT) user = !user;
}

function keyPressed() {
  speed = SPEED * 10;
  freq = FREQ / 10;

  for (let i = 0; i < dots.length; i++) {
    dots[i].speed = speed;
  }
}

function keyReleased() {
  speed = SPEED;
  freq = FREQ;

  for (let i = 0; i < dots.length; i++) {
    dots[i].speed = speed;
  }
}