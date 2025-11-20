import { BaseAction } from './base/base-action';
import { ExecutionContext } from '../execution/execution-context';

export class SendSMSAction extends BaseAction {
  constructor(
    public readonly phone: string,
    public readonly message: string,
  ) {
    super('SendSMS');
  }

  async execute(ctx: ExecutionContext): Promise<void> {
    console.log('[SendSMS]', { phone: this.phone, message: this.message, ctx });
  }
}
