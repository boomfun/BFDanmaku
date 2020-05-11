import { TransitionType } from "../static/static";
import { Log } from "./log";

/**
 * 缓动函数类
 *
 * @export
 * @class Easing
 */
// const S = 1.70158;
export class Easing {
  public static getEasingFunc(type: TransitionType) {
    switch (type) {
      case TransitionType.none:
        return Easing.none;
      case TransitionType.linear:
        return Easing.linear;
      case TransitionType.easeOutBack:
        return Easing.easeOutBack;
      case TransitionType.easeInBack:
        return Easing.easeInBack;
      case TransitionType.easeInOutBack:
        return Easing.easeInOutBack;
      case TransitionType.easeOutBounce:
        return Easing.easeOutBounce;
      case TransitionType.easeInBounce:
        return Easing.easeInBack;
      case TransitionType.easeInOutBounce:
        return Easing.easeInOutBounce;

      case TransitionType.easeInQuad:
        return Easing.easeInQuad;
      case TransitionType.easeOutQuad:
        return Easing.easeOutQuad;
      case TransitionType.easeInOutQuad:
        return Easing.easeInOutQuad;

      case TransitionType.easeOutCubic:
        return Easing.easeOutCubic;
      case TransitionType.easeInCubic:
        return Easing.easeInCubic;
      case TransitionType.easeInOutCubic:
        return Easing.easeInOutCubic;

      case TransitionType.easeOutQuart:
        return Easing.easeOutQuart;
      case TransitionType.easeInQuart:
        return Easing.easeInQuart;
      case TransitionType.easeInOutQuart:
        return Easing.easeInOutQuart;

      case TransitionType.easeOutQuint:
        return Easing.easeOutQuint;
      case TransitionType.easeInQuint:
        return Easing.easeInQuint;
      case TransitionType.easeInOutQuint:
        return Easing.easeInOutQuint;

      case TransitionType.easeOutExpo:
        return Easing.easeOutExpo;
      case TransitionType.easeInExpo:
        return Easing.easeInExpo;
      case TransitionType.easeInOutExpo:
        return Easing.easeInOutExpo;

      case TransitionType.easeOutCirc:
        return Easing.easeOutCirc;
      case TransitionType.easeInCirc:
        return Easing.easeInCirc;
      case TransitionType.easeInOutCirc:
        return Easing.easeInOutCirc;

      case TransitionType.easeOutElastic:
        return Easing.easeOutElastic;
      case TransitionType.easeInElastic:
        return Easing.easeInElastic;
      case TransitionType.easeInOutElastic:
        return Easing.easeInOutElastic;

      default:
        Log.warn("Unexpected easing function type:" + type);
        return Easing.linear;
    }
  }
  public static none(currentTime: number, value: number, duration: number) {
    return value;
  }
  public static linear(currentTime: number, value: number, duration: number) {
    return Tween.Linear(currentTime, 0, value, duration);
  }

  public static easeInBack(currentTime: number, value: number, duration: number) {
    return Tween.Back.easeIn(currentTime, 0, value, duration, undefined);
  }
  public static easeOutBack(currentTime: number, value: number, duration: number) {
    return Tween.Back.easeOut(currentTime, 0, value, duration, undefined);
  }
  public static easeInOutBack(currentTime: number, value: number, duration: number) {
    return Tween.Back.easeInOut(currentTime, 0, value, duration, undefined);
  }

  public static easeInBounce(currentTime: number, value: number, duration: number) {
    return Tween.Bounce.easeIn(currentTime, 0, value, duration);
  }
  public static easeOutBounce(currentTime: number, value: number, duration: number) {
    return Tween.Bounce.easeOut(currentTime, 0, value, duration);
  }
  public static easeInOutBounce(currentTime: number, value: number, duration: number) {
    return Tween.Bounce.easeInOut(currentTime, 0, value, duration);
  }

  public static easeInQuad(currentTime: number, value: number, duration: number) {
    return Tween.Quad.easeIn(currentTime, 0, value, duration);
  }
  public static easeOutQuad(currentTime: number, value: number, duration: number) {
    return Tween.Quad.easeOut(currentTime, 0, value, duration);
  }
  public static easeInOutQuad(currentTime: number, value: number, duration: number) {
    return Tween.Quad.easeInOut(currentTime, 0, value, duration);
  }

