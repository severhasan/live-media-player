import { useEffect, useState } from 'react';
import styled from 'styled-components';
import CreateRoom from '../components/CreateRoom';
import MediaList from '../components/MediaList';
import MediaPlayer from '../components/MediaPlayer';
import RoomComponent from '../components/RoomCard';

import socket from '../utils/socket';

interface RoomItem {
    id: string;
    audio: string;
    name: string;
    users: number;
}
const Wrapper = styled.div`
    height: calc(100vh - 180px);
    @media (max-width: 768px) {
        height: calc(100vh - 102px);
    }
`;
const RoomsWrapper = styled.div``;
const PlayerWrapper = styled.div`
    position: relative;
`;

const RoomControls = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
`;
const RoomControl = styled.div<{ show: boolean }>`
    padding: 10px;
    cursor: pointer;
    border-radius: 4px;
    &:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
    ${(props) => (props.show ? 'visibility: hidden' : '')}
`;

const Title = styled.h1`
    font-weight: 500;
    border-bottom: 1px solid lightgray;
`;

const Page: React.FC = () => {
    const [rooms, setRooms] = useState([] as RoomItem[]);
    const [room, setRoom] = useState('');
    const [isPlaying, setPlaying] = useState(false);
    const [audio, setAudio] = useState('');
    const [playTime, setPlayTime] = useState(0);
    const [isCreatingRoom, setCreatingRoom] = useState(false);

    useEffect(() => {
        socket.emit('get-rooms');

        socket.on('room-crated', (data: { roomId: string }) => {
            setRoom(data.roomId);
            setCreatingRoom(false);
        });
        socket.on(
            'room-joined',
            (data: {
                roomId: string;
                audio: string;
                isPlaying: boolean;
                playTime: number;
            }) => {
                setPlayTime(data.playTime);
                setRoom(data.roomId);
                setAudio(data.audio);
                setPlaying(data.isPlaying);
            }
        );
        socket.on('set-audio', (data: { name: string }) => {
            setAudio(data.name);
        });

        socket.on('rooms-sync', (data: { rooms: RoomItem[] }) => {
            setRooms(data.rooms);
        });
        socket.on(
            'room-sync',
            (data: { audio: string; isPlaying: boolean }) => {
                setAudio(data.audio);
                setPlaying(data.isPlaying);
            }
        );
        socket.on('get-rooms', (data: { rooms: RoomItem[] }) => {
            setRooms(data.rooms);
        });

        socket.on(
            'room-event',
            (data: {
                event: RoomEventType;
                audio?: string;
                playTime?: number;
            }) => {
                switch (data.event) {
                    case 'play':
                        setPlayTime(data.playTime);
                        return setPlaying(true);
                    case 'pause':
                        setPlayTime(data.playTime);
                        return setPlaying(false);
                    case 'replay':
                        setPlaying(false);
                        setPlayTime(0);
                        return setPlaying(true);
                    case 'set-audio':
                        setPlayTime(0);
                        setPlaying(false);
                        return setAudio(data.audio);
                    case 'rewind':
                    case 'fastforward':
                        setPlayTime(data.playTime);
                }
            }
        );
    }, []);

    const leaveRoom = () => {
        socket.emit('leave-room');
        setPlayTime(0);
        setAudio('');
        setPlaying(false);
        setCreatingRoom(false);
        setRoom('');
    };

    const triggerRoomEvent = (event: RoomEventType) => {
        if (!audio) return;
        socket.emit('room-event', { event });
    };
    const handleAudio = (name: string) => {
        if (name === audio) return;
        socket.emit('set-audio', { name });
    };
    const createRoom = (roomName: string) => {
        socket.emit('create-room', { roomName });
    };
    const joinRoom = (roomId: string) => {
        socket.emit('join-room', { roomId });
    };

    return (
        <Wrapper>
            <RoomControls>
                <RoomControl show={!room || isCreatingRoom} onClick={leaveRoom}>
                    {'<'} Leave Room
                </RoomControl>
                <RoomControl
                    onClick={() => setCreatingRoom(true)}
                    show={!!room && !isCreatingRoom}
                >
                    + Create Room
                </RoomControl>
            </RoomControls>
            {room ? (
                <PlayerWrapper>
                    <MediaPlayer
                        audio={audio}
                        isPlaying={isPlaying}
                        playTime={playTime}
                        setPlaying={setPlaying}
                        setPlayTime={setPlayTime}
                        triggerRoomEvent={triggerRoomEvent}
                    />
                    <MediaList audio={audio} handleAudio={handleAudio} />
                </PlayerWrapper>
            ) : (
                <RoomsWrapper>
                    {isCreatingRoom && <CreateRoom createRoom={createRoom} />}

                    <Title>Live Rooms</Title>
                    {rooms.map((room) => (
                        <RoomComponent
                            key={room.id}
                            id={room.id}
                            title={room.name}
                            playing={room.audio}
                            users={room.users}
                            joinRoom={joinRoom}
                        />
                    ))}

                    {!rooms.length && (
                        <p>
                            Currenlty there are no rooms. Go ahead and create
                            one!
                        </p>
                    )}
                </RoomsWrapper>
            )}
        </Wrapper>
    );
};

export default Page;
