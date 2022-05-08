const u = 24;

const pad = {
  top: 30,
  left: 30,
};

const tracks: TrackData[] = [
  {
    title: "Markus",
    color: "#4287f5",
    width: 5,
  },
  {
    title: "Electronic music",
    color: "#d9298d",
    width: 3,
  },
  {
    title: "Studie",
    color: "#60bd95",
    width: 5,
  },
];

type TrackData = {
  title: string;
  color: string;
  width: number;
};

export class AppController {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    console.log("construct AppController", canvas);

    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;

    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0px";
    this.canvas.style.right = "0px";
    this.canvas.style.bottom = "0px";
    this.canvas.style.left = "0px";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";

    this.onWindowResize();
    window.addEventListener("resize", this.onWindowResize.bind(this));

    this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
  }

  onWindowResize() {
    const scale = window.devicePixelRatio;

    this.canvas.width = Math.floor(window.innerWidth * scale);
    this.canvas.height = Math.floor(window.innerHeight * scale);

    this.ctx.scale(scale, scale);

    this.draw();
  }

  onMouseMove(e: MouseEvent) {
    console.log("hello");
  }

  draw() {
    let x = pad.left;
    for (let track, i = 0; (track = tracks[i]); i++) {
      this.ctx.fillStyle = track.color;
      this.ctx.fillRect(x, pad.top, track.width * u, u);

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.rect(x, pad.top, track.width * u, u);
      this.ctx.clip();
      this.ctx.fillStyle = "white";
      this.ctx.font = `14px sans-serif`;
      this.ctx.fillText(track.title, x + 4, pad.top + u * 0.7);
      this.ctx.restore();

      x += track.width * u;
    }
  }
}
