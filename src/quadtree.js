class Boundary {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  contains(point) {
    return (
      point.x >= this.x - this.w && point.x <= this.x + this.w &&
      point.y >= this.y - this.h && point.y <= this.y + this.h
    );
  }

  overlaps(rect) {
    return !(
      rect.x - rect.w > this.x + this.w || rect.x + rect.w < this.x - this.w ||
      rect.y - rect.h > this.y + this.h || rect.y + rect.h < this.y - this.h
    ) 
  }
}

class QuadTree {
  constructor(boundary, capacity) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.hasDivided = false;
  }

  insert(point) {
    if (!this.boundary.contains(point)) return;

    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    }
    else {
      if (!this.hasDivided) this.subdivide();

      if (this.tr.insert(point)) return true;
      if (this.tl.insert(point)) return true;
      if (this.br.insert(point)) return true;
      if (this.bl.insert(point)) return true;
    }
  }

  subdivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w;
    let h = this.boundary.h;

    this.tr = new QuadTree(new Boundary(x + w / 2, y - h / 2, w / 2, h / 2), this.capacity);
    this.tl = new QuadTree(new Boundary(x - w / 2, y - h / 2, w / 2, h / 2), this.capacity);
    this.br = new QuadTree(new Boundary(x + w / 2, y + h / 2, w / 2, h / 2), this.capacity);
    this.bl = new QuadTree(new Boundary(x - w / 2, y + h / 2, w / 2, h / 2), this.capacity);

    this.hasDivided = true;
  }

  query(bound, found = []) {
    if (!this.boundary.overlaps(bound)) return found;
    else {
      for (const p of this.points) {
        if (bound.contains(p)) found.push(p);
      }

      if (this.hasDivided) {
        this.tr.query(bound, found);
        this.tl.query(bound, found);
        this.br.query(bound, found);
        this.bl.query(bound, found);
      }
    }

    return found;
  }
}
