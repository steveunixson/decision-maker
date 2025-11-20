import { Action } from './action.interface';
import { ExecutionContext } from '../../execution/execution-context';

export abstract class BaseAction implements Action {
  constructor(public readonly type: string) {}

  abstract execute(ctx: ExecutionContext): Promise<void>;
}
