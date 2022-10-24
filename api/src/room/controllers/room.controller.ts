import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { RoomService } from "../services/room.service";
import { RoomI } from "../models/interfaces/room.interface";

@Controller('room')
export class RoomController {
    constructor(
        private readonly roomService: RoomService,
    ) {
    }

    @Post('seed')
    async seedRooms(): Promise<RoomI[]> {
        return await this.roomService.seedRooms();
    }

    @Post('create/:userId')
    async createRoomsToUser(@Param('userId', new ParseIntPipe()) userId: number): Promise<RoomI[]> {
        return await this.roomService.createRoomsToUser(userId);
    }

    @Get('room-by-user-id/:userId')
    async getRoomsByUserId(@Param('userId', new ParseIntPipe()) userId: number): Promise<RoomI[]> {
        return await this.roomService.getRoomsByUserId(userId);
    }
}
