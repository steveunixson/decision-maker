<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Decision Tree Processing - A backend component built with NestJS that processes decision trees. This application allows customers to define and execute business logic in a flexible, extensible way.

The system supports various action types:
- **Send SMS**: Sends SMS messages (logged for this exercise)
- **Send Email**: Sends email messages (logged for this exercise)
- **Condition**: Evaluates JavaScript expressions and executes branches based on results
- **Loop**: Executes a subtree a specified number of times
- **Sequence**: Executes multiple actions in sequence

## Project setup

```bash
$ npm install
```

## Running the application

### Development mode

```bash
# Start the application in development mode with watch
$ npm run start:dev

# Start the application
$ npm run start

# Start in debug mode
$ npm run start:debug
```

The application will be available at `http://localhost:3000`

### Production mode

```bash
# Build the application
$ npm run build

# Start in production mode
$ npm run start:prod
```

### Docker

```bash
# Build Docker image
$ docker-compose build

# Start the application with Docker Compose
$ docker-compose up

# Start in detached mode
$ docker-compose up -d

# Stop the application
$ docker-compose down
```

## API Endpoints

### POST /decision/execute

Executes a decision tree defined in JSON format.

**Request Body:**
```json
{
  "tree": {
    "type": "SendSMS",
    "phone": "+1234567890",
    "message": "Hello World"
  },
  "context": {
    "date": "1.1.2025",
    "variables": {
      "x": 10
    }
  }
}
```

**Response:**
```json
{
  "status": "ok"
}
```

## Running tests

### Unit tests

```bash
# Run all unit tests
$ npm run test

# Run tests in watch mode
$ npm run test:watch

# Run tests with coverage
$ npm run test:cov

# Run tests in debug mode
$ npm run test:debug
```

### E2E tests

```bash
# Run all e2e tests
$ npm run test:e2e
```

E2E tests cover:
- Basic action execution (SendSMS, SendEmail)
- Examples from documentation (Christmas Greeting, Chained Actions, Loop with Condition)
- Complex scenarios (nested conditions, loops with sequences)
- Error handling

### Test coverage

```bash
# Generate test coverage report
$ npm run test:cov
```

Coverage report will be generated in the `coverage` directory.

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
