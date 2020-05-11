import { DanmakuPool } from "./pool";
import { DanmakuStage } from "./stage";
import { Color } from "./utils/color";
declare global {
  interface Window {
    DanmakuPool: any;
    DanmakuStage: any;
    DanmakuColor: any;
  }
}
window.DanmakuPool = DanmakuPool;
window.DanmakuStage = DanmakuStage;
window.DanmakuColor = Color;
