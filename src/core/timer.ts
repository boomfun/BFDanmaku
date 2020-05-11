import { StatusType } from "./static/static";

export class Timer {
  protected time = -1;
  private deltaTime = 0;
  private callback: Function;
  protected status: StatusType;
  public constructor(tickCallback: Function) {
    this.callback = tickCallback;
  }
  private tick(nowTime: number): void {
    if (this.time == -1) {
      this.time = nowTime;
      return;
    }
    this.deltaTime += nowTime - this.time;
    this.time = nowTime;
    this.callback(this.deltaTime);
  }
  private setStatus(status: StatusType): void {
    this.status = status;
    if (status == StatusType.stop) {
      this.time = -1;
    }
  }
  public reset(): void {
    this.time = -1;
    this.deltaTime = 0;
  }
  public setTime(v: number): void {
    this.deltaTime = v;
  }
  public start(): void {
    const cb = (t: number) => {
      if (this.status == StatusType.start) {
        this.tick(t);
        window.requestAnimationFrame(cb);
      }
    };
    window.requestAnimationFrame(cb);
    this.setStatus(StatusType.start);
  }
  public stop(): void {
    this.setStatus(StatusType.stop);
  }
}
