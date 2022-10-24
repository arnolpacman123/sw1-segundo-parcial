import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { LoginResponseI, RegisterResponseI, UserI } from "../models/interfaces";
import { LoginUserDto, RegisterUserDto } from "../models/dto";

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {
    }

    @Post('register')
    async register(@Body() registerUserDto: RegisterUserDto): Promise<RegisterResponseI> {
        return await this.userService.register(registerUserDto);
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponseI> {
        return await this.userService.login(loginUserDto);
    }

    @Post('seed')
    async seedUsers(): Promise<UserI[]> {
        return await this.userService.seedUsers();
    }

    @Get('find-by-username')
    async findAllUsersByUsernameMatch(@Query('username') username: string): Promise<UserI[]> {
        return await this.userService.findAllUsersByUsernameMatch(username);
    }

    @Get('is-member-of-room')
    async isMemberOfRoom(
        @Query('room') roomId: number,
        @Headers('Authorization') authorization: string
    ): Promise<boolean> {
        const token = authorization.split(' ')[1];
        return await this.userService.isMemberOfRoom(roomId, token);
    }
}

