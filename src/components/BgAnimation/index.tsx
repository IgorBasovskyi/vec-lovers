"use client";

import { Stage, Layer } from "react-konva";
import { useGenerateParticles } from "./useGenerateParticles";

const BgAnimation = () => {
  const { stageRef, layerRef } = useGenerateParticles();

  return (
    <Stage
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight}
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