  public static easeInCubic(currentTime: number, value: number, duration: number) {
    return Tween.Cubic.easeIn(currentTime, 0, value, duration);
  }
  public static easeOutCubic(currentTime: number, value: number, duration: number) {
    return Tween.Cubic.easeOut(currentTime, 0, value, duration);
  }
  public static easeInOutCubic(currentTime: number, value: number, duration: number) {
    return Tween.Cubic.easeInOut(currentTime, 0, value, duration);
  }

  public static easeInQuart(currentTime: number, value: number, duration: number) {
    return Tween.Quart.easeIn(currentTime, 0, value, duration);
  }
  public static easeOutQuart(currentTime: number, value: number, duration: number) {
    return Tween.Quart.easeOut(currentTime, 0, value, duration);
  }
  public static easeInOutQuart(currentTime: number, value: number, duration: number) {
    return Tween.Quart.easeInOut(currentTime, 0, value, duration);
  }

  public static easeInQuint(currentTime: number, value: number, duration: number) {
    return Tween.Quint.easeIn(currentTime, 0, value, duration);
  }
  public static easeOutQuint(currentTime: number, value: number, duration: number) {
    return Tween.Quint.easeOut(currentTime, 0, value, duration);
  }
  public static easeInOutQuint(currentTime: number, value: number, duration: number) {
    return Tween.Quint.easeInOut(currentTime, 0, value, duration);
  }

  public static easeInExpo(currentTime: number, value: number, duration: number) {
    return Tween.Expo.easeIn(currentTime, 0, value, duration);
  }
  public static easeOutExpo(currentTime: number, value: number, duration: number) {
    return Tween.Expo.easeOut(currentTime, 0, value, duration);
  }
  public static easeInOutExpo(currentTime: number, value: number, duration: number) {
    return Tween.Expo.easeInOut(currentTime, 0, value, duration);
  }

  public static easeInCirc(currentTime: number, value: number, duration: number) {
    return Tween.Circ.easeIn(currentTime, 0, value, duration);
  }
  public static easeOutCirc(currentTime: number, value: number, duration: number) {
    return Tween.Circ.easeOut(currentTime, 0, value, duration);
  }
  public static easeInOutCirc(currentTime: number, value: number, duration: number) {
    return Tween.Circ.easeInOut(currentTime, 0, value, duration);
  }

  public static easeInElastic(currentTime: number, value: number, duration: number) {
    return Tween.Elastic.easeIn(currentTime, 0, value, duration, undefined, undefined);
  }
  public static easeOutElastic(currentTime: number, value: number, duration: number) {
    return Tween.Elastic.easeOut(currentTime, 0, value, duration, undefined, undefined);
  }
  public static easeInOutElastic(currentTime: number, value: number, duration: number) {
    return Tween.Elastic.easeInOut(currentTime, 0, value, duration, undefined, undefined);
  }
}
/*
 * Tween.js
 * t: current time（当前时间）
 * b: beginning value（初始值）
 * c: change in value（变化量）
 * d: duration（持续时间）
 */
