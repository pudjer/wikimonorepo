import { IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInputDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password?: string;
}


export class RegisterInputDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class RegisterOutputDto{
  @ApiProperty()
  @IsString()
  id: string
  @ApiProperty()
  @IsString()
  username: string
}



export class UserOutputDto{
  @ApiProperty()
  @IsString()
  id: string
  @ApiProperty()
  @IsString()
  username: string
}
