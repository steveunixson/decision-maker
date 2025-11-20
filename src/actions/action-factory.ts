import { Action } from './base/action.interface';
import { SendSMSAction } from './send-sms.action';
import { SendEmailAction } from './send-email.action';
import { ConditionAction } from './condition.action';
import { LoopAction } from './loop.action';
import { SequenceAction } from './sequence.action';

export class ActionFactory {
  static fromJson(json: any): Action {
    if (!json || typeof json !== 'object') {
      throw new Error('Invalid action JSON');
    }

    switch (json.type) {
      case 'SendSMS':
        return new SendSMSAction(json.phone, json.message);

      case 'SendEmail':
        return new SendEmailAction(
          json.from,
          json.to,
          json.subject,
          json.body,
        );

      case 'Condition':
        return new ConditionAction(
          json.expression,
          json.trueAction ? this.fromJson(json.trueAction) : null,
          json.falseAction ? this.fromJson(json.falseAction) : null,
        );

      case 'Loop':
        return new LoopAction(json.times, this.fromJson(json.action));

      case 'Sequence':
        return new SequenceAction(
          (json.actions ?? []).map((a: any) => this.fromJson(a)),
        );

      default:
        throw new Error(`Unknown action type: ${json.type}`);
    }
  }
}
