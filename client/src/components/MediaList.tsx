import { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

interface MediaProps {
    selected: boolean;
}
const Wrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    overflow-y: auto;
    overflow-x: hidden;
    max-height: calc(100vh - 492px);
    @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
        max-height: calc(100vh - 330px);
    }
`;
const Medium = styled.div<MediaProps>`
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    background-color: ${props => props.selected ? 'rgb(255, 255, 255, .1)' : 'inherit'};
    p {
        margin-top: 20px;
    }
    &:hover {
        background-color: rgb(255, 255, 255, .1);
    }
`;

const MediaList: React.FC<{ audio: string, handleAudio: (audio: string) => void }> = ({ audio, handleAudio }) => {
    const [list, setList] = useState([] as string[]);

    useEffect(() => {
        if (!list.length) {
            axios.get('/media-list').then(res => {
                if (res?.data?.files) {
                    setList(res.data.files);
                }
            });
        }
    }, []);


    return (
        <Wrapper>
            {
                list.map((audioSrc, index) => (
                    <Medium
                        selected={audioSrc === audio}
                        key={'media_' + index}
                        onClick={() => handleAudio(audioSrc)}
                    >
                        <img height='40' width='40' src='/icons/audio2.svg' alt='audio-icon' />
                        <p>{audioSrc}</p>
                    </Medium>
                ))
            }
        </Wrapper>
    )
}

export default MediaList;
