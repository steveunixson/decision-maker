import { SendSMSAction } from './send-sms.action';
import { ExecutionContext } from '../execution/execution-context';
import { Logger } from '@nestjs/common';

describe('SendSMSAction', () => {
  let action: SendSMSAction;
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    action = new SendSMSAction('+1234567890', 'Test message');
    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
  });

  afterEach(() => {
    loggerSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(action).toBeDefined();
    expect(action.type).toBe('SendSMS');
    expect(action.phone).toBe('+1234567890');
    expect(action.message).toBe('Test message');
  });

  it('should log SMS parameters when executed', async () => {
    const ctx: ExecutionContext = {
      date: '2025-01-01',
      variables: { name: 'John' },
    };

    await action.execute(ctx);

    expect(loggerSpy).toHaveBeenCalledWith({
      phone: '+1234567890',
      message: 'Test message',
      ctx,
    });
  });

  it('should work with empty context', async () => {
    const ctx: ExecutionContext = {};

    await action.execute(ctx);

    expect(loggerSpy).toHaveBeenCalledWith({
      phone: '+1234567890',
      message: 'Test message',
      ctx,
    });
  });
});

