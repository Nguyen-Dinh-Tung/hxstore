import { QueryDto } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class FindAllOrdersDto extends QueryDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsPhoneNumber('VN')
  @IsString()
  phone: string;
}
