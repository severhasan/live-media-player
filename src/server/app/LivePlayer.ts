import Room from './Room';
import { io } from '.';

class App {
    rooms: Room[] = [];
    startTime: Date;
    io: typeof io;

    constructor() {
        this.startTime = new Date();
        this.io = io;
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
        const roomIndex = this.rooms.findIndex(room => room.id === roomId);
        if (roomIndex > -1) {
            this.rooms.splice(roomIndex, 1);
        }
        this.syncRooms();
    }

    syncRooms() {
        this.io.emit('rooms-sync', { rooms: this.getRooms() });
    }

    getRoom(roomId: string) {
        return this.rooms.find(r => r.id === roomId);
    }
    getRooms() {
        return this.rooms.map(room => ({
            id: room.id,
            audio: room.audio,
            name: room.name,
            users: room.users.length
        }));
    }
}

const app = new App();
export default app;
