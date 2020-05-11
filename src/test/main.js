import DATA from "./data/data1";
import AcfunParser from "../parser/acfun";
let src = "./video1.mp4";
const video = document.querySelector("video");
video.src = src;
video.addEventListener("loadedmetadata", function () {
  let w = video.videoWidth;
  let h = video.videoHeight;
  let baseWidth;
  if (w == 320) {
    baseWidth = 1360;
  } else if (w == 480) {
    baseWidth = 1200;
  }
  let pool = new DanmakuPool();
  let stage = new DanmakuStage(document.querySelector("#stage"), pool, w, h, {
    dev: true,
    baseWidth,
    performanceMode: true,
  });
  let list = AcfunParser(DATA[1]);
  console.log(list);
  for (const item of list) {
    pool.push(item);
  }
  const elm = document.createElement("button");
  elm.innerHTML = "toggle";
  let isStart = false;
  document.querySelector("body").appendChild(elm);
  video.addEventListener("play", function () {
    stage.fix(video.currentTime * 1000);
    stage.start();
  });
  video.addEventListener("pause", function () {
    stage.stop();
  });
  video.addEventListener("ended", function () {
    stage.stop();
  });
  video.addEventListener("seeked", function () {
    stage.seek(video.currentTime * 1000);
  });
  elm.onclick = () => {
    isStart ? video.pause() : video.play();
    isStart = !isStart;
  };
  document.querySelector("#time_submit").onclick = () => {
    video.currentTime = Number(document.querySelector("#time").value) / 1000;
  };
});
