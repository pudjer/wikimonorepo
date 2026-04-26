import { IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class SessionDto {
  @ApiProperty()
  @IsString()
  sessionId: string;
}