const Tween = {
  Linear: function (t:number, b:number, c:number, d:number) {
    return (c * t) / d + b;
  },
  Quad: {
    easeIn: function (t:number, b:number, c:number, d:number) {
      return c * (t /= d) * t + b;
    },
    easeOut: function (t:number, b:number, c:number, d:number) {
      return -c * (t /= d) * (t - 2) + b;
    },
    easeInOut: function (t:number, b:number, c:number, d:number) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t + b;
      return (-c / 2) * (--t * (t - 2) - 1) + b;
    },
  },
  Cubic: {
    easeIn: function (t:number, b:number, c:number, d:number) {
      return c * (t /= d) * t * t + b;
    },
    easeOut: function (t:number, b:number, c:number, d:number) {
      return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOut: function (t:number, b:number, c:number, d:number) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t * t + b;
      return (c / 2) * ((t -= 2) * t * t + 2) + b;
    },
  },
  Quart: {
    easeIn: function (t:number, b:number, c:number, d:number) {
      return c * (t /= d) * t * t * t + b;
    },
    easeOut: function (t:number, b:number, c:number, d:number) {
      return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOut: function (t:number, b:number, c:number, d:number) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t + b;
      return (-c / 2) * ((t -= 2) * t * t * t - 2) + b;
    },
  },
  Quint: {
    easeIn: function (t:number, b:number, c:number, d:number) {
      return c * (t /= d) * t * t * t * t + b;
    },
    easeOut: function (t:number, b:number, c:number, d:number) {
      return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOut: function (t:number, b:number, c:number, d:number) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t * t + b;
      return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b;
    },
  },
  Sine: {
    easeIn: function (t:number, b:number, c:number, d:number) {
      return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b;
    },
    easeOut: function (t:number, b:number, c:number, d:number) {
      return c * Math.sin((t / d) * (Math.PI / 2)) + b;
    },
    easeInOut: function (t:number, b:number, c:number, d:number) {
      return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b;
    },
  },
  Expo: {
    easeIn: function (t:number, b:number, c:number, d:number) {
      return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeOut: function (t:number, b:number, c:number, d:number) {
      return t == d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
    },
    easeInOut: function (t:number, b:number, c:number, d:number) {
      if (t == 0) return b;
      if (t == d) return b + c;
      if ((t /= d / 2) < 1) return (c / 2) * Math.pow(2, 10 * (t - 1)) + b;
      return (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b;
    },
  },
  Circ: {
    easeIn: function (t:number, b:number, c:number, d:number) {
      return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOut: function (t:number, b:number, c:number, d:number) {
      return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOut: function (t:number, b:number, c:number, d:number) {
      if ((t /= d / 2) < 1) return (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b;
      return (c / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
  },
  Elastic: {
    easeIn: function (t:number, b:number, c:number, d:number, a:number, p:number) {
      var s;
      if (t == 0) return b;
      if ((t /= d) == 1) return b + c;
      if (typeof p == "undefined") p = d * 0.3;
      if (!a || a < Math.abs(c)) {
        s = p / 4;
        a = c;
      } else {
        s = (p / (2 * Math.PI)) * Math.asin(c / a);
      }
      return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t * d - s) * (2 * Math.PI)) / p)) + b;
    },
    easeOut: function (t:number, b:number, c:number, d:number, a:number, p:number) {
      var s;
      if (t == 0) return b;
      if ((t /= d) == 1) return b + c;
      if (typeof p == "undefined") p = d * 0.3;
      if (!a || a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = (p / (2 * Math.PI)) * Math.asin(c / a);
      }
      return a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) + c + b;
    },
    easeInOut: function (t:number, b:number, c:number, d:number, a:number, p:number) {
      var s;
      if (t == 0) return b;
      if ((t /= d / 2) == 2) return b + c;
      if (typeof p == "undefined") p = d * (0.3 * 1.5);
      if (!a || a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = (p / (2 * Math.PI)) * Math.asin(c / a);
      }
      if (t < 1) return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t * d - s) * (2 * Math.PI)) / p)) + b;
      return a * Math.pow(2, -10 * (t -= 1)) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) * 0.5 + c + b;
    },
  },
  Back: {
    easeIn: function (t:number, b:number, c:number, d:number, s:number) {
      if (typeof s == "undefined") s = 1.70158;
      return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOut: function (t:number, b:number, c:number, d:number, s:number) {
      if (typeof s == "undefined") s = 1.70158;
      return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOut: function (t:number, b:number, c:number, d:number, s:number) {
      if (typeof s == "undefined") s = 1.70158;
      if ((t /= d / 2) < 1) return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
      return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
    },
  },
  Bounce: {
    easeIn: function (t:number, b:number, c:number, d:number) {
      return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
    },
    easeOut: function (t:number, b:number, c:number, d:number) {
      if ((t /= d) < 1 / 2.75) {
        return c * (7.5625 * t * t) + b;
      } else if (t < 2 / 2.75) {
        return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
      } else if (t < 2.5 / 2.75) {
        return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
      } else {
        return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
      }
    },
    easeInOut: function (t:number, b:number, c:number, d:number) {
      if (t < d / 2) {
        return Tween.Bounce.easeIn(t * 2, 0, c, d) * 0.5 + b;
      } else {
        return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
      }
    },
  },
};
