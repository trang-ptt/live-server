import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetStreamQuery {
  @ApiProperty()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  start: number;

  @ApiProperty()
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

export class SrsCbDTO {
  @ApiProperty()
  serverId: string;
  @ApiProperty()
  serviceId: string;
  @ApiProperty()
  action: string;
  @ApiProperty()
  clientId: string;
  @ApiProperty()
  ip: string;
  @ApiProperty()
  vhost: string;
  @ApiProperty()
  app: string;
  @ApiProperty()
  tcUrl: string;
  @ApiProperty()
  stream: string;
  @ApiProperty()
  param: string;
  @ApiProperty()
  streamUrl: string;
  @ApiProperty()
  streamId: string;
}
