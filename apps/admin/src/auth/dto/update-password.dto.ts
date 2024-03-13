import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @Length(6, 30)
  ordPassword: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @Length(6, 30)
  newPassword: string;
}
