import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ormConfig } from "./constants/orm.config";

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    UserModule,
    RoomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
