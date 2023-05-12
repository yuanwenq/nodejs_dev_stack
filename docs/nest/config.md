---
title: "环境变量"
---

## 简单环境变量

简单环境变量适用于少量配置信息，配置信息没有太多嵌套的方式。使用<span class="e-1">.env</span>文件

### 依赖库

- [cross-env 运行跨平台设置和使用环境变量的脚本](https://www.npmjs.com/package/cross-env)
- [dotenv Dotenv 是一个零依赖模块，它将环境变量从 .env 文件加载到 process.env](https://www.npmjs.com/package/dotenv)
- [joi 最强大的 JavaScript 模式描述语言和数据验证器。](https://www.npmjs.com/package/joi)

### 代码

<span class="e-1">.env.*</span> 文件

```ts
// .env
DB = mysql
DB_HOST = 127.0.0.1
DB_NAME = common-db

// .env.development
DB = mysql
DB_HOST = 127.0.0.1
DB_NAME = dev-db

// .env.production
DB = mysql
DB_HOST = 127.0.0.1
DB_NAME = prod-db
```

<span class="e-1">app.modules.ts</span> 文件

```ts
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';

const envFilePath = `.env.${process.env.NODE_ENV || `development`}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      load: [() => dotenv.config({ path: '.env' })],
      // 使用 joi 验证环境变量，保证变量的正确性
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        DB_PORT: Joi.number().valid(3306),
        DB_HOST: Joi.alternatives().try(
          Joi.string().ip(),
          Joi.string().domain(),
        ),
        DB_TYPE: Joi.string().valid('mysql', 'postgres'),
        DB_DATABASE: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_SYNC: Joi.boolean().default(false),
        LOG_LEVEL: Joi.string(),
        LOG_ON: Joi.boolean().default(false),
      }),
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

```

## yaml环境变量

使用`yaml`格式编写环境变量是为了可以编写嵌套格式的配置信息

### 依赖库

- [cross-env](https://www.npmjs.com/package/cross-env)
- [js-yaml](https://www.npmjs.com/package/js-yaml)
- [@types/js-yaml](https://www.npmjs.com/package/@types/js-yaml)
- [lodash](https://www.npmjs.com/package/lodash)

### 代码

配置文件
```yaml
# config.yml
db:
  mysql1:
    host: 127.0.0.1
    port: 3306

  mysql2:
    host: 127.0.0.1
    port: 3306

# config.development.yml
db:
  mysql1:
    name: mysql-dev

  mysql2:
    name: mysql-dev1


# config.production.yml
db:
  mysql1:
    name: mysql-prod

  mysql2:
    name: mysql-prod1
```

<span class="e-1">configuration.ts</span> 文件

```ts
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import * as _ from 'lodash';

const YAML_COMMON_CONFIG_FILENAME = 'config.yml';
const filePath = join(__dirname, '../config', YAML_COMMON_CONFIG_FILENAME);

const envPath = join(
  __dirname,
  '../config',
  `config.${process.env.NODE_ENV || 'development'}.yml`,
);

const commonConfig = yaml.load(readFileSync(filePath, 'utf-8'));

const envConfig = yaml.load(readFileSync(envPath, 'utf-8'));

// 因为ConfigModule有一个load方法，需要导入一个函数
export default () => {
  return _.merge(commonConfig, envConfig);
};

```

<span class="e-1">app.modules.ts</span> 文件

```ts
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

```

## json环境变量

使用`config`库编写配置文件，自动合并，不需要特意编写配置信息。

### 依赖库

- [config](https://www.npmjs.com/package/config)

## 配置文件参数验证Joi方案

- [joi](https://www.npmjs.com/package/joi)