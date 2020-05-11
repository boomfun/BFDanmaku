import { StageHooks } from "./StageHooks";

export interface StageConfig {
  [key: string]: number | string | boolean | StageHooks;
  opacity?: number;
  font?: string;
  width?: number;
  height?: number;
  dev?: boolean;
  hooks: StageHooks;
  baseWidth?: number;
  performanceMode?: boolean;
}
export const DefaultStageConfig: StageConfig = {
  opacity: 1,
  font: "SimHei",
  hooks: {},
};
