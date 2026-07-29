import { useEffect, useRef } from "react";
import type { Companion as Bicho } from "./data.ts";

type Props = {
  companion: Bicho;
  scale?: number; // pixels de tela por pixel do sprite (o herói na Home usa 2)
};

export function Companion({ companion, scale = 2 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { sheet, frame, row, col } = companion;
  const native = frame * 3;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const img = new Image();
    img.src = `/pets/${sheet}`;
    const draw = () => {
      ctx.clearRect(0, 0, native, native);
      if (img.naturalWidth > 0) {
        ctx.drawImage(img, col * frame, row * frame, frame, frame, 0, 0, native, native);
      }
    };
    if (img.complete) draw();
    else {
      img.onload = draw;
      img.onerror = draw;
    }
  }, [sheet, frame, row, col, native]);

  return (
    <canvas
      ref={canvasRef}
      width={native}
      height={native}
      aria-label={companion.name}
      style={{ width: frame * scale, height: frame * scale, imageRendering: "pixelated" }}
    />
  );
}
