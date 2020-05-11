/*!
 * BFDanmaku.js
 * (c) 2020 BoomFun
 * @license MIT
 */
export enum StatusType {
  stop = 0,
  start,
}
export enum ScrollStatus {
  in = 0,
  roll,
  hidden,
}
export enum PoolType {
  video = 0,
  live,
}
export enum DanmakuStatus {
  show,
  hidden,
}
export enum AnchorType {
  leftTop,
  middleTop,
  rightTop,
  leftMiddle,
  middle,
  rightMiddle,
  leftBottom,
  middleBottom,
  rightBottom,
}
export enum TransitionType {
  none,
  linear,
  easeOutBack,
  easeInBack,
  easeInOutBack,

  easeOutBounce,
  easeInBounce,
  easeInOutBounce,

  easeOutQuad,
  easeInQuad,
  easeInOutQuad,

  easeOutCubic,
  easeInCubic,
  easeInOutCubic,

  easeOutQuart,
  easeInQuart,
  easeInOutQuart,

  easeOutQuint,
  easeInQuint,
  easeInOutQuint,

  easeOutExpo,
  easeInExpo,
  easeInOutExpo,

  easeOutCirc,
  easeInCirc,
  easeInOutCirc,

  easeOutElastic,
  easeInElastic,
  easeInOutElastic,
}
export enum ContentType {
  text,
  base64img,
}
/*
<blend-mode> = normal | multiply | screen | overlay | darken | 
lighten | color-dodge | color-burn | hard-light | soft-light | difference | exclusion | hue | saturation | color | luminosity
*/
export enum BlendMode {
  normal,
  multiply,
  screen,
  lighten,
  darken,
  difference,
  overlay,
  hardlight,
  softlight,
  color,
  colordodg,
  colorburn,
  exclusion,
  hue,
  saturation,
  luminosity,
}
