import { LoopAction } from './loop.action';
import { SendSMSAction } from './send-sms.action';
import { ExecutionContext } from '../execution/execution-context';
import { Logger } from '@nestjs/common';

describe('LoopAction', () => {
  let action: SendSMSAction;
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    action = new SendSMSAction('+1234567890', 'Loop message');
    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
  });

  afterEach(() => {
    loggerSpy.mockRestore();
  });

  it('should be defined', () => {
    const loopAction = new LoopAction(5, action);
    expect(loopAction).toBeDefined();
    expect(loopAction.type).toBe('Loop');
    expect(loopAction.times).toBe(5);
  });

  it('should execute action specified number of times', async () => {
    const loopAction = new LoopAction(3, action);
    const ctx: ExecutionContext = {};

    await loopAction.execute(ctx);

    expect(loggerSpy).toHaveBeenCalledTimes(3);
    expect(loggerSpy).toHaveBeenCalledWith({
      phone: '+1234567890',
      message: 'Loop message',
      ctx,
    });
  });

  it('should not execute when times is 0', async () => {
    const loopAction = new LoopAction(0, action);
    const ctx: ExecutionContext = {};

    await loopAction.execute(ctx);

    expect(loggerSpy).not.toHaveBeenCalled();
  });

  it('should execute once when times is 1', async () => {
    const loopAction = new LoopAction(1, action);
    const ctx: ExecutionContext = {};

    await loopAction.execute(ctx);

    expect(loggerSpy).toHaveBeenCalledTimes(1);
  });

  it('should work with nested actions', async () => {
    const innerAction = new SendSMSAction('+1234567890', 'Inner message');
    const loopAction = new LoopAction(2, innerAction);
    const ctx: ExecutionContext = {};

    await loopAction.execute(ctx);

    expect(loggerSpy).toHaveBeenCalledTimes(2);
  });
});

