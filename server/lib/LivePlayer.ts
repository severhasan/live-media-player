import Room from './Room';
import { Server } from 'socket.io';

class App {
    private rooms: Room[] = [];
    private startTime: Date;
    private io: Server;

    constructor() {
        this.startTime = new Date();
    }

    addRoom(room: Room) {
        this.rooms.push(room);
        this.syncRooms();
    }

    // removeUser(roomId: string, soccketId: string) {
    //     const roomIdx = this.rooms.findIndex(room => room.id === roomId);
    //     if (roomIdx < 0) return;

    //     const room = this.rooms[roomIdx];
    //     if (room) {
    //         room.removeUser(soccketId);
    //     }
    //     if (!room.users.length) {
    //         this.rooms.splice(roomIdx, 1);
    //     }
    //     this.syncRooms();
    // }

    removeRoom(roomId: string) {
        const roomIndex = this.rooms.findIndex((room) => room.id === roomId);
        if (roomIndex > -1) {
            this.rooms.splice(roomIndex, 1);
        }
        this.syncRooms();
    }

    syncRooms() {
        this.io.emit('rooms-sync', { rooms: this.getRooms() });
    }

    getRoom(roomId: string) {
        return this.rooms.find((r) => r.id === roomId);
    }
    getRooms() {
        return this.rooms.map((room) => ({
            id: room.id,
            audio: room.audio,
            name: room.name,
            users: room.users.length,
        }));
    }

    setIo(io: Server) {
        this.io = io;
    }
}

const app = new App();
export default app;
