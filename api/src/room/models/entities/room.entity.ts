import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { UserEntity } from "../../../user/models/entities/user.entity";

@Entity({ name: "rooms" })
export class RoomEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(() => UserEntity, (user) => user.rooms)
    @JoinTable({ name: "rooms_users", joinColumn: { name: "room_id" }, inverseJoinColumn: { name: "user_id" } })
    users: UserEntity[];
}