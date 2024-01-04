import { ApiProperty } from "@nestjs/swagger";

export class LiveLikeDTO {
  @ApiProperty({
    enum: ['LOVE', 'LIKE', 'LAUGH', 'SAD', 'ANGRY'],
  })
  react: string;
  roomId: string;
}
