---
title: "JWT鉴权"
---

## 安装依赖

```shell
npm install --save @nestjs/passport passport
npm install --save @nestjs/jwt passport-jwt
npm install @types/passport-jwt --save-dev
```

## 引用
`auth.module.ts`
```javascript {6-17}
import ...

@Global()
@Module({
  imports: [
    SystemUserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(ConfigEnum.SECRET), // 对称的秘密来签署令牌
        signOptions: {
          expiresIn: '1d', // 过期时间
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy // JWT策略注入
  ],
})
export class AuthModule {}
```

## JWT策略
`auth.strategy.ts`
```ts
import ...

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(protected configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(ConfigEnum.SECRET),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
```

## 鉴权守卫
`jwt.guard.ts`
```javascript
import ...

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // 白名单鉴权
    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
```

## 白名单装饰器
`skip_auth.decorator.ts`
```javascript
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

## 使用
```javascript
// 白名单，跳过鉴权
@Public()
@Post()
signIn() {
  return []
}

// 正常鉴权
@Post()
signUp() {
  return 
}
```

## 参考

- [认证(Authentication)](https://docs.nestjs.cn/9/security?id=%e8%ae%a4%e8%af%81%ef%bc%88authentication%ef%bc%89)
- [auth-jwt demo](https://github.com/nestjs/nest/tree/master/sample/19-auth-jwt)
- [jwt](https://jwt.io/)