import { ExecutionContext, createParamDecorator } from '@nestjs/common';
export * from './public.decorator';

export const Me = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
