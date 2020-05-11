import { DanmakuConfig } from "./struct/DanmakuConfig";
import { RenderConfig, RenderInitConfig, DefaultRenderConfig } from "./struct/RenderConfig";
import { ContentType } from "./static/static";
import { Easing } from "./utils/easing";
import { AnimationFrame } from "./struct/AnimationFrame";
import { Color } from "./utils/color";
import { RenderEngine } from "./render";

export class DanmakuObject {
  private config: DanmakuConfig;
  private renderConfig: RenderConfig;
  private renderInitConfig: RenderInitConfig;
  private dom: HTMLElement;
  private hiddenTime: number;
  private startTime: number;
  private currentCalcTime: number;
  private seekTimes = 0;
  private frameIndex = 0;
  private needRendering = false;
  private renderEngine: RenderEngine;
  private enable: boolean = true;
  public constructor(config: DanmakuConfig, renderEngine: RenderEngine) {
    this.config = config;
    this.renderEngine = renderEngine;
    this.init();
  }
  public show(currentTime: number, seekTimes: number) {
    if (!this.enable) {
      return false;
    }
    if (currentTime > this.hiddenTime || currentTime < this.startTime) {
      this.seekTimes = seekTimes;
      this.needRendering = false;
      this.renderEngine.remove(this.dom);
      this.reloadRenderConfig();
      return false;
    }
    if (this.seekTimes !== seekTimes && this.needRendering) {
      this.reloadRenderConfig();
    } else {
      this.needRendering = true;
    }
    this.seekTimes = seekTimes;
    this.calculate(currentTime);
    // if (this.config.content == "\r\n●") {
    //   console.log(this.renderConfig);
    // }
    this.renderEngine.draw(this.renderConfig, this.dom);
    return true;
  }
  public enableTriggle(status: boolean) {
    this.enable = status !== undefined ? status : !this.enable;
  }
  private calculate(currentTime: number) {
    let deltaTime = currentTime - this.startTime;
    if (deltaTime <= 0) {
      return;
    }
    let before = this.config.frames[this.frameIndex == 0 ? 0 : this.frameIndex - 1];
    for (let i = this.frameIndex; i < this.config.frames.length; i++) {
      const frame = this.config.frames[i];
      if (this.currentCalcTime + frame.time <= deltaTime) {
        this.currentCalcTime += frame.time;
        this.setFrameStyleEqual(frame);
        before = frame;
        continue;
      }
      this.frameIndex = i;
      // console.log(this.frameIndex,before, frame, deltaTime - this.currentCalcTime);
      this.setFrameStyle(before, frame, deltaTime - this.currentCalcTime, frame.time);
      break;
    }
  }
  private setFrameStyle(before: AnimationFrame, after: AnimationFrame, currentTime: number, duration: number) {
    let easing = Easing.getEasingFunc(after.transition);
    this.renderConfig.x = this.diff(before.point.x, after.point.x, easing, currentTime, duration);
    this.renderConfig.y = this.diff(before.point.y, after.point.y, easing, currentTime, duration);
    this.renderConfig.z = this.diff(before.point.z, after.point.z, easing, currentTime, duration);
    this.diffColor(this.renderConfig.color, easing, before.color, after.color, currentTime, duration);
    this.renderConfig.opacity = this.diff(before.opacity, after.opacity, easing, currentTime, duration);
    this.renderConfig.rotateX = this.diff(before.rotate.x, after.rotate.x, easing, currentTime, duration);
    this.renderConfig.rotateY = this.diff(before.rotate.y, after.rotate.y, easing, currentTime, duration);
    this.renderConfig.rotateZ = this.diff(before.rotate.z, after.rotate.z, easing, currentTime, duration);
    this.renderConfig.scaleX = this.diff(before.scale.x, after.scale.x, easing, currentTime, duration);
    this.renderConfig.scaleY = this.diff(before.scale.y, after.scale.y, easing, currentTime, duration);
    this.renderConfig.scaleZ = this.diff(before.scale.z, after.scale.z, easing, currentTime, duration);
  }
  private setFrameStyleEqual(frame: AnimationFrame) {
    this.renderConfig.x = frame.point.x;
    this.renderConfig.y = frame.point.y;
    this.renderConfig.z = frame.point.z;
    this.renderConfig.color.a = frame.color.a;
    this.renderConfig.color.r = frame.color.r;
    this.renderConfig.color.g = frame.color.g;
    this.renderConfig.color.b = frame.color.b;
    this.renderConfig.opacity = frame.opacity;
    this.renderConfig.rotateX = frame.rotate.x;
    this.renderConfig.rotateY = frame.rotate.y;
    this.renderConfig.rotateZ = frame.rotate.z;
    this.renderConfig.scaleX = frame.scale.x;
    this.renderConfig.scaleY = frame.scale.y;
    this.renderConfig.scaleZ = frame.scale.z;
  }
  private diff(before: number, after: number, easing: Function, currentTime: number, duration: number) {
    return after == before ? before : before + easing(currentTime, after - before, duration);
  }
  /**
   * 对比颜色差异
   *
   * @private
   * @param {Function} easing 缓动函数
   * @param {Color} before 上一个颜色
   * @param {Color} after 这一个颜色
   * @param {number} percent 片段过渡时间逝去百分比
   * @returns Color
   * @memberof DanmakuObject
   */
  private diffColor(
    nowColor: Color,
    easing: Function,
    before: Color,
    after: Color,
    currentTime: number,
    duration: number
  ) {
    if (before.r == after.r && before.g == after.g && before.b == after.b && before.a == after.a) {
      return;
    }
    let c = nowColor;
    c.r = before.r + easing(currentTime, after.r - before.r, duration);
    c.g = before.g + easing(currentTime, after.g - before.g, duration);
    c.b = before.b + easing(currentTime, after.b - before.b, duration);
    c.a = before.a + easing(currentTime, after.a - before.a, duration);
  }
  /**
   * 配置Object各项参数
   *
   * @private
   * @memberof DanmakuObject
   */
  private init() {
    const conf = this.config;
    this.renderInitConfig = {
      size: conf.word.size,
      anchor: conf.anchor,
      font: conf.word.font,
      bold: conf.word.bold,
      stroke: conf.word.stroke,
      filter: conf.filter,
      contentType: conf.contentType,
      zindex: conf.zindex,
      fontScale: 1,
      bm: conf.bm,
    };
    this.reloadRenderConfig();
    if (this.config.contentType == ContentType.base64img) {
      this.dom = document.createElement("img");
      const img = <HTMLImageElement>this.dom;
      img.src = "data:image/png;base64," + this.config.content;
      (<any>this.dom).content = "image";
    } else {
      let text = conf.content.replace(/\n/g, "<br/>").replace(/ /g, "&nbsp;");
      if (text == "&nbsp;") {
        text = "";
      }
      this.dom = document.createElement("div");
      if (conf.filter) {
        this.dom.setAttribute("data-content", conf.content.replace(/\r\n/g, "\n"));
      }
      this.dom.innerHTML = text;
      (<any>this.dom).content = text;
      this.fixContentAreaOffset(conf.word.font, text);
    }
    this.dom.id = this.config.id;
    this.renderEngine.setInitStyle(this.renderInitConfig, this.dom);
    this.renderConfig.fontScale = this.renderInitConfig.fontScale;
    this.renderConfig.size = this.renderInitConfig.size;
    this.setTimePoint();
    (<any>this.dom).danmakuConfig = conf;
    (<any>this.dom).danmakuRenderConfig = this.renderConfig;
    (<any>this.dom).danmakuRenderInitConfig = this.renderInitConfig;
  }
  /**
   * 渲染配置项重置
   *
   * @private
   * @memberof DanmakuObject
   */
  private reloadRenderConfig() {
    if (this.renderConfig) {
      let fixTop = this.renderConfig.fixTop;
      let fontScale = this.renderConfig.fontScale;
      let size = this.renderConfig.size;
      this.renderConfig = Object.assign({}, DefaultRenderConfig);
      this.renderConfig.fixTop = fixTop;
      this.renderConfig.fontScale = fontScale;
      this.renderConfig.size = size;
      // this.renderEngine.setInitStyle(this.renderInitConfig, this.dom);
    } else {
      this.renderConfig = Object.assign({}, DefaultRenderConfig);
    }
    this.renderConfig.color = Color.getInstanceFromRGB(255, 255, 255, 255);
    this.setFrameStyleEqual(this.config.frames[0]);
    this.renderConfig.anchor = this.config.anchor;
    this.renderConfig.zindex = this.config.zindex;
    this.renderConfig.parent = this.config.parent;
    this.renderConfig.mask = this.config.mask;
    this.renderConfig.contentType = this.config.contentType;
    this.frameIndex = 0;
    this.currentCalcTime = 0;
    // console.log(this.renderConfig);
  }
  /**
   * 修复部分字体字符中心与ContentArea中心不一致
   *
   * @private
   * @param {string} font 字体
   * @param {string} text 内容
   * @memberof DanmakuObject
   */
  private fixContentAreaOffset(font: string, text: string) {
    let isyh = font == "微软雅黑" || font == "Microsoft YaHei";
    if (isyh) {
      if (text == "●" || text == "■") {
        this.renderConfig.fixTop = 0.09;
        return;
      }
      this.renderConfig.fixTop = 0.06;
    }
  }
  /**
   * 设置显示开始时间与隐藏时间
   *
   * @private
   * @memberof DanmakuObject
   */
  private setTimePoint() {
    this.startTime = this.config.startTime;
    let t = 0;
    for (const item of this.config.frames) {
      t += item.time;
    }
    this.hiddenTime = this.startTime + t;
  }
}
