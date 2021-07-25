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
  