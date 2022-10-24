import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection, OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from "socket.io";
import { UserService } from "src/user/services/user.service";
import { UnauthorizedException } from "@nestjs/common";
import { RoomService } from "../services/room.service";

@WebSocketGateway({ namespace: 'room', cors: { origin: '*' } })
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly userService: UserService,
        private readonly roomService: RoomService,
    ) { }

    @SubscribeMessage('message')
    handleMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: any): string {
        return 'Hello world!';
    }

    async handleConnection(@ConnectedSocket() client: Socket, ...args: any[]): Promise<void> {
        try {
            const decodeToken = await this.userService.verifyJwt(
                client.handshake.headers.authorization
            );
            const user = await this.userService.getUserById(decodeToken.id);
            if (!user) {
                this.disconnectClient(client);
            } else {
                client.data.user = user;
                const rooms = await this.roomService.getRoomsByUserId(user.id);
                this.server.to(client.id).emit('rooms', rooms);
            }
        } catch (error) {

        }
    }

    async handleDisconnect(@ConnectedSocket() client: Socket): Promise<void> {
        client.disconnect();
    }

    private disconnectClient(client: Socket): void {
        client.emit('error', new UnauthorizedException());
        client.disconnect();
    }
}
