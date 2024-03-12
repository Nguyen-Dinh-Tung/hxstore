import { PositionRowEnum, PositionsScreenEnum } from '@app/common/enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class UpdatePositionsProductDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsNumberString()
  id: number;

  @IsOptional()
  @ApiPropertyOptional()
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @ApiPropertyOptional({ enum: PositionsScreenEnum })
  @IsEnum(PositionsScreenEnum)
  positionsScreen: PositionsScreenEnum;

  @IsOptional()
  @ApiPropertyOptional({ enum: PositionRowEnum })
  @IsEnum(PositionRowEnum)
  positionsRow: PositionRowEnum;
}
