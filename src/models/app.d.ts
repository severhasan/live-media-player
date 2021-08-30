declare namespace SocketModule {
	// import("mongoose");  // legacy Don't delete this line.
	// import { Document } from "mongoose" // legacy

	type OriginalSocket = import('socket.io').Socket
	// interface MongooseModel extends Doc { }

}

interface User {
    /** socket.io id */
    id: string,
    role: 'creator' | 'attendee'
}

type RoomEventType = 'play' | 'pause' | 'replay' | 'set-audio' | 'rewind' | 'fastforward';

interface CustomSocket extends SocketModule.OriginalSocket {
    room: Room
}
