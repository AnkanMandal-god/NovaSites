import { useEffect, useRef } from "react";

/* Refined charset: hex, symbols, alphanumeric — avoids dense green cliché */
const CHARS =
  "ABCDEF0123456789_*/\\#@!?><|~^abcdef//A4C9FF00E5B8D3 01";

export function DataRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const FONT_SIZE = 14;
    const COL_GAP   = FONT_SIZE * 1.7;   /* horizontal spacing between columns */
    const BG_COLOR   = "18,18,18";        /* #121212 */
    const FADE_ALPHA = 0.06;              /* lower = longer trail */

    type Column = {
      x: number;
      y: number;
      speed: number;
      char: string;
    };

    let cols: Column[] = [];
    let raf: number;

    function randChar() {
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    }

    function build() {
      const numCols = Math.floor(canvas!.width / COL_GAP);
      cols = Array.from({ length: numCols }, (_, i) => ({
        x: i * COL_GAP + COL_GAP * 0.3,
        y: Math.random() * -canvas!.height,   /* stagger start times */
        speed: 0.5 + Math.random() * 1.2,
        char: randChar(),
      }));

      /* Fill with background on resize so old frame doesn't show */
      ctx!.fillStyle = `rgb(${BG_COLOR})`;
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
    }

    function resize() {
      canvas!.width  = window.innerWidth;
      canvas!.height = window.innerHeight;
      build();
    }

    function draw() {
      if (!ctx || !canvas) return;

      /* Semi-transparent overlay → trails naturally fade out each frame */
      ctx.fillStyle = `rgba(${BG_COLOR},${FADE_ALPHA})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${FONT_SIZE}px "Courier New", Courier, monospace`;
      ctx.textBaseline = "top";

      for (const col of cols) {
        col.y += col.speed;

        /* Occasionally swap character for a "live typing" flicker */
        if (Math.random() < 0.1) col.char = randChar();

        /* Bright lead character */
        ctx.globalAlpha = 0.55;
        ctx.fillStyle   = "#ffffff";
        ctx.fillText(col.char, col.x, col.y);

        /* Reset column when it exits the bottom */
        if (col.y > canvas.height + FONT_SIZE * 4) {
          col.y    = -FONT_SIZE * (2 + Math.random() * 10);
          col.char = randChar();
          /* Vary speed on reset for depth */
          col.speed = 0.5 + Math.random() * 1.2;
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
        opacity: 0.55,        /* master opacity — tweak here to taste */
      }}
    />
  );
}
