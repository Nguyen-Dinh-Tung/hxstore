import { EmailOtpService } from '@app/common/services';
import { Module } from '@nestjs/common';

@Module({
  providers: [EmailOtpService],
  exports: [EmailOtpService],
})
export class NodemailerModule {}
