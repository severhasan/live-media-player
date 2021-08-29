import styled from 'styled-components';

interface RoomProps {
    id: string,
    title: string,
    playing: string,
    users: number,
    joinRoom: (roomId: string) => void
}

export const Wrapper = styled.div`
    border: 1px solid lightgray;
    border-radius: 4px;
    padding: 10px;
    height: 240px;
    width: 240px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;
const Title = styled.h2`
    font-weight: 500;
    border-bottom: 1px solid #888;
`;
const Body = styled.div`
    display: flex;
`;
const LiveCircle = styled.div`
    height: 14px;
    width: 14px;
    border-radius: 50%;
    background-color: lightgreen;
    margin-right: 10px;
`;
const LiveSection = styled.div`
    display: flex;
    align-items: center;
    font-size: 0.7em;
`;
const Footer = styled.div`
    margin-top: 20px;
`;
export const Button = styled.button`
    padding: 8px 10px;
    width: 100%;
    font-size: 1.1em;
    font-weight: 600;
    background-color: yellowgreen;
    cursor: pointer;
    border-radius: 4px;
    &:hover {
        background-color: #7ea52f;
        background-color: #b7f33d;
    }
`;

const Room: React.FC<RoomProps> = ({ id, playing, title, users, joinRoom }) => {
    return (
        <Wrapper>
            <div>
                <LiveSection>
                    <LiveCircle />
                    <p> {users} people here</p>
                </LiveSection>
                <Title>{title}</Title>
            </div>
            <Body>
                <p>Playing: {playing}</p>
            </Body>
            <Footer>
                <Button onClick={() => joinRoom(id)}>
                    Join
                </Button>
            </Footer>

        </Wrapper>
    )
}
export default Room;
