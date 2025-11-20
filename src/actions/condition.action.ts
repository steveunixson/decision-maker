import { BaseAction } from './base/base-action';
import { ExecutionContext } from '../execution/execution-context';
import { Action } from './base/action.interface';

export class ConditionAction extends BaseAction {
  constructor(
    public readonly expression: string,
    public readonly trueAction: Action | null,
    public readonly falseAction: Action | null,
  ) {
    super('Condition');
  }

  async execute(ctx: ExecutionContext): Promise<void> {
    // In real life, this should be strongly restricted/sandboxed
    const fn = new Function('ctx', `return (${this.expression});`);
    const result = !!fn(ctx);

    const next = result ? this.trueAction : this.falseAction;
    if (next) {
      await next.execute(ctx);
    }
  }
}
