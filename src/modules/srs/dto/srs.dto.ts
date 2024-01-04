import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetStreamQuery {
  @ApiProperty({
    required: false,
  })
  @Transform(({ value }) => {
    return parseInt(value);
  })
  start: number;

  @ApiProperty({
    required: false,
  })
  @Transform(({ value }) => {
    return parseInt(value);
  })
  count: number;
}

export class SrsRTCBodyDTO {
  @ApiProperty()
  api: string;

  @ApiProperty()
  clientip: any;

  @ApiProperty()
  sdp: string;

  @ApiProperty()
  streamurl: string;

  @ApiProperty()
  tid: string;
}

export class SrsClientDTO {
  @ApiProperty()
  liveRoomId: string;

  @ApiProperty()
  clientId: string;

  @ApiProperty()
  name: string;
}
