"use client";

import { useState, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import { useGenerateParticles } from "./useGenerateParticles";

const BgAnimation = () => {
  const { stageRef, layerRef } = useGenerateParticles();

  // Track window size safely
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Runs only on the client
    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateSize(); // initial size
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  // Don’t render until we know the window size
  if (size.width === 0) return null;

  return (
    <Stage
      ref={stageRef}
      width={size.width}
      height={size.height}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -10,
        pointerEvents: "none",
      }}
    >
      <Layer ref={layerRef} />
    </Stage>
  );
};

export default BgAnimation;
