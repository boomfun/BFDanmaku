import { RenderEngine } from "./render";
import { DanmakuObject } from "./object";
import { Log } from "./utils/log";
import { DanmakuConfig } from "./struct/DanmakuConfig";
interface TimeTableSecond {
  [key: string]: TimeTableMillisecond;
}
interface TimeTableMillisecond {
  [key: string]: Array<DanmakuObject>;
}
export class DanmakuPool {
  private timeTable: TimeTableSecond = {};
  private secondTime: Array<string> = [];
  private renderEngine: RenderEngine;
  public constructor() {}
  public bindRenderEngine(renderEngine: RenderEngine) {
    this.renderEngine = renderEngine;
  }
  public searchRange(min: number, max: number): Array<DanmakuObject> {
    let res: Array<DanmakuObject> = [];
    const minSecond: number = Math.floor(min / 1000);
    const minMillisecond: number = min % 1000;
    const maxSecond: number = Math.floor(max / 1000);
    const maxMillisecond: number = max % 1000;
    for (let i = 0; i < this.secondTime.length; i++) {
      const element = Number(this.secondTime[i]);
      if (element >= minSecond && element <= maxSecond) {
        let msarr = Object.keys(this.timeTable[element + ""]);
        for (let t = 0; t < msarr.length; t++) {
          const ms = Number(msarr[t]);
          if ((!(element == minSecond) || ms >= minMillisecond) && (!(element == maxSecond) || ms <= maxMillisecond)) {
            for (let n = 0; n < this.timeTable[element + ""][ms + ""].length; n++) {
              res.push(this.timeTable[element + ""][ms + ""][n]);
            }
          }
        }
      } else if (element > maxSecond) {
        break;
      }
    }
    return res;
  }
  public push(danmaku: DanmakuConfig): DanmakuObject {
    if (this.renderEngine === undefined) {
      Log.error("DanmakuPool require binding DanmakuStage before using it.");
      return;
    }
    const o: DanmakuObject = new DanmakuObject(danmaku, this.renderEngine);
    const second: string = "" + Math.floor(danmaku.startTime / 1000);
    const millisecond: string = "" + (danmaku.startTime % 1000);
    if (!this.timeTable[second]) {
      this.timeTable[second] = {};
      this.insertSecond(second);
    }
    if (!this.timeTable[second][millisecond]) {
      this.timeTable[second][millisecond] = [];
    }
    this.timeTable[second][millisecond].push(o);
    return o;
  }
  private insertSecond(second: string): void {
    for (let i = 0; i < this.secondTime.length; i++) {
      const element = this.secondTime[i];
      if (Number(element) > Number(second)) {
        this.secondTime.splice(i, 0, second);
        return;
      }
    }
    this.secondTime.push(second);
  }
}
