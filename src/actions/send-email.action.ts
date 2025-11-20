import { BaseAction } from './base/base-action';
import { ExecutionContext } from '../execution/execution-context';

export class SendEmailAction extends BaseAction {
  constructor(
    public readonly from: string,
    public readonly to: string,
    public readonly subject: string,
    public readonly body: string,
  ) {
    super('SendEmail');
  }

  async execute(ctx: ExecutionContext): Promise<void> {
    console.log('[SendEmail]', {
      from: this.from,
      to: this.to,
      subject: this.subject,
      body: this.body,
      ctx,
    });
  }
}
