import { Color } from "../utils/color";
export enum FilterType {
  TextShadow,
  blur,
}
export interface Filter {
  type: FilterType;
}
//type = 0时
export interface TextShadowFilter extends Filter {
  color: Color;
  offsetX: number;
  offsetY: number;
  blur: number;
  knockout?: boolean;
  onlyShadow?: boolean;
}
//type = 1时
export interface BlurFilter extends Filter {
  blur: number;
}
