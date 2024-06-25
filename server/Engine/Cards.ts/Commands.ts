import { SignalType } from "../types";
import { Errors } from "../utils/Errors";

interface Signal {
  type: SignalType;
  performer: string;
  target1?: string;
  target2?: string;
}

function validateCommand(command: Signal): boolean {
  const hasPerformer = command.performer !== undefined;
  const hasTarget1 = command.target1 !== undefined;
  const hasTarget2 = command.target2 !== undefined;

  if (!hasPerformer) return false;

  switch (command.type) {
    case SignalType.PROTECT:
      return true;
    case SignalType.SHOW:
      return hasTarget1;
    case SignalType.REJECT:
      return hasTarget1;
    case SignalType.KILL:
      return hasTarget1;
    case SignalType.SWAP:
      return hasTarget1 && hasTarget2;
    case SignalType.CHANGE:
      return hasTarget1;
    case SignalType.POINT:
      return true;

    default:
      return false;
  }
}

function executeCommands(commands: Signal[]): void {
  for (const command of commands) {
    if (!validateCommand(command)) throw new Error(Errors.CARD_REQUIRES_MORE_PARAMS);
  }

  // Execute commands

  // search for protected
  const protectedPlayers = commands
    .filter((command) => command.type === SignalType.PROTECT)
    .map((command) => command.target1 as string);

  commands = commands.filter((command) => command.type !== SignalType.PROTECT);

  // search for shown
}
