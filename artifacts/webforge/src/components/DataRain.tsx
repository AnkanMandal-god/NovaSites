import { useEffect, useRef } from "react";

const CHARS = "ABCDEF0123456789_*/\\#|~^//A4C9E500";
const TRAIL_LEN = 14;

export function DataRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const FONT_SIZE = 13;
    const COL_GAP   = FONT_SIZE * 3.6;

    type Column = {
      x: number;
      y: number;
      speed: number;
      trail: string[];
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

      /* Exactly 2 cyan columns */
      const cyanSet = new Set<number>();
      while (cyanSet.size < Math.min(2, numCols)) {
        cyanSet.add(Math.floor(Math.random() * numCols));
      }

      cols = Array.from({ length: numCols }, (_, i) => ({
        x:      i * COL_GAP + COL_GAP * 0.4,
        // Seed columns throughout the canvas height so rain is mid-flow on load.
        // A small portion start above the top for visual variety.
        y:      Math.random() < 0.15
                  ? Math.random() * -H * 0.5
                  : Math.random() * H,
        speed:  0.6 + Math.random() * 1.1,
        trail:  Array.from({ length: TRAIL_LEN }, randChar),
        head:   0,
        isCyan: cyanSet.has(i),
      }));
    }

    function syncSize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      canvas!.width  = parent.clientWidth;
      canvas!.height = parent.clientHeight;
      build();
    }

    function draw() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const maxDist = centerX;

      ctx.font = `${FONT_SIZE}px "Courier New", Courier, monospace`;
      ctx.textBaseline = "top";

      for (const col of cols) {
        col.y += col.speed;

        if (Math.random() < 0.08) col.trail[col.head] = randChar();

        /* Edge-to-centre gradient: squared for smooth falloff */
        const distFromCenter = Math.abs(col.x - centerX);
        const edgeFactor     = Math.min(distFromCenter / maxDist, 1);
        const horizAlpha     = edgeFactor * edgeFactor;

        const color = col.isCyan ? "0,229,255" : "255,255,255";

        for (let t = 0; t < TRAIL_LEN; t++) {
          const charIdx = (col.head - t + TRAIL_LEN) % TRAIL_LEN;
          const ch      = col.trail[charIdx];
          const py      = col.y - t * FONT_SIZE;

          if (py < -FONT_SIZE || py > canvas.height) continue;

          /* Lead character bright; trail falls off */
          const trailAlpha = t === 0 ? 1 : Math.max(0, 1 - t / (TRAIL_LEN - 1));
          /* Brighter cap: 0.75 for white, full 1.0 for cyan */
          const brightCap  = col.isCyan ? 1.0 : 0.75;
          const alpha      = horizAlpha * trailAlpha * brightCap;

          if (alpha < 0.005) continue;

          ctx.globalAlpha = alpha;
          ctx.fillStyle   = `rgb(${color})`;
          ctx.fillText(ch, col.x, py);
        }

        if (Math.random() < col.speed * 0.18) {
          col.head = (col.head + 1) % TRAIL_LEN;
          col.trail[col.head] = randChar();
        }

        if (col.y - TRAIL_LEN * FONT_SIZE > canvas.height) {
          col.y    = -FONT_SIZE * (2 + Math.random() * 10);
          col.speed = 0.6 + Math.random() * 1.1;
        }
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(() => syncSize());
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    syncSize();
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 2,           /* behind hero content (z-10) but above section bg */
        pointerEvents: "none",
      }}
    />
  );
}
