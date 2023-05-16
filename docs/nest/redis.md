---
title: 'redis配置'
---

## 介绍

`Nest.js`官方缓存方式`cache-manager`，可以单独使用，也可以配合`redis`使用。如果使用`redis`进行，存在一个问题，无法切换`redis`的数据库。所以就有第二套方案，使用`ioredis`

## cache-manager&redis

`/src/db/redis_cache.module.ts`
```javascript{5-22}
import ...

@Module({
  imports: [
    CacheModule.registerAsync<any>({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get(ConfigEnum.REDIS_HOT),
            port: configService.get(ConfigEnum.REDIS_PORT),
          },
          database: configService.get(ConfigEnum.REDIS_DB),
          password: configService.get(ConfigEnum.REDIS_PASSPORT),
        });
        return {
          store: () => store,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
```

`/src/db/redis_cache.service.ts`
```javascript
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Store } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    // private cacheManager: Cache,
    private cacheManager: Store, // 使用缓存中的redis库
  ) {}

  async cacheSet(key: string, value: string, ttl?: number) {
    return await this.cacheManager.set(key, value, ttl);
  }

  async cacheGet(key: string): Promise<any> {
    return this.cacheManager.get(key);
  }

  async cacheReset(): Promise<any> {
    return this.cacheManager.reset();
  }
}
```

`app.module.ts`注入
```javascript
import ...

@Module({
  imports: [
    ...
    RedisCacheModule
    ...
  ],
})
export class AppModule {}
```

## ioredis

封装方法类，使用工厂模式

```javascript
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { ConfigEnum } from 'src/enum/config.enum';

let n = 0;
const redisIndex = [];
const redisList = [];
const configService = new ConfigService();
const logger = new Logger();

export class RedisInstance {
  static async initRedis(method: string, db = 0): Promise<Redis> {
    const isExist = redisIndex.some((x) => x === db);
    if (!isExist) {
      logger.log(
        `[Redis ${db}]来自 ${method} 方法调用, Redis 实例化了 ${++n} 次`,
      );
      redisList[db] = new Redis({
        host: configService.get(ConfigEnum.REDIS_HOT),
        port: configService.get(ConfigEnum.REDIS_PORT),
        password: configService.get(ConfigEnum.REDIS_PASSPORT),
        db,
      });
      redisIndex.push(db);
    } else {
      logger.log(`[Redis ${db}]来自 ${method} 方法调用`);
    }
    return redisList[db];
  }
}
```

### 使用

```javascript
const redis = await RedisInstance.initRedis('auth.certificate', 0);
await redis.setex(`${user.id}-${user.username}`, 300, `${token}`);
```

## 参考

- [高速缓存(Caching)](https://docs.nestjs.cn/9/techniques?id=%e9%ab%98%e9%80%9f%e7%bc%93%e5%ad%98%ef%bc%88caching%ef%bc%89)
- [新版cache-manager-redis-store使用方式](https://github.com/dabroek/node-cache-manager-redis-store/issues/40)
- [ioredis github](https://github.com/luin/ioredis#readme)
- [ioredis class](https://luin.github.io/ioredis/classes/Redis.html#set)
- [Nest.js进阶系列五： Node.js中使用Redis原来这么简单](https://juejin.cn/post/7160936006517014558)
- [Nest.js 从零到壹系列（八）：使用 Redis 实现登录挤出功能](https://juejin.cn/post/6854573216879345672)