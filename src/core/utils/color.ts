export enum ColorType {
    HEX,
    DEC,
    RGB,
  }
  export class Color {
    public r = 255;
    public g = 255;
    public b = 255;
    public a = 255;
    private constructor(hexstr: string) {
      if (hexstr == "") {
        return;
      }
      this.r = parseInt("0x" + hexstr[0] + hexstr[1]);
      this.g = parseInt("0x" + hexstr[2] + hexstr[3]);
      this.b = parseInt("0x" + hexstr[4] + hexstr[5]);
      if (hexstr[6] !== undefined) {
        this.a = parseInt("0x" + hexstr[6] + hexstr[7]);
      }
      this.r == NaN ? 255 : this.r;
      this.g == NaN ? 255 : this.g;
      this.b == NaN ? 255 : this.b;
      this.a == NaN ? 255 : this.a;
    }
    public toString(type: ColorType = ColorType.RGB, withAlpha: boolean = false) {
      switch (type) {
        case ColorType.DEC:
          return parseInt(
            "0x" + this.r.toString(16) + this.g.toString(16) + this.b.toString(16) + withAlpha ? this.a.toString(16) : ""
          );
        case ColorType.HEX:
          return this.r.toString(16) + this.g.toString(16) + this.b.toString(16) + withAlpha ? this.a.toString(16) : "";
        case ColorType.RGB:
        default:
          return `${withAlpha ? "RGBA" : "RGB"}(${this.r},${this.g},${this.b}${withAlpha ? "," + this.a / 255 : ""})`;
      }
    }
    public static getInstanceFromHEX(hexstr: string) {
      hexstr = hexstr.replace("#", "");
      let d = hexstr.length;
      for (let i = 0; i < 6 - d; i++) {
        hexstr = "0" + hexstr;
      }
      if (hexstr.length == 7) {
        hexstr = "0" + hexstr;
      }
      return new Color(hexstr);
    }
    public static getInstanceFromDEC(d: number) {
      return this.getInstanceFromHEX(d.toString(16));
    }
    public static getInstanceFromRGB(r: number, g: number, b: number, a?: number) {
      let instance = new Color("");
      instance.r = r != undefined ? r : 255;
      instance.g = g != undefined ? g : 255;
      instance.b = b != undefined ? b : 255;
      instance.a = a != undefined ? a : 255;
      return instance;
    }
  }
  