import { ApiProperty } from '@nestjs/swagger';

export class Success {
  @ApiProperty({type: Boolean, default: true})
  success = true;
}
