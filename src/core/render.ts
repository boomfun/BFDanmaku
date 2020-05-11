import { RenderConfig, RenderInitConfig } from "./struct/RenderConfig";
import { ContentType, AnchorType, BlendMode } from "./static/static";
import { Color, ColorType } from "./utils/color";
import { Filter, FilterType, TextShadowFilter, BlurFilter } from "./struct/Filter";
import { Log } from "./utils/log";

interface RenderQueueTask {
  dom: HTMLElement;
  style: Array<Array<string | number>>;
  append?: string;
  editZ?: boolean;
}
interface StageElementList {
  [key: string]: HTMLElement;
}
export class RenderEngine {
  private renderQueue: Array<RenderQueueTask>;
  private onStageList: StageElementList = {};
  private stage: HTMLElement;
  private sheet: StyleSheet;
  private ratioX = 1;
  private ratioY = 1;
  private ratioScale = 1;
  private videoWidth: number;
  private videoHeight: number;
  private performanceMode: boolean = true;
  public constructor(
    wrapper: HTMLElement,
    videoWidth: number,
    videoHeight: number,
    stageWidth: number,
    stageHeight: number
  ) {
    this.videoHeight = videoHeight;
    this.videoWidth = videoWidth;
    this.ratioX = videoWidth / 1000;
    this.ratioY = videoHeight / 1000;
    this.ratioScale = this.ratioX * this.ratioY * this.ratioX;
    this.stage = document.createElement("div");
    this.stage.classList.add("bfdanmaku-stage");
    this.stage.style.cssText = `transform:scale(${stageWidth / videoWidth},${
      stageHeight / videoHeight
    });width:${videoWidth}px;height:${videoHeight}px;`;
    wrapper.append(this.stage);

    var style = document.createElement("style");
    style.appendChild(document.createTextNode(""));
    document.head.appendChild(style);
    this.sheet = style.sheet;
    (<any>this.sheet).insertRule(
      `.bfdanmaku-knockout::after {content: attr(data-content);position: absolute;left: 0;top: 0;white-space: pre-line;}`
    );
    (<any>this.sheet).insertRule(
      `.bfdanmaku-knockout,.bfdanmaku-knockout::after {mix-blend-mode: lighten !important;}`
    );
    (<any>this.sheet).insertRule(`.bfdanmaku-knockout{color: black !important;}`);
    (<any>this.sheet).insertRule(
      `.bfdanmaku-stage{transform-origin:left top;position:relative;z-index:0;top:0;left:0;line-height:1;overflow:hidden;}`
    );
    (<any>this.sheet).insertRule(`.bfdanmaku-stage span{display: inline-block;}`);
    (<any>this.sheet).insertRule(
      `.bfdanmaku-nofilter *{filter: none !important;text-shadow: none !important;-webkit-text-stroke: 0 !important;}`
    );
  }
  public resize(width: number, height: number) {
    this.stage.style.transform = `scale(${width / this.videoWidth},${height / this.videoHeight}`;
  }
  public opacity(val: number) {
    this.stage.style.opacity = val + "";
  }
  public font(val: string) {
    this.stage.style.fontFamily = val;
  }
  public performanceModeTriggle(status: boolean) {
    this.performanceMode = status !== undefined ? status : !this.performanceMode;
    this.performanceMode && this.stage.classList.remove("bfdanmaku-nofilter");
  }
  public draw(config: RenderConfig, elm: HTMLElement) {
    let id = elm.id;
    let stageElement = this.onStageList[id];

    let task: RenderQueueTask = {
      dom: elm,
      style: this.setDiffStyle(config, elm),
      editZ: config.z != 0 || config.rotateX != 0 || config.rotateY ? true : false,
    };
    if (stageElement === undefined) {
      this.onStageList[id] = elm;
      if (config.parent) {
        task.append = config.parent;
      } else {
        task.append = "stage";
      }
      if (config.mask && this.onStageList[config.mask]) {
        let mask = this.onStageList[config.mask];
        mask.style.display = "none";
        let mz = +mask.style.zIndex;
        config.zindex = config.zindex < mz ? mz : config.zindex + 1;
        elm.style.zIndex = config.zindex + "";
      }
    }
    this.renderQueue.push(task);
  }
  public beforeTick() {
    this.renderQueue = [];
  }
  public afterTick() {
    this.render();
  }
  public remove(elm: HTMLElement) {
    let id = elm.id;
    elm.remove();
    delete this.onStageList[id];
  }
  public setInitStyle(config: RenderInitConfig, elm: HTMLElement) {
    if (config.contentType == ContentType.text) {
      let fontScale = 1;
      let s = config.size * this.ratioScale;
      while (s < 12) {
        s *= 2;
        fontScale *= 0.5;
      }
      config.size = s;
      config.fontScale = fontScale;
      this.setStyle(["font-size", `${s}px`], elm);
      this.setStyle(["white-space", "nowrap"], elm);
      if (config.bold) {
        this.setStyle(["font-weight", "bold"], elm);
      }
      if (config.stroke) {
        this.setStyle(["text-stroke", "0.3px #a3a3a3"], elm);
        this.setStyle(["-webkit-text-stroke", "0.3px #a3a3a3"], elm);
      }
      if (config.font) {
        this.setStyle(["font-family", config.font], elm);
      }
      if (config.filter) {
        let arr = config.filter;
        for (const item of <Array<Filter>>arr) {
          switch (item.type) {
            case FilterType.TextShadow:
              let t = <TextShadowFilter>item;
              let temp = `${t.color.toString(ColorType.RGB, true)} ${t.offsetX}px ${t.offsetY}px ${t.blur}px`;
              this.setStyle(["text-shadow", temp], elm);
              this.setStyle(["-webkit-text-shadow", temp], elm);
              if (t.knockout) {
                elm.classList.add("bfdanmaku-knockout");
              }
              if (t.onlyShadow) {
                temp = "transparent";
                this.setStyle(["text-fill-color", temp], elm);
                this.setStyle(["-webkit-text-fill-color", temp], elm);
              }
              break;
            case FilterType.blur:
              this.setStyle(["filter", `blur(${(<BlurFilter>item).blur}px)`], elm);
              break;
            default:
              Log.warn("Unexpected filter type:" + item.type);
          }
        }
      }
    }
    this.setStyle(["position", "absolute"], elm);
    this.setStyle(["transform-origin", this.getOrigin(config.anchor)], elm);
    if (config.bm) {
      let bm;
      switch (config.bm) {
        case BlendMode.darken:
          bm = "darken";
          break;
        case BlendMode.difference:
          bm = "difference";
          break;
        case BlendMode.hardlight:
          bm = "hard-light";
          break;
        case BlendMode.lighten:
          bm = "lighten";
          break;
        case BlendMode.multiply:
          bm = "multiply";
          break;
        case BlendMode.overlay:
          bm = "overlay";
          break;
        case BlendMode.screen:
          bm = "screen";
          break;
        case BlendMode.softlight:
          bm = "soft-light";
          break;
        case BlendMode.color:
          bm = "color";
          break;
        case BlendMode.colordodg:
          bm = "color-dodg";
          break;
        case BlendMode.colorburn:
          bm = "color-burn";
          break;
        case BlendMode.exclusion:
          bm = "exclusion";
          break;
        case BlendMode.hue:
          bm = "hue";
          break;
        case BlendMode.saturation:
          bm = "saturation";
          break;
        case BlendMode.luminosity:
          bm = "luminosity";
          break;
        default:
          Log.warn("Unexpected blend mode:" + config.bm);
      }
      if (bm) {
        this.setStyle(["mix-blend-mode", bm], elm);
      }
    }
    this.setStyle(["transform-style", "preserve-3d"], elm);
    this.setStyle(["z-index", config.zindex], elm);
  }
  private setDiffStyle(config: RenderConfig, elm: HTMLElement): Array<Array<string | number>> {
    let res: Array<Array<string | number>> = [];
    let x = config.x * this.ratioX;
    let y = config.y * this.ratioY;
    if (config.parent !== undefined && this.onStageList[config.parent] != undefined) {
      let _x = x > 0 ? "+ " + x : "- " + x * -1;
      let _y = y > 0 ? "+ " + y : "- " + y * -1;
      res.push(["left", `calc(${this.getAlignValue(config.anchor, true)} ${_x}px)`]);
      res.push(["top", `calc(${this.getBaselineValue(config.anchor, true)} ${_y}px)`]);
    } else {
      res.push(["left", `${x}px`]);
      res.push(["top", `${y}px`]);
    }
    let ratioImage = 1;
    if (config.contentType == ContentType.base64img) {
      ratioImage = this.ratioScale;
      config.fontScale = 1;
    }
    let scaleY = config.scaleY * config.fontScale * ratioImage;
    let scaleX = config.scaleX * config.fontScale * ratioImage;
    if (!(<any>elm).isParent) {
      scaleY *= this.ratioX;
      scaleX *= this.ratioX;
    }

    res.push([
      "transform",
      `translate(${this.getAlignValue(config.anchor)},${this.getBaselineValue(config.anchor)}) translateZ(${
        config.z
      }px) rotateX(${config.rotateX}deg) rotateY(${config.rotateY}deg) rotateZ(${
        config.rotateZ
      }deg) scaleX(${scaleX}) scaleY(${scaleY}) scaleZ(${config.scaleZ})`,
    ]);
    res.push(["opacity", config.opacity]);
    res.push(["color", (<Color>config.color).toString(ColorType.RGB, true)]);
    if (config.fixTop) {
      res.push(["margin-top", `-${config.fixTop * scaleY * config.size * this.ratioScale}px`]);
    }
    return res;
  }
  private render() {
    let enablePrespective = false;
    for (const item of this.renderQueue) {
      if (item.editZ && !enablePrespective) {
        enablePrespective = true;
      }
      let dom = item.dom;
      for (const s of item.style) {
        this.setStyle(s, dom);
      }
      if (item.append) {
        if (item.append == "stage") {
          this.stage.append(dom);
        } else {
          let parent = this.onStageList[item.append];
          if (parent) {
            parent.style.display = "block";
            parent.append(dom);
            (<any>parent).isParent = true;
          } else {
            this.stage.append(dom);
          }
        }
      }
    }
    if (enablePrespective) {
      this.stage.style.perspective = "1000px";
      this.performanceMode && this.stage.classList.add("bfdanmaku-nofilter");
    } else {
      this.stage.style.perspective = "unset";
      this.performanceMode && this.stage.classList.remove("bfdanmaku-nofilter");
    }
  }
  private setStyle(item: Array<string | number>, dom: HTMLElement) {
    (<any>dom.style)[item[0]] = item[1];
  }
  private getBaselineValue(type: AnchorType, percent?: boolean) {
    switch (type) {
      case AnchorType.leftBottom:
      case AnchorType.rightBottom:
      case AnchorType.middleBottom:
        return percent ? "100%" : "-100%";
      case AnchorType.middle:
      case AnchorType.leftMiddle:
      case AnchorType.rightMiddle:
        return percent ? "50%" : "-50%";
      default:
        return 0;
    }
  }
  private getAlignValue(type: AnchorType, percent?: boolean) {
    switch (type) {
      case AnchorType.rightBottom:
      case AnchorType.rightMiddle:
      case AnchorType.rightTop:
        return percent ? "100%" : "-100%";
      case AnchorType.middle:
      case AnchorType.middleBottom:
      case AnchorType.middleTop:
        return percent ? "50%" : "-50%";
      default:
        return 0;
    }
  }
  private getOrigin(type: AnchorType) {
    let res = "";
    switch (type) {
      case AnchorType.leftBottom:
      case AnchorType.rightBottom:
      case AnchorType.middleBottom:
        res += "bottom ";
        break;
      case AnchorType.middle:
      case AnchorType.leftMiddle:
      case AnchorType.rightMiddle:
        res += "center ";
        break;
      default:
        res += "top ";
        break;
    }
    switch (type) {
      case AnchorType.rightBottom:
      case AnchorType.rightMiddle:
      case AnchorType.rightTop:
        res += "right";
        break;
      case AnchorType.middle:
      case AnchorType.middleBottom:
      case AnchorType.middleTop:
        res += "center";
        break;
      default:
        res += "left";
        break;
    }
    return res;
  }
}
