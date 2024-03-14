import { NodeMailerService } from '@app/common/services';
import { Module } from '@nestjs/common';

@Module({
  providers: [NodeMailerService],
  exports: [NodeMailerService],
})
export class NodemailerModule {}
