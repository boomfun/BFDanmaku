import { DanmakuPool } from "./pool";
import { StageConfig, DefaultStageConfig } from "./struct/StageSettings";
import { RenderEngine } from "./render";
import { Log } from "./utils/log";
import { Timer } from "./timer";
import { DanmakuObject } from "./object";
import { StageHooks } from "./struct/StageHooks";

export class DanmakuStage {
  public config: StageConfig = (<any>Object).assign({}, DefaultStageConfig);
  private renderEngine: RenderEngine;
  private pool: DanmakuPool;
  private timer: Timer;
  private stageList: DanmakuObject[] = [];
  private seekTimes = 0;
  private time = 0;
  public constructor(
    stageParent: HTMLElement,
    pool: DanmakuPool,
    videoWidth: number,
    videoHeight: number,
    config?: StageConfig
  ) {
    this.pool = pool;
    if (config) {
      this.config = (<any>Object).assign(config, DefaultStageConfig);
    } else {
      this.config = (<any>Object).assign({}, DefaultStageConfig);
    }
    if (!config.width || !config.height) {
      config.width = stageParent.clientWidth;
      config.height = stageParent.clientHeight;
    }
    if (config.dev) {
      Log.devModeTriggle();
    }
    Log.log("video size：", videoWidth, videoHeight);
    let baseWidth = config.baseWidth ? config.baseWidth : 1280;
    videoHeight = (videoHeight / videoWidth) * baseWidth;
    videoWidth = baseWidth;
    Log.log("render size：", videoWidth, videoHeight);
    this.renderEngine = new RenderEngine(stageParent, videoWidth, videoHeight, config.width, config.height);
    this.renderEngine.opacity(config.opacity);
    this.renderEngine.font(config.font);
    this.timer = new Timer((t: number) => {
      this.tick(t);
    });
    pool.bindRenderEngine(this.renderEngine);
    if (config.performanceMode === false) {
      this.renderEngine.performanceModeTriggle(false);
    }
    this.watchConfig();
  }
  public start() {
    this.timer.start();
  }
  public stop() {
    this.timer.stop();
  }
  public seek(time: number) {
    this.seekTimes++;
    this.fix(time);
  }
  /**
   * 计时器修正，不重新计算样式
   *
   * @param {number} time 毫秒
   * @memberof DanmakuStage
   */
  public fix(time: number) {
    this.timer.setTime(time);
  }
  private watchConfig() {
    for (const key in this.config) {
      let val = this.config[key];
      if (this.config.hasOwnProperty(key)) {
        Object.defineProperty(this.config, key, {
          get: (): number | string | boolean | StageHooks => {
            return val;
          },
          set: (v: number | string | boolean | StageHooks): void => {
            Log.log("Watcher", key, v, val);
            val = v;
            switch (key) {
              case "width":
              case "height":
                this.renderEngine.resize(this.config.width, this.config.height);
                break;
              case "dev":
                Log.devModeTriggle(<boolean>v);
                break;
              case "opacity":
                this.renderEngine.opacity(<number>v);
                break;
              case "font":
                this.renderEngine.font(<string>v);
                break;
              case "font":
                this.renderEngine.performanceModeTriggle(<boolean>v);
                break;
            }
          },
          enumerable: true,
          configurable: true,
        });
      }
    }
  }
  private tick(time: number) {
    if (time < this.time) {
      this.time = time;
      return;
    }
    // Log.log(this.time, time);
    this.config.hooks.beforeTick && this.config.hooks.beforeTick(this.time, time);
    this.renderEngine.beforeTick();
    const arr = this.pool.searchRange(this.time, time);
    // console.log(arr);
    this.stageList.push(...arr);
    for (let i = 0; i < this.stageList.length; i++) {
      const item = this.stageList[i];
      try {
        if (!item.show(time, this.seekTimes)) {
          this.stageList.splice(i--, 1);
        }
      } catch (e) {
        Log.error("tick", this.time, time, e);
      }
    }
    this.time = time;
    this.renderEngine.afterTick();
    this.config.hooks.afterTick && this.config.hooks.afterTick(this.time, time);
  }
}
