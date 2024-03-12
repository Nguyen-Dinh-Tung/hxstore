import { PositionRowEnum, PositionsScreenEnum } from '@app/common/enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class SetPositionsProductDto {
  @IsOptional()
  @ApiPropertyOptional({ enum: PositionsScreenEnum })
  @IsEnum(PositionsScreenEnum)
  positionsScreen: PositionsScreenEnum;

  @IsOptional()
  @ApiPropertyOptional({ enum: PositionRowEnum })
  @IsEnum(PositionRowEnum)
  positionsRow: PositionRowEnum;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumberString()
  id: number;
}
