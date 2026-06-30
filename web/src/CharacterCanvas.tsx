import { useEffect, useRef } from "react";

const FRAME_SIZE = 64;
const IDLE_ROW = 10; // walk-down = frente
const IDLE_COL = 0;

type Props = {
  layers: string[];
  size?: number;
};

export function CharacterCanvas({ layers, size = 192 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scale = 3;
  const native = FRAME_SIZE * scale;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const imgs = layers.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, native, native);
      for (const img of imgs) {
        if (img.complete && img.naturalWidth > 0) {
          ctx.drawImage(
            img,
            IDLE_COL * FRAME_SIZE,
            IDLE_ROW * FRAME_SIZE,
            FRAME_SIZE,
            FRAME_SIZE,
            0,
            0,
            native,
            native,
          );
        }
      }
    }

    let pending = imgs.length;
    if (pending === 0) return;

    imgs.forEach((img) => {
      const done = () => {
        pending--;
        draw();
      };
      if (img.complete) done();
      else {
        img.onload = done;
        img.onerror = done;
      }
    });
  }, [layers, native]);

  return (
    <canvas
      ref={canvasRef}
      width={native}
      height={native}
      style={{ width: size, height: size, imageRendering: "pixelated" }}
    />
  );
}
