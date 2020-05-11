# BFDanmaku

在 html5 上实现 flash 时代的高级弹幕

# Usage
可参见 test/main.js
```
const VIDEO_WIDTH = video.videoWidth;
const VIDEO_HEIGHT = video.videoHeight;
const STAGE_CONTAINER = document.querySelector("#stage");

let pool = new DanmakuPool();
//stageConfig为StageConfig对象（可选），参见下方
let stage = new DanmakuStage(STAGE_CONTAINER, pool, VIDEO_WIDTH, VIDEO_HEIGHT,stageConfig);

//item为DanmakuConfig对象，参见下方
pool.push(item);
//开始计时器
stage.start();
//跳转到1000ms
stage.seek(1000);
//修正计时器时间（不重新计算样式）
stage.fix(1010);
//停止计时器
stage.stop();
```
# 舞台缩放方式
定义一个X轴缩放倍率``ratioX = width / 1000``  
定义一个Y轴缩放倍率``ratioY = height / 1000``  
定义一个全局缩放倍率``ratioScale = ratioX * ratioY * ratioX``  
x,y坐标：相对于1000，转换到实际坐标如下：``x = x * ratioX; y = y * ratioY``  
scaleX,scaleY：  
如果是父容器，转换规则如下：``scaleX = scaleX; scaleY = scaleY;``  
如果不是父容器，转换规则如下：``scaleX = scaleX * ratioX; scaleY = scaleY * ratioX``  
如果是图片内容，上述计算规则下还得再进行转换：``scaleX = scaleX * ratioScale``  

## 字体contentArea中心与字符中心的偏移问题
一些字体：微软雅黑 字符偏下，BFDanmaku会将其进行向上偏移  
计算方法：  
如果字体为微软雅黑 则``fixTop = 0.06``  
如果字体为微软雅黑且内容为●或者■时，``fixTop = 0.09``  
渲染时设置``margin-top: - ${fixTop * scaleY * fontSize * ratioScale}px``  


# 参数项
## StageConfig

实例化 DanmakuStage 后将对参数进行双向绑定，可直接修改 stageConfig

```
interface StageConfig {
  opacity?: number; //全局透明度0-1，默认1
  font?: string; //全局字体，默认SimHei
  width?: number; //舞台容器宽度，默认为传入STAGE_CONTAINER的宽度
  height?: number;//舞台容器高度，默认为传入STAGE_CONTAINER的高度
  dev?: boolean; //开发模式，默认false
  hooks: StageHooks; //钩子，默认{}
  baseWidth?: number; //视频缩放基本宽度，默认1280
  performanceMode?: boolean; //性能模式：filter会造成卡顿，将在3D启用时关闭filter，默认true
}
//钩子，不要同步执行耗时操作
interface StageHooks {
  beforeTick?: Function; //计时器一次tick前
  afterTick?: Function; //计时器一次tick后
}
```

## DanmakuConfig

弹幕对象可选配置：

```
interface DanmakuConfig {
  id: string; //全局唯一弹幕ID
  content: string; //内容，如果是图片则为base64编码图片：data:image/png;base64,${content}
  startTime: number; //出现时间 ms
  anchor: AnchorType; //锚点位置，参见core/static/static.ts enum AnchorType
  word: {
    bold: boolean; //粗体
    stroke: boolean; //描边
    font?: string; //（可选）字体，不填则为全局默认字体
    size: number; //字体大小，小于12px会自动缩放
  };
  contentType: ContentType; //内容类型，参见core/static/static.ts enum ContentType
  zindex: number; //图层顺序，css的z-index
  filter?: Filter[]; //（可选）滤镜设置，参见core/struct/filter.ts
  frames: AnimationFrame[];  //动作列表
  parent?: string; //（可选）父容器弹幕ID
  bm?: number; //混合模式，参见core/static/static.ts enum BlendMode
}
```

## AnimatiomFrame

动作对象，坐标系同 CSS 坐标系（左手系）

```
interface AnimationFrame {
  color: Color; //颜色，请使用DanmakuColor类，参见下方
  scale: {
    x: number; //缩放X
    y: number; //缩放Y
    z: number; //缩放Z
  };
  rotate: {
    x: number; //旋转X
    y: number; //旋转Y
    z: number; //旋转Z
  };
  point: {
    x: number; //X坐标
    y: number; //Y坐标
    z: number; //Z坐标
  };
  transition: TransitionType; //过渡动画的缓动函数，参见core/static/static.ts enum TransitionType
  time: number; //该动画持续时间，ms
  opacity: number; //透明度 0-1
}
```

## Color

有三种获得 Color 实例化对象的方式:

```
//十进制颜色代码转换
DanmakuColor.getInstanceFromDec(decNumber:number);
//HEX颜色代码转换，可包含透明值
DanmakuColor.getInstanceFromHEX(hexString:string);
//RGBA颜色代码转换,a可选（0-255）
DanmakuColor.getInstanceFromHEX(r: number, g: number, b: number, a?: number);
```

# Parser

目前已经实现 AcFun 高级弹幕转换（c-m 格式），请引用 parser/acfun.js  
将数组作为参数调用 AcfunParser

# License

MIT
