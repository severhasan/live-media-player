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

interface CustomSocket extends SocketModule.OriginalSocket {
    room: Room
}

interface AppConfig {
    DATABASE: {
        URI: string,
        OPTIONS: {
            useNewUrlParser: boolean,
            useUnifiedTopology: boolean,
            useCreateIndex: boolean,
        }
    }
    JWT_SECRET: string,
    PORT: number,
    dev: boolean
}
