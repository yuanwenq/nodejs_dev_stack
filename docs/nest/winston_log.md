---
title: 'winston日志'
---

## 安装

- [nest-winston](https://www.npmjs.com/package/nest-winston)
- [winston](https://www.npmjs.com/package/winston)
- [winston-daily-rotate-file 日志轮转](https://www.npmjs.com/package/winston-daily-rotate-file)

```shell
npm install nest-winston winston winston-daily-rotate-file
```

## 流程

1. `main.ts`日志替换
2. `WinstonModule`编写
3. `app.module.ts`注入
4. 成功响应输出
5. 错误响应输出

### 1. 日志替换

`main.ts`

```javascript{5}
import ...

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.setGlobalPrefix('api/v1');

  const logger = new Logger();

  // 全局拦截器，统一格式响应
  app.useGlobalInterceptors(new SerializeResponseInterceptor(logger));
  // 全局Filter只能有一个
  app.useGlobalFilters(new AllExceptionFilter(logger, new ConfigService()));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
```

### 2. WinstonModule编写

`logs.modules.ts`

```javascript
import ...

const createDailyRotateTransport = (
  level: string,
  filename: string,
): DailyRotateFile => {
  return new DailyRotateFile({
    level,
    dirname: 'logs',
    filename: `${filename}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '7d',
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DDTHH:mm:ss',
      }),
      winston.format.simple(),
    ),
  });
};

@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const consoleTransports = new Console({
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            utilities.format.nestLike(),
          ),
        });

        return {
          transports: [
            consoleTransports,
            ...(configService.get(LogEnum.LOG_ON)
              ? [
                  createDailyRotateTransport('info', 'application'),
                  createDailyRotateTransport('warn', 'error'),
                ]
              : []),
          ],
        } as WinstonModuleOptions;
      },
    }),
  ],
  controllers: [LogsController],
  providers: [LogsService],
})
export class LogsModule {}

```

### 3. app.modules.ts

```javascript
import { Logger, Module } from '@nestjs/common';
import ...

@Module({
  imports: [
    ...
  ],
  controllers: [],
  providers: [
    Logger,
  ],
  exports: [Logger],
})
export class AppModule {}
```

### 4. 成功响应输出拦截器

```javascript
import ...

@Injectable()
export class SerializeResponseInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        const result = {
          status_code: response.statusCode,
          data,
          message: 'success',
          response_time: new Date().getTime(),
        };

        this.logger.log({
          message: 'success',
          headers: request.headers,
          query: request.query,
          body: request.body,
          ip: requestIp.getClientIp(request).match(/(\d{1,3}\.){3}\d{1,3}/)[0],
          api_url: request.originalUrl,
          method: request.method,
        });

        return result;
      }),
    );
  }
}
```

### 5. 错误响应输出过滤器

```javascript{54-62,69}
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  LoggerService,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as dayjs from 'dayjs';
import * as requestIp from 'request-ip';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    // http状态码
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const ip = requestIp.getClientIp(request).match(/(\d{1,3}\.){3}\d{1,3}/)[0];

    const message = exception.message
      ? exception.message
      : `${httpStatus >= 500 ? 'Service Error' : 'Client Error'}`;

    /**
     * @title 错误响应数据格式
     */
    const errorResponse = {
      status_Code: httpStatus,
      data: {
        error: message,
      },
      message: 'fail',
      url: request.originalUrl,
      response_time: dayjs().valueOf(),
    };

    /**
     * @title 日志记录数据格式
     */
    const loggerResponseBody = {
      headers: request.headers,
      query: request.query,
      body: request.body,
      timestamp: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
      ip,
      exception: exception['name'],
      error: errorResponse,
    };

    // 设置返回的状态码、请求头、发送错误信息
    response.status(httpStatus);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);

    this.logger.error(loggerResponseBody);
  }
}

```

## 参考

- [Nest.js 日志 官方文档](https://docs.nestjs.cn/9/techniques?id=%e6%97%a5%e5%bf%97)

