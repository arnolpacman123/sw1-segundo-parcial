import { UserI } from "../../../user/models/interfaces";

export interface RoomI {
    id?: number;
    name?: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    users?: UserI[];
}