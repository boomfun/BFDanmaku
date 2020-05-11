const AcfunParser = (() => {
  let parentList = {};
  let waitForParent = {};
  let waitForMask = {};
  function getContent(o) {
    if (o.w && o.w.g && o.w.g.d) {
      return { type: 1 /* base64img */, content: o.w.g.d };
    } else {
      return { type: 0 /* text */, content: o.n.replace(/\r/g, "\n") };
    }
  }
  function parseBlendMode(bm) {
    if ((bm >= 6 && bm <= 8) || bm >= 11) {
      return 0;
    } else if (bm > 6 && bm < 11) {
      return bm - 3;
    } else {
      if (bm == 1) {
        return 2;
      }
      return bm;
    }
  }
  function getConfig(o) {
    return {
      anchor: o.c != undefined ? +o.c : 0,
      zindex: o.dep ? +o.dep : 0,
      filter: o.w != undefined && o.w.l != undefined ? parseFilter(o.w.l) : undefined,
      bm: o.bm != undefined ? +o.bm : 0,
      word: {
        bold: o.w != undefined && o.w.b != undefined ? o.w.b : false,
        stroke: o.b != undefined ? o.b : false,
        font:
          o.w != undefined && o.w.f != undefined
            ? o.w.f == "微软雅黑" || o.w.f == "Microsoft YaHei"
              ? "微软雅黑"
              : o.w.f
            : undefined,
      },
    };
  }
  function parseFilter(arr) {
    let res = [];
    for (const s of arr) {
      let filter;
      switch (s[0]) {
        case 0:
          filter = {
            type: 1,
            blur: s[1],
          };
          break;
        case 1:
          filter = {
            type: 0,
            color: DanmakuColor.getInstanceFromDEC(s[1]),
            offsetX: 0,
            offsetY: 0,
            blur: s[3],
            knockout: s[8] == true ? true : false,
            onlyShadow: false,
          };
          break;
        case 2:
          filter = {
            type: 0,
            color: DanmakuColor.getInstanceFromDEC(s[3]),
            offsetX: Math.cos((s[2] * Math.PI) / 180) * s[1],
            offsetY: Math.sin((s[2] * Math.PI) / 180) * s[1],
            blur: s[5],
            knockout: s[10] == true ? true : false,
            onlyShadow: s[11] == true ? true : false,
          };
          break;
        default:
          filter = undefined;
      }
      filter && res.push(filter);
    }
    return res.length == 0 ? undefined : res;
  }
  function getAdvanced(o, color) {
    let re = [
      {
        opacity: o.a != undefined ? +o.a : 1,
        time: o.l != undefined ? +o.l * 1000 : 0,
        color: color,
        rotate: {
          x: o.rx != undefined ? -o.rx : 0,
          y: o.k != undefined ? -o.k : 0,
          z: o.r != undefined ? +o.r : 0,
        },
        point: {
          x: o.p != undefined && o.p.x != undefined ? +o.p.x : 0,
          y: o.p != undefined && o.p.y != undefined ? +o.p.y : 0,
          z: o.pz != undefined ? -o.pz : 0,
        },
        scale: {
          x: o.e != undefined ? +o.e : 1,
          y: o.f != undefined ? +o.f : 1,
          z: o.sz != undefined ? +o.sz : 1,
        },
        transition: 0,
      },
    ];
    if (o.z) {
      let last = re[0];
      for (const i of o.z) {
        let f = {
          opacity: i.t != undefined ? +i.t : last.opacity,
          time: i.l * 1000,
          color: i.c != undefined ? DanmakuColor.getInstanceFromDEC(+i.c) : last.color,
          rotate: {
            z: i.d != undefined ? i.d : last.rotate.z,
            y: i.e != undefined ? -i.e : last.rotate.y,
            x: i.rx != undefined ? -i.rx : last.rotate.x,
          },
          scale: {
            y: i.g != undefined ? +i.g : last.scale.y,
            x: i.f != undefined ? +i.f : last.scale.x,
            z: i.sz != undefined ? +i.sz : last.scale.z,
          },
          point: {
            x: i.x != undefined ? +i.x : last.point.x,
            y: i.y != undefined ? +i.y : last.point.y,
            z: i.z != undefined ? -i.z : last.point.z,
          },
          transition: i.v != undefined ? +i.v : 1,
        };
        re.push(f);
        last = f;
      }
    }
    return re;
  }
  function parse(data) {
    parentList = {};
    let res = [];
    for (const item of data) {
      let c = item.c.split(",");
      if (+c[2] !== 7) {
        continue;
      }
      let id = "bf-o_" + Math.ceil(Math.random() * 10000000) + "_" + Math.ceil(Math.random() * 10000000);
      let color = DanmakuColor.getInstanceFromDEC(parseInt(c[1]));
      let advance = JSON.parse(item.m);
      //处理内容
      let content = getContent(advance);
      //获取基础配置
      let conf = getConfig(advance);
      //获取关键帧配置
      let adv = getAdvanced(advance, color);
      //DanmakuConfig
      let o = {
        id: id,
        content: content.content,
        startTime: Math.floor(+c[0] * 1000),
        anchor: conf.anchor,
        word: {
          bold: conf.word.bold,
          stroke: conf.word.stroke,
          font: conf.word.font, //?
          size: +c[3],
        },
        contentType: content.type,
        zindex: conf.zindex,
        filter: conf.filter, //?
        frames: adv,
        bm: parseBlendMode(conf.bm), //?
        user: c[4] + "",
        ts: c[5],
      };
      //获取parent id
      let parent = advance.parent;
      if (parent) {
        if (parentList[parent]) {
          o.parent = parentList[parent];
        } else {
          if (waitForParent[parent]) {
            waitForParent[parent].push(o);
          } else {
            waitForParent[parent] = [o];
          }
        }
      }

      //获取mask id
      let mask = advance.mask;
      if (mask) {
        if (parentList[mask]) {
          o.mask = parentList[mask];
        } else {
          if (waitForMask[mask]) {
            waitForMask[mask].push(o);
          } else {
            waitForMask[mask] = [o];
          }
        }
      }

      if (advance.name) {
        parentList[advance.name] = id;
        let arr = waitForParent[advance.name];
        if (arr) {
          for (const item of arr) {
            item.parent = id;
          }
        }
        arr = waitForMask[advance.name];
        if (arr) {
          for (const item of arr) {
            item.mask = id;
          }
        }
      }
      res.push(o);
    }
    return res;
  }
  return parse;
})();
export default AcfunParser;
