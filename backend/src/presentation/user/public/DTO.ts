import { IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';




export class UserOutputDtoPublic{
  @ApiProperty()
  @IsString()
  id: string
  @ApiProperty()
  @IsString()
  username: string
}
export class UserRegisterInputDtoPublic {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;

}