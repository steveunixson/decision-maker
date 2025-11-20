import { ExecutionContext } from '../../execution/execution-context';

export interface Action {
  readonly type: string;
  execute(ctx: ExecutionContext): Promise<void>;
}
