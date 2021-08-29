interface User {
    /** socket.io id */
    id: string,
    role: 'creator' | 'attendee'
}

type RoomEventType = 'play' | 'pause' | 'replay' | 'set-audio' | 'rewind' | 'fastforward';
