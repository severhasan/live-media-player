import Room from './Room';
import LivePlayer from './LivePlayer';
import { Server, Socket } from 'socket.io';

interface CustomSocket extends Socket {
    room: Room
}

export default function (socket: CustomSocket, io: Server): void {

    // handle the event sent with socket.send()
    socket.on('create-room', (data: { roomName: string }) => {
        // create game & players, send back the status & message
        const room = new Room(data.roomName.trim(), io);
        room.addUser({ id: socket.id, role: 'creator' });
        LivePlayer.addRoom(room);

        socket.room = room;
        socket.join(room.id);
        io.to(socket.id).emit('room-crated', { roomId: room.id });
    });

    socket.on('get-rooms', () => {
        io.to(socket.id).emit('get-rooms', { rooms: LivePlayer.getRooms() });
    });

    socket.on('join-room', (data: { roomId: string }) => {
        const room = LivePlayer.getRoom(data.roomId);
        if (!room) return;

        room.addUser({ id: socket.id, role: 'attendee' });
        socket.join(room.id);
        socket.room = room;
        const payload = {
            roomId: room.id,
            audio: room.audio,
            isPlaying: room.isPlaying,
            playTime: room.currentPlaytime
        }
        io.to(socket.id).emit('room-joined', payload);
        LivePlayer.syncRooms();
    });


    socket.on('set-audio', (data: { name: string }) => {
        socket.room && socket.room.setMedia(data.name);
    });
    socket.on('leave-room', () => {
        // socket.room && LivePlayer.removeUser(socket.room.id, socket.id);
        socket.room && socket.room.removeUser(socket.id);
        socket.room = null;
    });

    socket.on('room-event', (data: {event: RoomEventType}) => {
        switch (data.event) {
            case 'pause': return socket.room && socket.room.pause();
            case 'play': return socket.room && socket.room.play();
            case 'replay': return socket.room && socket.room.replay();
            case 'rewind': return socket.room && socket.room.rewind();
            case 'fastforward': return socket.room && socket.room.fastforward();
        }
    });

    socket.on("disconnect", () => {
        // check if socket has been in a room
        if (socket.room) {
            socket.room.removeUser(socket.id);
        }
    });
}
