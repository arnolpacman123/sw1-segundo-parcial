import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./models/entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants/constants";

@Module({
    imports: [
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: jwtConstants.signOptions,
        }),
        TypeOrmModule.forFeature([ UserEntity ]),
    ],
    exports: [ UserService ],
    controllers: [ UserController ],
    providers: [ UserService ]
})
export class UserModule {
}
