import { Particle } from "./types";
import { PARTICLE_COUNT } from "./constants";
import { useEffect, useRef } from "react";
import Konva from "konva";
import { useThemeMode } from "@/hooks/useThemeMode";

export const useGenerateParticles = () => {
  const { pick } = useThemeMode();
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const particles: Particle[] = Array.from(
      { length: PARTICLE_COUNT },
      () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
      })
    );

    const layer = layerRef.current!;
    particles.forEach((p) => {
      const circle = new Konva.Circle({
        x: p.x,
        y: p.y,
        radius: p.r,
        fill: pick({ light: "#000", dark: "#fff" }),
      });
      p.node = circle;
      layer.add(circle);
    });

    particlesRef.current = particles;
    layer.draw();

    const anim = new Konva.Animation(() => {
      particlesRef.current.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > width) p.dx *= -1;
        if (p.y < 0 || p.y > height) p.dy *= -1;

        p.node!.x(p.x);
        p.node!.y(p.y);
      });
    }, layer);

    anim.start();

    return () => {
      anim.stop();
    };
  }, [pick]);

  return { stageRef, layerRef };
};
