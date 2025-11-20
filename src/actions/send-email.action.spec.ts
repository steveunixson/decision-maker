import { SendEmailAction } from './send-email.action';
import { ExecutionContext } from '../execution/execution-context';
import { Logger } from '@nestjs/common';

describe('SendEmailAction', () => {
  let action: SendEmailAction;
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    action = new SendEmailAction(
      'sender@example.com',
      'receiver@example.com',
      'Test Subject',
      'Test Body',
    );
    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
  });

  afterEach(() => {
    loggerSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(action).toBeDefined();
    expect(action.type).toBe('SendEmail');
    expect(action.from).toBe('sender@example.com');
    expect(action.to).toBe('receiver@example.com');
    expect(action.subject).toBe('Test Subject');
    expect(action.body).toBe('Test Body');
  });

  it('should log email parameters when executed', async () => {
    const ctx: ExecutionContext = {
      date: '2025-01-01',
      variables: { name: 'John' },
    };

    await action.execute(ctx);

    expect(loggerSpy).toHaveBeenCalledWith({
      from: 'sender@example.com',
      to: 'receiver@example.com',
      subject: 'Test Subject',
      body: 'Test Body',
      ctx,
    });
  });

  it('should work with empty context', async () => {
    const ctx: ExecutionContext = {};

    await action.execute(ctx);

    expect(loggerSpy).toHaveBeenCalledWith({
      from: 'sender@example.com',
      to: 'receiver@example.com',
      subject: 'Test Subject',
      body: 'Test Body',
      ctx,
    });
  });
});

