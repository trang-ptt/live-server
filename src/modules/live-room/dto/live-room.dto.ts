import { ApiProperty } from "@nestjs/swagger";

export class CreateLiveRoomDTO {
    @ApiProperty()
    name: string
}