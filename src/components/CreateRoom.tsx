import { useState } from 'react';
import { Button } from './RoomCard';
import styled from 'styled-components';

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
`;
const Input = styled.input<{inValid: boolean}>`
    padding: 4px;
    font-size: 1.1em;
    width: 100%;
    outline: ${props => props.inValid ? '1px solid red' : 'inherit'};
    color: #353d48;
    font-weight: 500;
`;


const CreateRoom: React.FC<{ createRoom: (roomName: string) => void }> = ({ createRoom }) => {
    const [roomName, setRoomName] = useState('');
    const [isInvalid, setInvalid] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (roomName.length < 3 || roomName.length > 20) {
            return setInvalid(true);
        }
        createRoom(roomName);
    }

    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <label htmlFor='new-room'>New Room</label>
                <Input
                    inValid={isInvalid}
                    id='new-room'
                    name='new-room'
                    type='text'
                    placeholder='My Room'
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                />
                <p style={{marginBottom: '20px', minHeight: '22px'}}>{isInvalid ? 'Room name is too long or too short' : ''}</p>
                <Button type='submit'>Create</Button>
            </form>
        </Wrapper>
    )
}

export default CreateRoom;
