import { Logger } from '@nestjs/common';
import { BaseAction } from './base/base-action';
import { ExecutionContext } from '../execution/execution-context';

export class SendSMSAction extends BaseAction {
  private static readonly logger = new Logger(SendSMSAction.name);

  constructor(
    public readonly phone: string,
    public readonly message: string,
  ) {
    super('SendSMS');
  }

  async execute(ctx: ExecutionContext): Promise<void> {
    SendSMSAction.logger.log({ phone: this.phone, message: this.message, ctx });
  }
}
