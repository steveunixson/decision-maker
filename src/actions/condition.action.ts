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
    // could be done with expr-eval library though
    const fn = new Function('ctx', `return (${this.expression});`);
    const result = !!fn(ctx);

    // Store the selected decision
    const decision = {
      type: 'Condition',
      expression: this.expression,
      result: result,
      selectedPath: result ? 'true' : 'false',
    };

    ctx.selectedDecision = decision;
    
    // Also store in decisions array for tracking all decisions
    if (!ctx.decisions) {
      ctx.decisions = [];
    }
    ctx.decisions.push(decision);

    const next = result ? this.trueAction : this.falseAction;
    if (next) {
      await next.execute(ctx);
    }
  }
}
