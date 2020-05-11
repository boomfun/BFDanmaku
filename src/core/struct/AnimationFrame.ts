import { Color } from "../utils/color";
import { TransitionType } from "../static/static";

export interface AnimationFrame {
  color: Color;
  scale: {
    x: number;
    y: number;
    z: number;
  };
  rotate: {
    x: number;
    y: number;
    z: number;
  };
  point: {
    x: number;
    y: number;
    z: number;
  };
  transition: TransitionType;
  time: number;
  opacity: number;
}
