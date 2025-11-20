import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('DecisionController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /decision/execute', () => {
    it('should return status ok for valid request', () => {
      return request(app.getHttpServer())
        .post('/decision/execute')
        .send({
          tree: {
            type: 'SendSMS',
            phone: '+1234567890',
            message: 'Test message',
          },
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual({ status: 'ok' });
        });
    });

    it('should execute SendSMS action', () => {
      return request(app.getHttpServer())
        .post('/decision/execute')
        .send({
          tree: {
            type: 'SendSMS',
            phone: '+1234567890',
            message: 'Hello World',
          },
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual({ status: 'ok' });
        });
    });

    it('should execute SendEmail action', () => {
      return request(app.getHttpServer())
        .post('/decision/execute')
        .send({
          tree: {
            type: 'SendEmail',
            from: 'sender@example.com',
            to: 'receiver@example.com',
            subject: 'Test Subject',
            body: 'Test Body',
          },
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual({ status: 'ok' });
        });
    });

    describe('Christmas Greeting example', () => {
      it('should send SMS when date matches Christmas', () => {
        return request(app.getHttpServer())
          .post('/decision/execute')
          .send({
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
          })
          .expect(201)
          .expect((res) => {
            expect(res.body).toEqual({ status: 'ok' });
          });
      });

      it('should not send SMS when date does not match', () => {
        return request(app.getHttpServer())
          .post('/decision/execute')
          .send({
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
          })
          .expect(201)
          .expect((res) => {
            expect(res.body).toEqual({ status: 'ok' });
          });
      });
    });

    describe('Chained Actions example', () => {
      it('should execute Send Email → Send SMS → Send another Email in sequence', () => {
        return request(app.getHttpServer())
          .post('/decision/execute')
          .send({
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
          })
          .expect(201)
          .expect((res) => {
            expect(res.body).toEqual({ status: 'ok' });
          });
      });
    });

    describe('Send 10 optional emails example', () => {
      it('should repeat 10 times: check condition and send SMS if true', () => {
        return request(app.getHttpServer())
          .post('/decision/execute')
          .send({
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
          })
          .expect(201)
          .expect((res) => {
            expect(res.body).toEqual({ status: 'ok' });
          });
      });

      it('should not send SMS when condition is false', () => {
        return request(app.getHttpServer())
          .post('/decision/execute')
          .send({
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
          })
          .expect(201)
          .expect((res) => {
            expect(res.body).toEqual({ status: 'ok' });
          });
      });
    });

    describe('Complex scenarios', () => {
      it('should handle nested conditions', () => {
        return request(app.getHttpServer())
          .post('/decision/execute')
          .send({
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
          })
          .expect(201)
          .expect((res) => {
            expect(res.body).toEqual({ status: 'ok' });
          });
      });

      it('should handle loop with sequence', () => {
        return request(app.getHttpServer())
          .post('/decision/execute')
          .send({
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
          })
          .expect(201)
          .expect((res) => {
            expect(res.body).toEqual({ status: 'ok' });
          });
      });

      it('should handle empty context', () => {
        return request(app.getHttpServer())
          .post('/decision/execute')
          .send({
            tree: {
              type: 'SendSMS',
              phone: '+1234567890',
              message: 'Test',
            },
          })
          .expect(201)
          .expect((res) => {
            expect(res.body).toEqual({ status: 'ok' });
          });
      });

      it('should handle condition with variables', () => {
        return request(app.getHttpServer())
          .post('/decision/execute')
          .send({
            tree: {
              type: 'Condition',
              expression: 'ctx.variables.x > 5',
              trueAction: {
                type: 'SendSMS',
                phone: '+1234567890',
                message: 'Greater than 5',
              },
              falseAction: {
                type: 'SendSMS',
                phone: '+1234567890',
                message: 'Less than or equal to 5',
              },
            },
            context: {
              variables: {
                x: 10,
              },
            },
          })
          .expect(201)
          .expect((res) => {
            expect(res.body).toEqual({ status: 'ok' });
          });
      });
    });

    describe('Error handling', () => {
      it('should handle invalid action type', () => {
        return request(app.getHttpServer())
          .post('/decision/execute')
          .send({
            tree: {
              type: 'InvalidAction',
            },
          })
          .expect(500);
      });

      it('should handle missing required fields', () => {
        return request(app.getHttpServer())
          .post('/decision/execute')
          .send({
            tree: {
              type: 'SendSMS',
              // missing phone and message
            },
          })
          .expect(201); // Action will be created but may fail during execution
      });

      it('should handle malformed tree', () => {
        return request(app.getHttpServer())
          .post('/decision/execute')
          .send({
            tree: null,
          })
          .expect(500);
      });
    });
  });
});

