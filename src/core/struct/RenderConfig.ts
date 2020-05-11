import { Color } from "../utils/color";
import { AnchorType, ContentType } from "../static/static";
import { Filter } from "./Filter";

export interface RenderConfig {
  x: number;
  y: number;
  z: number;
  opacity: number;
  color: Color;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  anchor: AnchorType;
  contentType: ContentType;
  parent?: string;
  //解决部分字体字符中心与contentArea中心偏移问题，margin-top的基数（乘以scale）
  fixTop?: number;
  fontScale: number;
  mask?: string;
  zindex: number;
  size: number;
}

export interface RenderInitConfig {
  size: number;
  anchor: AnchorType;
  font: string;
  bold: boolean;
  stroke: boolean;
  filter: Filter[];
  contentType: ContentType;
  zindex: number;
  //解决Chrome 12px限制，将字体放大再缩小
  fontScale: number;
  bm: number;
}
export const DefaultRenderConfig: RenderConfig = {
  x: 0,
  y: 0,
  z: 0,
  opacity: 1,
  color: Color.getInstanceFromRGB(255, 255, 255, 255),
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  scaleX: 1,
  scaleY: 1,
  scaleZ: 1,
  anchor: AnchorType.middle,
  contentType: ContentType.text,
  fontScale: 1,
  zindex: 0,
  size: 25,
};
