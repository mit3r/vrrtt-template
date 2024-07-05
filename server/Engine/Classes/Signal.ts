export enum Signal {
  PROTECT = "PROTECT",
  SHOW = "SHOW",
  REJECT = "REJECT",
  KILL = "KILL",
  SWAP = "SWAP",
  POINT = "POINT",
  LEVEL = "LEVEL",
  FLATTERY = "FLATTERY",
  JOKE = "JOKE",
}

export interface TSignal {
  type: Signal;
  performer: string;
  target1?: string;
  target2?: string;
}
