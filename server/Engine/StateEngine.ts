import { TStateOptions, TStatus } from "./types";

const initOptions = {
  maxPoints: 3,
} as TStateOptions;

export default class StateEngine {
  private status: TStatus = "WAITING";

  private options: TStateOptions = initOptions;
  private stack: string[] = [];
}
