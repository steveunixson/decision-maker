import { BaseAction } from './base/base-action';
import { ExecutionContext } from '../execution/execution-context';
import { Action } from './base/action.interface';

export class SequenceAction extends BaseAction {
  constructor(public readonly actions: Action[]) {
    super('Sequence');
  }

  async execute(ctx: ExecutionContext): Promise<void> {
    for (const action of this.actions) {
      await action.execute(ctx);
    }
  }
}
