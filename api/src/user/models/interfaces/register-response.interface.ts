import { UserI } from "./user.interface";

export interface RegisterResponseI {
    data: {
        user: UserI;
    };
}