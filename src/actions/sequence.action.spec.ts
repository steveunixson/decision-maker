import { SequenceAction } from './sequence.action';
import { SendSMSAction } from './send-sms.action';
import { SendEmailAction } from './send-email.action';
import { ExecutionContext } from '../execution/execution-context';
import { Logger } from '@nestjs/common';

describe('SequenceAction', () => {
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
  });

  afterEach(() => {
    loggerSpy.mockRestore();
  });

  it('should be defined', () => {
    const actions = [
      new SendSMSAction('+1234567890', 'Message 1'),
      new SendEmailAction('from@test.com', 'to@test.com', 'Subject', 'Body'),
    ];
    const sequenceAction = new SequenceAction(actions);

    expect(sequenceAction).toBeDefined();
    expect(sequenceAction.type).toBe('Sequence');
    expect(sequenceAction.actions).toHaveLength(2);
  });

  it('should execute all actions in sequence', async () => {
    const smsAction = new SendSMSAction('+1234567890', 'SMS message');
    const emailAction = new SendEmailAction(
      'from@test.com',
      'to@test.com',
      'Subject',
      'Body',
    );
    const sequenceAction = new SequenceAction([smsAction, emailAction]);
    const ctx: ExecutionContext = {};

    await sequenceAction.execute(ctx);

    expect(loggerSpy).toHaveBeenCalledTimes(2);
    expect(loggerSpy).toHaveBeenNthCalledWith(1, {
      phone: '+1234567890',
      message: 'SMS message',
      ctx,
    });
    expect(loggerSpy).toHaveBeenNthCalledWith(2, {
      from: 'from@test.com',
      to: 'to@test.com',
      subject: 'Subject',
      body: 'Body',
      ctx,
    });
  });

  it('should work with empty actions array', async () => {
    const sequenceAction = new SequenceAction([]);
    const ctx: ExecutionContext = {};

    await sequenceAction.execute(ctx);

    expect(loggerSpy).not.toHaveBeenCalled();
  });

  it('should execute actions in correct order', async () => {
    const action1 = new SendSMSAction('+1', 'First');
    const action2 = new SendSMSAction('+2', 'Second');
    const action3 = new SendSMSAction('+3', 'Third');
    const sequenceAction = new SequenceAction([action1, action2, action3]);
    const ctx: ExecutionContext = {};

    await sequenceAction.execute(ctx);

    expect(loggerSpy).toHaveBeenNthCalledWith(1, {
      phone: '+1',
      message: 'First',
      ctx,
    });
    expect(loggerSpy).toHaveBeenNthCalledWith(2, {
      phone: '+2',
      message: 'Second',
      ctx,
    });
    expect(loggerSpy).toHaveBeenNthCalledWith(3, {
      phone: '+3',
      message: 'Third',
      ctx,
    });
  });
});

