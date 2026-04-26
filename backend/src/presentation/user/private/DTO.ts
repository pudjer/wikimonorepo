import { IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInputDtoPrivate {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password?: string;
}


export class UserOutputDtoPrivate{
  @ApiProperty()
  @IsString()
  id: string
  @ApiProperty()
  @IsString()
  username: string
}
