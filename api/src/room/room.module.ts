import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomEntity } from "./models/entities/room.entity";
import { RoomGateway } from './gateways/room.gateway';
import { UserModule } from "../user/user.module";
import { RoomService } from './services/room.service';
import { RoomController } from './controllers/room.controller';

@Module({
    imports: [ TypeOrmModule.forFeature([ RoomEntity ]), UserModule ],
    providers: [ RoomGateway, RoomService ],
    controllers: [ RoomController ],
})
export class RoomModule {
}
