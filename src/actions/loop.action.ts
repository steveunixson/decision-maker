import { BaseAction } from './base/base-action';
import { ExecutionContext } from '../execution/execution-context';
import { Action } from './base/action.interface';

export class LoopAction extends BaseAction {
  constructor(
    public readonly times: number,
    public readonly action: Action,
  ) {
    super('Loop');
  }

  async execute(ctx: ExecutionContext): Promise<void> {
    for (let i = 0; i < this.times; i++) {
      await this.action.execute(ctx);
    }
  }
}
