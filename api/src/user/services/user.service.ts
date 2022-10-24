import { BadRequestException, ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../models/entities/user.entity";
import { Like, Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../constants/constants";
import { LoginResponseI, RegisterResponseI, UserI } from '../models/interfaces';
import { LoginUserDto, RegisterUserDto } from "../models/dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,
    ) {
    }

    async register(registerUserDto: RegisterUserDto): Promise<RegisterResponseI> {
        let { username, email, password } = registerUserDto;

        const emailExists = await this.emailExists(email);
        if (emailExists) {
            throw new ConflictException({
                message: 'Email already exists',
                field: 'email',
                status: HttpStatus.BAD_REQUEST,
            });
        }

        const usernameExists = await this.usernameExists(username);
        if (usernameExists) {
            throw new ConflictException({
                message: 'Username already exists',
                field: 'username',
                status: HttpStatus.BAD_REQUEST,
            });
        }

        const newUser = await this.userRepository.create({ username, email, password });

        await newUser.hashPassword();

        const userSaved = await this.userRepository.save(newUser);

        return {
            data: {
                user: userSaved,
            }
        };
    }

    async login(loginUserDto: LoginUserDto): Promise<LoginResponseI> {
        const { email, password } = loginUserDto;
        const user = await this.userRepository.findOne({ where: { email } });

        if (!user) {
            throw new BadRequestException({
                message: 'Invalid credentials',
                field: 'email',
                status: HttpStatus.BAD_REQUEST,
            });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new BadRequestException({
                message: 'Invalid credentials',
                field: 'password',
                status: HttpStatus.BAD_REQUEST,
            });
        }

        const token = await this.generateJWT(user);
        return { access_token: token, token_type: 'JWT', expires_in: jwtConstants.signOptions.expiresIn };
    }

    async emailExists(email: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ where: { email } });
        return !!user;
    }

    async usernameExists(username: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ where: { username } });
        return !!user;
    }

    async generateJWT(user: UserEntity): Promise<string> {
        return await this.jwtService.signAsync({ user });
    }

    async verifyJwt(jwt: string): Promise<any> {
        return await this.jwtService.verifyAsync(jwt);
    }

    async findAllUsersByUsernameMatch(username: string): Promise<UserI[]> {
        return await this.userRepository.find({ where: { username: Like(`%${ username }%`) } });
    }

    async isMemberOfRoom(roomId: number, token: string): Promise<boolean> {
        const decodedToken = await this.verifyJwt(token);
        const userId = decodedToken.user.id;
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: [ 'rooms' ]
        });
        const room = user.rooms.find(room => room.id === roomId);
        return !!room;
    }

    async getUserById(id: number): Promise<UserI> {
        return await this.userRepository.findOne({ where: { id } });
    }

    async getUserByIdWithRooms(id: number): Promise<UserI> {
        return await this.userRepository.findOne({
            where: { id },
            relations: [ 'rooms' ]
        });
    }

    async saveUser(user: UserI): Promise<UserI> {
        return await this.userRepository.save(user);
    }

    async seedUsers(): Promise<UserI[]> {
        const users: UserI[] = [];
        for (let i = 1; i <= 100; i++) {
            const user = await this.userRepository.create({
                username: `user${ i }`,
                email: `user${ i }@gmail.com`,
                password: `user${ i }`,
            });
            await user.hashPassword();
            users.push(user);
        }
        return await this.userRepository.save(users);
    }
}
