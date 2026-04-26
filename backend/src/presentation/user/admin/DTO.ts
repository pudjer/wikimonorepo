import { IsEnum, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleName } from "../../../domain/user/roles";

export class UserUpdateInputDtoAdmin {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({ enum: RoleName })
  @IsOptional()
  @IsEnum(RoleName)
  role?: RoleName;
}


export class UserRegisterInputDtoAdmin {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiPropertyOptional({ enum: RoleName })
  @ApiProperty()
  @IsEnum(RoleName)
  role: RoleName;
}



export class UserOutputDtoAdmin{
  @ApiProperty()
  @IsString()
  id: string

  @ApiProperty()
  @IsString()
  username: string

  @ApiProperty()
  @IsEnum(RoleName)
  role: RoleName;

}
