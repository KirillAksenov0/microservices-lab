import { ApiProperty } from '@nestjs/swagger';

export class JwtDto {
  @ApiProperty({
    type: String,
    description: 'access JWT',
    required: true,
  })
  access: string;

  @ApiProperty({
    type: String,
    description: 'refresh JWT',
    required: true,
  })
  refresh: string;
}

export class RefreshJwtDto {
  @ApiProperty({
    type: String,
    description: 'refresh JWT',
    required: true,
  })
  readonly refresh: string;
}