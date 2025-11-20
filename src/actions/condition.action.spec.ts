import { ConditionAction } from './condition.action';
import { SendSMSAction } from './send-sms.action';
import { ExecutionContext } from '../execution/execution-context';

describe('ConditionAction', () => {
  let trueAction: SendSMSAction;
  let falseAction: SendSMSAction;
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    trueAction = new SendSMSAction('+1234567890', 'True message');
    falseAction = new SendSMSAction('+1234567890', 'False message');
    loggerSpy = jest.spyOn(require('@nestjs/common').Logger.prototype, 'log').mockImplementation();
  });

  afterEach(() => {
    loggerSpy.mockRestore();
  });

  it('should be defined', () => {
    const action = new ConditionAction('ctx.variables.x > 5', trueAction, falseAction);
    expect(action).toBeDefined();
    expect(action.type).toBe('Condition');
    expect(action.expression).toBe('ctx.variables.x > 5');
  });

  it('should execute trueAction when condition is true', async () => {
    const action = new ConditionAction('ctx.variables.x > 5', trueAction, falseAction);
    const ctx: ExecutionContext = {
      variables: { x: 10 },
    };

    await action.execute(ctx);

    expect(loggerSpy).toHaveBeenCalledWith({
      phone: '+1234567890',
      message: 'True message',
      ctx,
    });
    expect(loggerSpy).not.toHaveBeenCalledWith({
      phone: '+1234567890',
      message: 'False message',
      ctx,
    });
  });

  it('should execute falseAction when condition is false', async () => {
    const action = new ConditionAction('ctx.variables.x > 5', trueAction, falseAction);
    const ctx: ExecutionContext = {
      variables: { x: 3 },
    };

    await action.execute(ctx);

    expect(loggerSpy).toHaveBeenCalledWith({
      phone: '+1234567890',
      message: 'False message',
      ctx,
    });
    expect(loggerSpy).not.toHaveBeenCalledWith({
      phone: '+1234567890',
      message: 'True message',
      ctx,
    });
  });

  it('should work with date in context', async () => {
    const action = new ConditionAction('ctx.date == "1.1.2025"', trueAction, falseAction);
    const ctx: ExecutionContext = {
      date: '1.1.2025',
    };

    await action.execute(ctx);

    expect(loggerSpy).toHaveBeenCalledWith({
      phone: '+1234567890',
      message: 'True message',
      ctx,
    });
  });

  it('should not execute any action when both are null', async () => {
    const action = new ConditionAction('true', null, null);
    const ctx: ExecutionContext = {};

    await action.execute(ctx);

    expect(loggerSpy).not.toHaveBeenCalled();
  });

  it('should handle complex expressions', async () => {
    const action = new ConditionAction(
      'ctx.variables.age >= 18 && ctx.variables.hasLicense',
      trueAction,
      falseAction,
    );
    const ctx: ExecutionContext = {
      variables: { age: 25, hasLicense: true },
    };

    await action.execute(ctx);

    expect(loggerSpy).toHaveBeenCalledWith({
      phone: '+1234567890',
      message: 'True message',
      ctx,
    });
  });
});

