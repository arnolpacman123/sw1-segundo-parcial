import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from "../models/entities/room.entity";
import { Repository } from "typeorm";
import { RoomI } from "../models/interfaces/room.interface";
import { UserService } from "../../user/services/user.service";

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: Repository<RoomEntity>,
        private readonly userService: UserService,
    ) {
    }

    async createRoomsToUser(userId: number): Promise<RoomI[]> {
        const rooms = await this.roomRepository.find();

        const user = await this.userService.getUserByIdWithRooms(userId);
        user.rooms.push(...rooms);

        return (await this.userService.saveUser(user)).rooms;
    }

    async seedRooms(): Promise<RoomI[]> {
        const newRooms: RoomI[] = [];

        for (let i = 1; i <= 100; i++) {
            newRooms.push({
                name: `Room ${ i }`,
                description: `Room ${ i } description`,
            });
        }

        return await this.roomRepository.save(newRooms);
    }


    async getRoomsByUserId(userId: number): Promise<RoomI[]> {
        return await this.roomRepository.find({
            where: {
                users: {
                    id: userId,
                },
            },
        });
    }
}
