import { Test, TestingModule } from '@nestjs/testing';
import { DecisionService } from './decision.service';
import { Logger } from '@nestjs/common';
import { ExecuteDecisionTreeDto } from '../../dto/execute-decision-tree.dto';

describe('DecisionService', () => {
  let service: DecisionService;
  let loggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DecisionService],
    }).compile();

    service = module.get<DecisionService>(DecisionService);
    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
  });

  afterEach(() => {
    loggerSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Christmas Greeting example', () => {
    it('should send SMS when date matches Christmas', async () => {
      const dto: ExecuteDecisionTreeDto = {
        tree: {
          type: 'Condition',
          expression: 'ctx.date == "1.1.2025"',
          trueAction: {
            type: 'SendSMS',
            phone: '+1234567890',
            message: 'Happy Christmas',
          },
          falseAction: null,
        },
        context: {
          date: '1.1.2025',
        },
      };

      await service.executeTree(dto);

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          phone: '+1234567890',
          message: 'Happy Christmas',
        }),
      );
    });

    it('should not send SMS when date does not match', async () => {
      const dto: ExecuteDecisionTreeDto = {
        tree: {
          type: 'Condition',
          expression: 'ctx.date == "1.1.2025"',
          trueAction: {
            type: 'SendSMS',
            phone: '+1234567890',
            message: 'Happy Christmas',
          },
          falseAction: null,
        },
        context: {
          date: '2.1.2025',
        },
      };

      await service.executeTree(dto);

      // Should not log SMS
      const smsCalls = loggerSpy.mock.calls.filter((call) =>
        call[0]?.message?.includes('Happy Christmas'),
      );
      expect(smsCalls).toHaveLength(0);
    });
  });

  describe('Chained Actions example', () => {
    it('should execute Send Email → Send SMS → Send another Email in sequence', async () => {
      const dto: ExecuteDecisionTreeDto = {
        tree: {
          type: 'Sequence',
          actions: [
            {
              type: 'SendEmail',
              from: 'sender1@test.com',
              to: 'receiver1@test.com',
              subject: 'First Email',
              body: 'First email body',
            },
            {
              type: 'SendSMS',
              phone: '+1234567890',
              message: 'SMS message',
            },
            {
              type: 'SendEmail',
              from: 'sender2@test.com',
              to: 'receiver2@test.com',
              subject: 'Second Email',
              body: 'Second email body',
            },
          ],
        },
      };

      await service.executeTree(dto);

      // Filter out service logs (Starting/Finished) and get only action logs
      const actionCalls = loggerSpy.mock.calls.filter(
        (call) =>
          call[0]?.from || call[0]?.phone || call[0]?.to || call[0]?.message,
      );

      expect(actionCalls).toHaveLength(3);
      expect(actionCalls[0]).toEqual([
        expect.objectContaining({
          from: 'sender1@test.com',
          to: 'receiver1@test.com',
          subject: 'First Email',
        }),
      ]);
      expect(actionCalls[1]).toEqual([
        expect.objectContaining({
          phone: '+1234567890',
          message: 'SMS message',
        }),
      ]);
      expect(actionCalls[2]).toEqual([
        expect.objectContaining({
          from: 'sender2@test.com',
          to: 'receiver2@test.com',
          subject: 'Second Email',
        }),
      ]);
    });
  });

  describe('Send 10 optional emails example', () => {
    it('should repeat 10 times: check condition and send SMS if true', async () => {
      const dto: ExecuteDecisionTreeDto = {
        tree: {
          type: 'Loop',
          times: 10,
          action: {
            type: 'Condition',
            expression: 'ctx.variables.shouldSend',
            trueAction: {
              type: 'SendSMS',
              phone: '+1234567890',
              message: 'Optional SMS',
            },
            falseAction: null,
          },
        },
        context: {
          variables: {
            shouldSend: true,
          },
        },
      };

      await service.executeTree(dto);

      // Should send SMS 10 times
      const smsCalls = loggerSpy.mock.calls.filter((call) =>
        call[0]?.message?.includes('Optional SMS'),
      );
      expect(smsCalls).toHaveLength(10);
    });

    it('should not send SMS when condition is false', async () => {
      const dto: ExecuteDecisionTreeDto = {
        tree: {
          type: 'Loop',
          times: 10,
          action: {
            type: 'Condition',
            expression: 'ctx.variables.shouldSend',
            trueAction: {
              type: 'SendSMS',
              phone: '+1234567890',
              message: 'Optional SMS',
            },
            falseAction: null,
          },
        },
        context: {
          variables: {
            shouldSend: false,
          },
        },
      };

      await service.executeTree(dto);

      // Should not send SMS
      const smsCalls = loggerSpy.mock.calls.filter((call) =>
        call[0]?.message?.includes('Optional SMS'),
      );
      expect(smsCalls).toHaveLength(0);
    });
  });

  describe('Complex scenarios', () => {
    it('should handle nested conditions', async () => {
      const dto: ExecuteDecisionTreeDto = {
        tree: {
          type: 'Condition',
          expression: 'ctx.variables.age >= 18',
          trueAction: {
            type: 'Condition',
            expression: 'ctx.variables.hasLicense',
            trueAction: {
              type: 'SendSMS',
              phone: '+1234567890',
              message: 'Approved',
            },
            falseAction: {
              type: 'SendSMS',
              phone: '+1234567890',
              message: 'No license',
            },
          },
          falseAction: {
            type: 'SendSMS',
            phone: '+1234567890',
            message: 'Too young',
          },
        },
        context: {
          variables: {
            age: 25,
            hasLicense: true,
          },
        },
      };

      await service.executeTree(dto);

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Approved',
        }),
      );
    });

    it('should handle loop with sequence', async () => {
      const dto: ExecuteDecisionTreeDto = {
        tree: {
          type: 'Loop',
          times: 2,
          action: {
            type: 'Sequence',
            actions: [
              {
                type: 'SendSMS',
                phone: '+1234567890',
                message: 'First',
              },
              {
                type: 'SendSMS',
                phone: '+1234567890',
                message: 'Second',
              },
            ],
          },
        },
      };

      await service.executeTree(dto);

      // Should execute 2 * 2 = 4 actions
      const smsCalls = loggerSpy.mock.calls.filter((call) => call[0]?.phone);
      expect(smsCalls.length).toBeGreaterThanOrEqual(4);
    });
  });
});
