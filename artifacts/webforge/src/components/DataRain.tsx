import { useEffect, useRef } from "react";

const CHARS = "ABCDEF0123456789_*/\\#|~^//A4C9E500";
const TRAIL_LEN = 10;       /* number of fading chars behind lead */

export function DataRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const FONT_SIZE = 13;
    const COL_GAP   = FONT_SIZE * 4;  /* wide spacing = sparse, individual chars */

    type Column = {
      x: number;
      y: number;            /* lead y position in px */
      speed: number;
      trail: string[];      /* ring-buffer of chars */
      head: number;
      isCyan: boolean;
    };

    let cols: Column[] = [];
    let raf: number;

    function randChar() {
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    }

    function build() {
      const W = canvas!.width;
      const H = canvas!.height;
      const numCols = Math.floor(W / COL_GAP);

      /* Pick exactly 2 cyan columns */
      const cyanSet = new Set<number>();
      while (cyanSet.size < Math.min(2, numCols)) {
        cyanSet.add(Math.floor(Math.random() * numCols));
      }

      cols = Array.from({ length: numCols }, (_, i) => ({
        x:      i * COL_GAP + COL_GAP * 0.4,
        y:      Math.random() * -H * 1.5,
        speed:  0.5 + Math.random() * 1.0,
        trail:  Array.from({ length: TRAIL_LEN }, randChar),
        head:   0,
        isCyan: cyanSet.has(i),
      }));
    }

    function resize() {
      canvas!.width  = window.innerWidth;
      canvas!.height = window.innerHeight;
      build();
    }

    function draw() {
      if (!ctx || !canvas) return;

      /* Full clear every frame — canvas stays transparent, no background fill */
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const maxDist = centerX;

      ctx.font = `${FONT_SIZE}px "Courier New", Courier, monospace`;
      ctx.textBaseline = "top";

      for (const col of cols) {
        col.y += col.speed;

        /* Flicker lead character */
        if (Math.random() < 0.08) {
          col.trail[col.head] = randChar();
        }

        /* Horizontal gradient: transparent at centre, opaque at edges */
        const distFromCenter = Math.abs(col.x - centerX);
        const edgeFactor     = Math.min(distFromCenter / maxDist, 1); /* 0–1 */
        /* Smooth: ease-in so centre is very transparent */
        const horizAlpha = edgeFactor * edgeFactor;  /* 0 at centre → 1 at edge */

        const color = col.isCyan ? "0,229,255" : "255,255,255";

        /* Draw trail: t=0 is lead (brightest), t=TRAIL_LEN-1 is oldest (faintest) */
        for (let t = 0; t < TRAIL_LEN; t++) {
          const charIdx = (col.head - t + TRAIL_LEN) % TRAIL_LEN;
          const ch      = col.trail[charIdx];
          const py      = col.y - t * FONT_SIZE;

          if (py < -FONT_SIZE || py > canvas.height) continue;

          /* Trail fade: lead at 1.0, fades to 0 at tail */
          const trailAlpha = t === 0 ? 1 : Math.max(0, 1 - t / (TRAIL_LEN - 1));
          /* Combined alpha: horizontal edge-fade × trail-fade × global cap */
          const alpha = horizAlpha * trailAlpha * 0.45;

          if (alpha < 0.005) continue;

          ctx.globalAlpha = alpha;
          ctx.fillStyle   = `rgb(${color})`;
          ctx.fillText(ch, col.x, py);
        }

        /* Advance ring buffer occasionally */
        if (Math.random() < col.speed * 0.18) {
          col.head = (col.head + 1) % TRAIL_LEN;
          col.trail[col.head] = randChar();
        }

        /* Reset when trail fully exits bottom */
        if (col.y - TRAIL_LEN * FONT_SIZE > canvas.height) {
          col.y    = -FONT_SIZE * (2 + Math.random() * 10);
          col.speed = 0.5 + Math.random() * 1.0;
        }
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 15,
        pointerEvents: "none",
        /* No opacity here — alpha is controlled per-character above */
      }}
    />
  );
}
