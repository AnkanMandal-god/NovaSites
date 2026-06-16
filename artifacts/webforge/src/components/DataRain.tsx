import { useEffect, useRef } from "react";

const CHARS =
  "ABCDEF0123456789_*/\\#@!?><|~^abcdef0123456789//A4C9FF00E5B8D3";

export function DataRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const FONT_SIZE = 13;
    const TRAIL = 8;       // characters in the fading tail
    const GLOBAL_ALPHA = 0.07;

    type Column = {
      x: number;
      y: number;           // current lead y in px
      speed: number;       // px per frame
      chars: string[];     // ring buffer of TRAIL chars
      head: number;        // ring buffer index
    };

    let cols: Column[] = [];
    let raf: number;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      build();
    }

    function randChar() {
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    }

    function build() {
      const numCols = Math.floor(canvas!.width / (FONT_SIZE * 1.6));
      cols = Array.from({ length: numCols }, (_, i) => ({
        x: i * FONT_SIZE * 1.6 + FONT_SIZE * 0.3,
        y: -Math.random() * canvas!.height,
        speed: 0.6 + Math.random() * 1.1,
        chars: Array.from({ length: TRAIL }, randChar),
        head: 0,
      }));
    }

    function draw() {
      if (!ctx || !canvas) return;

      // Clear with full transparency (no persistent fade trail — we paint manually)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.globalAlpha = GLOBAL_ALPHA;
      ctx.font = `${FONT_SIZE}px "Courier New", Courier, monospace`;
      ctx.textBaseline = "top";

      for (const col of cols) {
        // Advance lead
        col.y += col.speed;

        // Reset when the full trail exits the bottom
        if (col.y - TRAIL * FONT_SIZE > canvas.height) {
          col.y = -FONT_SIZE * 2;
          col.chars = Array.from({ length: TRAIL }, randChar);
          col.head = 0;
        }

        // Randomly mutate head character for live "typing" feel
        if (Math.random() < 0.08) {
          col.chars[col.head] = randChar();
        }

        // Draw trail — index 0 is the lead, TRAIL-1 is the oldest
        for (let t = 0; t < TRAIL; t++) {
          const charIdx = (col.head - t + TRAIL) % TRAIL;
          const ch = col.chars[charIdx];
          const py = col.y - t * FONT_SIZE;

          if (py < -FONT_SIZE || py > canvas.height) continue;

          // Alpha fades from 1 (lead) to ~0 (tail)
          const a = t === 0 ? 1 : Math.max(0, 1 - t / (TRAIL - 1));
          ctx.globalAlpha = GLOBAL_ALPHA * a;

          // Lead char is bright white; trail chars are off-white
          ctx.fillStyle = t === 0 ? "#ffffff" : "rgba(255,255,255,0.9)";
          ctx.fillText(ch, col.x, py);
        }

        // Advance ring buffer head so next frame shows a new char at the top
        if (Math.random() < col.speed * 0.15) {
          col.head = (col.head + 1) % TRAIL;
          col.chars[col.head] = randChar();
        }
      }

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
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
