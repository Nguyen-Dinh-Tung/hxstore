import { QueryDto } from '@app/common';
import { DeliveryProductEnum } from '@app/common/enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class FindAllOrdersDto extends QueryDto {
  @IsOptional()
  @ApiPropertyOptional()
  @IsPhoneNumber('VN')
  @IsString()
  phone: string;

  @IsOptional()
  @ApiPropertyOptional({ enum: DeliveryProductEnum })
  @IsEnum(DeliveryProductEnum)
  delivery: DeliveryProductEnum;
}
