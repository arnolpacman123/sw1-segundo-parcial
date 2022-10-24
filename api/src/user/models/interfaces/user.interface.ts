import { RoomI } from "src/room/models/interfaces/room.interface";

export interface UserI {
    id?: number;
    username?: string;
    email?: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
    rooms?: RoomI[];
}