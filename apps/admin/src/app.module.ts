import { CoreModule, UserEntity } from '@app/common';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { OrdersModule } from './orders/orders.module';
@Module({
  imports: [
    CoreModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductModule,
    UserModule,
    OrdersModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
  exports: [],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly userService: UserService) {}
  async onModuleInit() {
    const user = await this.userService.findOne({
      where: {
        username: process.env.ADMIN_USERNAME,
      },
    });

    if (user) {
      return user;
    }

    await this.userService.create({
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
      createdAt: new Date().toISOString(),
    });
  }
}
