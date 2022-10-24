import {
    BeforeInsert, BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { RoomEntity } from "../../../room/models/entities/room.entity";
import * as bcrypt from 'bcrypt';

@Entity({ name: "users" })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @ManyToMany(() => RoomEntity, (room) => room.users)
    rooms: RoomEntity[];

    @BeforeInsert()
    @BeforeUpdate()
    usernameAndEmailToLowerCase() {
        this.email = this.email.toLowerCase();
        this.username = this.username.toLowerCase();
    }

    async hashPassword(): Promise<void> {
        this.password = await bcrypt.hash(this.password, 10);
    }

    async comparePassword(password: string) {
        return await bcrypt.compare(password, this.password);
    }
}