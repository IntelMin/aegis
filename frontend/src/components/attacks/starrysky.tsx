const meteorCount = 12;
const starCount = 100;
const maxSize = 5;
const maxSpeed = 3;
const minSpeed = 0.8;
const color = '#FFFFFF';

interface Position {
  x: number;
  y: number;
}

class Star {
  x: number;
  y: number;
  color: string;
  context: CanvasRenderingContext2D;
  radius: number;
  originalRadius: number;
  maxDuration: number;
  timing: number;
  expanding: boolean;

  constructor(context: CanvasRenderingContext2D) {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.color = color;
    this.context = context;
    this.radius = Math.random() * 1.5;
    this.originalRadius = this.radius;
    this.maxDuration = Math.abs(Math.random() * 200) + 50;
    console.log(this.maxDuration);
    this.timing = 0;
    this.expanding = true;
  }

  update(t: number): void {
    if (!this.expanding) {
      this.radius -= this.originalRadius / this.maxDuration;
      this.timing--;
    } else {
      this.radius += this.originalRadius / this.maxDuration;
      this.timing++;
    }

    if (this.timing === 0) {
      this.expanding = true;
    } else if (this.timing >= this.maxDuration) {
      this.expanding = false;
    }

    this.draw();
  }

  draw(
    x: number = this.x,
    y: number = this.y,
    radius: number = this.radius,
    color: string = this.color
  ): void {
    const c = this.context;
    c.save();
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI * 2, false);
    c.shadowColor = color;
    c.shadowBlur = 10;
    c.shadowOffsetX = 0;
    c.shadowOffsetY = 0;
    c.fillStyle = color;
    c.fill();
    c.closePath();
    c.restore();
  }
}

class Meteorite extends Star {
  originalPosition: Position;
  radius: number;
  speed: number;
  trailLength: number;

  constructor(context: CanvasRenderingContext2D) {
    super(context);
    this.originalPosition = { x: this.x, y: this.y };
    this.radius = Math.random() * maxSize;
    this.speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
    this.trailLength = Math.floor(Math.random() * 25 + 15);
  }

  update(): void {
    if (this.x > window.innerWidth + this.radius + this.trailLength) {
      this.x = -this.radius * 10;
    }

    if (this.y > window.innerHeight + this.radius + this.trailLength) {
      this.y = -this.radius * 10;
    }

    this.draw(this.x, this.y, this.radius * 1.5, 'rgba(255, 255, 255, 0.2)');
    for (let i = 0; i <= this.trailLength; i++) {
      const trailColor = `rgba(255, 255, 255, ${Math.abs(
        1 - i / this.trailLength
      )})`;
      this.draw(
        this.x - i * 2,
        this.y - i * 2,
        this.radius - (i * this.radius) / (this.trailLength * 1.7),
        trailColor
      );
    }

    this.x += this.speed;
    this.y += this.speed * 0.8;
  }
}

class StarrySky {
  private el: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private meteorites: Meteorite[];
  private stars: Star[];
  private t: number;

  constructor(canvas: HTMLCanvasElement) {
    this.el = canvas;
    this.context = this.el.getContext('2d')!;
    this.context.globalCompositeOperation = 'destination-out';

    this.el.width = window.innerWidth;
    this.el.height = window.innerHeight;
    this.t = 0;
    this.meteorites = [];
    this.stars = [];

    this.init();
    this.update();
    this.bind();
  }

  bind() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    this.el.width = window.innerWidth;
    this.el.height = window.innerHeight;
    this.meteorites = [];
    this.stars = [];
    this.init();
  }

  init() {
    for (let i = 0; i < meteorCount; i++) {
      const m = new Meteorite(this.context);
      this.meteorites.push(m);
    }

    for (let i = 0; i < starCount; i++) {
      const s = new Star(this.context);
      this.stars.push(s);
    }
  }

  update() {
    window.requestAnimationFrame(this.update.bind(this));
    this.context.save();
    this.context.clearRect(0, 0, this.el.width, this.el.height);
    this.context.fillStyle = 'rgba(0, 0, 0, 0.15)';
    for (let i = 0; i < this.meteorites.length; i++) {
      this.meteorites[i].update();
    }

    for (let i = 0; i < this.stars.length; i++) {
      this.stars[i].update(this.t);
    }

    this.t += 1 / 60;
  }
}

export default StarrySky;
