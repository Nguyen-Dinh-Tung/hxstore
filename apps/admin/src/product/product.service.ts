import { EmailOtpService } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  constructor(private readonly nodeMailer: EmailOtpService) {}

  async findAll() {
    await this.nodeMailer.send({
      address: 'Crisphan6769@gmail.com',
      title: 'first message',
      content: 'con mẹ m ',
    });
    return {
      success: true,
    };
  }
}
