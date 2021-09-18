import { v4 as uuidv4 } from 'uuid';
import { Server } from 'socket.io';
import LivePlayer from './LivePlayer';


interface EventPayload {
    event: RoomEventType,
    playTime?: number,
    audio?: string
}

export default class Room {

    id: string;
    lastActivity: number;
    /** name of the audio */
    audio: string;
    startTime: number;
    playTime = 0; // use for rewind or fastforward, or users who join later
    isPlaying = false;
    name: string;
    users: User[] = [];
    io: Server;

    constructor(name: string, io: Server) {
        this.name = name;
        this.io = io;
        this.id = uuidv4();

    }

    get currentPlaytime(): number {
        const x = this.playTime + (this.startTime > 0 ? ((Date.now() - this.startTime) / 1000) : 0);
        return x;
    }

    registerActivity(): void {
        this.lastActivity = Date.now();
    }

    addUser(user: User): void {
        this.users.push(user);

        LivePlayer.syncRooms();
    }

    removeUser(socketId: string): void {
        const index = this.users.findIndex(user => user.id === socketId);
        if (index >= 0) {
            this.users.splice(index, 1);
        }
        if (!this.users.length) {
            LivePlayer.removeRoom(this.id);
        }

        LivePlayer.syncRooms();
    }

    setMedia(audio: string): void {
        this.audio = audio;
        this.isPlaying = false;
        this.playTime = 0;
        this.startTime = 0; // in seconds
        this.io.in(this.id).emit('room-event', { event: 'set-audio', audio } as EventPayload);

        LivePlayer.syncRooms();
    }

    play(): void {
        if (!this.audio) return;

        this.startTime = Date.now();
        // reload if it's already playing on the server, which means it's finished on the client
        let event: RoomEventType = 'play';
        if (this.isPlaying) {
            this.playTime = 0;
            event = 'replay';
        } else {
            this.isPlaying = true;
        }
        this.io.in(this.id).emit('room-event', { event, playTime: this.playTime } as EventPayload);
    }

    pause(): void {
        if (!this.audio) return;

        this.playTime = this.playTime + ((Date.now() - this.startTime) / 1000);
        this.startTime = 0;
        this.isPlaying = false;
        this.io.in(this.id).emit('room-event', { event: 'pause', playTime: this.playTime } as EventPayload);
    }

    replay(): void {
        if (!this.audio) return;

        this.startTime = Date.now();
        this.playTime = 0;
        this.isPlaying = true;
        this.io.in(this.id).emit('room-event', { event: 'replay' } as EventPayload);
    }

    fastforward(): void {
        if (!this.audio) return;

        this.playTime = this.currentPlaytime + 3;
        if (this.isPlaying) {
            this.startTime = Date.now();
        }
        this.io.in(this.id).emit('room-event', { event: 'fastforward', playTime: this.playTime } as EventPayload);
    }
    rewind(): void {
        if (!this.audio) return;

        if (this.playTime <= 3) {
            return this.replay();
        }

        this.playTime = this.currentPlaytime - 3;
        if (this.isPlaying) {
            this.startTime = Date.now();
        }
        this.io.in(this.id).emit('room-event', { event: 'rewind', playTime: this.playTime } as EventPayload);
    }

    notifyUsers(): void {
        const data = {
            startTime: this.startTime,
            audio: this.audio,
            isPlaying: this.isPlaying
        }
        this.io.in(this.id).emit('room-sync', data);
    }
}
