import { AnchorType, ContentType } from "../static/static";
import { AnimationFrame } from "./AnimationFrame";
import { Filter } from "./Filter";

export interface DanmakuConfig {
  id: string;
  content: string;
  startTime: number;
  anchor: AnchorType;
  word: {
    bold: boolean;
    stroke: boolean;
    font?: string;
    size: number;
  };
  contentType: ContentType;
  zindex: number;
  filter?: Filter[];
  frames: AnimationFrame[];
  parent?: string;
  bm?: number;
  mask?: string;
}
