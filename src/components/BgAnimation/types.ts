import Konva from "konva";

export interface Particle {
  x: number;
  y: number;
  r: number;
  dx: number;
  dy: number;
  node?: Konva.Circle;
}
