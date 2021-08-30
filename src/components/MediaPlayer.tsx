import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

interface TimelineProps {
    width: number
}

const Wrapper = styled.div`
    padding: 10px;
    padding-bottom: 20px;
    border-bottom: 1px solid;
`;

const Title = styled.h1`
    font-weight: 500;
    color: white;
    text-align: center;
    @media (max-width: 768px) {
        font-size: 1.4em;
    }
`;

const ControlsWrapper = styled.div<{ isActive: boolean }>`
    display: flex;
    justify-content: center;
    margin-bottom: 40px;
    align-items: center;
    position: relative;
    img {
        opacity: ${props => props.isActive ? '1' : '.3'};
        cursor: ${props => props.isActive ? 'pointer' : 'not-allowed'}
    }
    @media (max-width: 768px) {
        margin-bottom: 20px;
    }

`;
const ControlButton = styled.img<{ alwaysActive?: boolean }>`
    margin: 0 10px;
    opacity: ${props => props.alwaysActive ? '1' : '.3'};
    cursor: ${props => props.alwaysActive ? 'pointer !important' : 'inherit'};
    @media (max-width: 768px) {
        max-width: 40px;
        max-height: 40px;
    }
`;
const TimelineWrapper = styled.div`
    height: 10px;
    border-radius: 10px;
    width: 100%;
    background-color: rgba(255, 255, 255, .2);
    position: relative;
`;

const Timeline = styled.div<TimelineProps>`
    position: absolute;
    left: 0;
    height: 10px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, .9);
    width: ${props => props.width ?? 50}%;
`;

const AudioWrapper = styled.div`
    height: 0;
    width: 0;
`;
const DurationWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
`;

interface MediaPlayerProps {
    audio: string,
    isPlaying: boolean,
    playTime: number,
    triggerRoomEvent: (event: RoomEventType) => void,
    setPlaying: (isPlaying: boolean) => void,
    setPlayTime: (t: number) => void
}

class Timer {
    time: number;
    isSubscribed = false;
    interval: NodeJS.Timer;
    timeout: NodeJS.Timeout;
    duration = 0;
    setTime: (t: number) => void;
    setPlaying: (isPlaying: boolean) => void;
    setPlayTime: (t: number) => void

    constructor() {
        this.time = 0;
    }

    subscribe(cb: (t: number) => void, cb2: (isPlaying: boolean) => void, cb3: (t: number) => void) {
        this.isSubscribed = true;
        this.setTime = cb;
        this.setPlaying = cb2;
        this.setPlayTime = cb3;
    }
    start(offset: number, startingSecond: number) {
        this.stop();

        this.time = startingSecond;
        this.setTime(startingSecond);

        this.timeout = setTimeout(() => {
            this.interval = setInterval(() => {
                if (this.time + 1 >= this.duration) {
                    this.stop();
                    this.setPlaying(false);
                    this.setPlayTime(this.time);
                } else {
                    this.time++;
                    this.setTime(this.time);
                }
            }, 1000);
            if (offset > 0) {
                this.time++;
            }
            this.setTime(this.time);
        }, offset);
    }
    stop() {
        clearInterval(this.interval);
        clearTimeout(this.timeout);
    }
    reset() {
        this.time = 0;
        this.setTime(0);
    }
    setDuration(duration: number) {
        this.duration = duration;
    }
}
const timer = new Timer();

const Player: React.FC<MediaPlayerProps> = ({ audio, isPlaying, playTime, setPlayTime, setPlaying, triggerRoomEvent }) => {
    const [currentAudio, setCurrentAudio] = useState(audio);
    const [isMuted, setMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);


    useEffect(() => {
        // if there is 500ms diff, then use the server time
        const when = Math.abs(playTime - audioRef.current.currentTime) > .5 ? playTime : audioRef.current.currentTime;
        audioRef.current.currentTime = when;

        const diff = Math.ceil(when) - when;
        const startingTime = Math.floor(when);
        setCurrentTime(startingTime);
        if (isPlaying) {
            timer.start(diff * 1000, startingTime);
        }

        if (!timer.isSubscribed) {
            timer.subscribe(setCurrentTime, setPlaying, setPlayTime);
        }
        if (!isPlaying) {
            audioRef.current.pause();
            timer.stop();

        } else {
            audioRef.current.play();
        }

        if (currentAudio !== audio) {
            setCurrentAudio(audio);
            timer.reset();

            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.load();
            }
        }
        if (audioRef.current && audioRef.current.duration) {
            setDuration(Math.floor(audioRef.current.duration));
            timer.setDuration(audioRef.current.duration);
        }
    }, [audio, isPlaying, playTime]);

    const toggleMute = () => {
        setMuted(!isMuted);
        audioRef.current.muted = !isMuted;
    }

    const formatZeros = (time: number) => time > 9 ? time : `0${time}`;
    const formatTime = (time: number) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time / 60) % 60);
        const seconds = Math.round(time) % 60;
        return `${hours > 0 ? `${hours}:` : ''}${formatZeros(minutes)}:${formatZeros(seconds)}`;
    }


    return (
        <Wrapper>
            <AudioWrapper>
                <audio style={{ visibility: 'hidden' }} id='audio' controls ref={audioRef}>
                    <source src={`/media/${audio}`} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            </AudioWrapper>
            <Title> {audio ? audio : 'No Audio Selected'} </Title>

            <ControlsWrapper isActive={!!audio}>
                <ControlButton
                    onClick={() => triggerRoomEvent('replay')}
                    height='30px'
                    width='30px'
                    src='/icons/replay.svg'
                    alt='replay'
                />

                <ControlButton
                    onClick={() => triggerRoomEvent('rewind')}
                    height='30px'
                    width='30px'
                    src='/icons/rewind.svg'
                    alt='muted'
                />

                <ControlButton
                    onClick={() => triggerRoomEvent((isPlaying && currentTime < duration) ? 'pause' : 'play')}
                    height='100px'
                    width='100px'
                    src={`/icons/${(isPlaying && currentTime < duration) ? 'pause' : 'play'}.svg`}
                    alt={(isPlaying && currentTime < duration) ? 'play' : 'pause'}
                />

                <ControlButton
                    onClick={() => triggerRoomEvent('fastforward')}
                    height='30px'
                    width='30px'
                    src='/icons/fastforward.svg'
                    alt='muted'
                />

                <ControlButton
                    alwaysActive={true}
                    onClick={toggleMute}
                    height='30px'
                    width='30px'
                    src={`/icons/${isMuted ? 'muted' : 'speaker'}.svg`}
                    alt={`${isMuted ? 'muted' : 'speaker'}`}
                />

            </ControlsWrapper>
            <DurationWrapper>
                <p>{formatTime(currentTime)}/{formatTime(duration)}</p>
            </DurationWrapper>
            <TimelineWrapper>
                <Timeline width={(currentTime / duration) * 100} />
            </TimelineWrapper>
        </Wrapper>
    )
}

export default Player;
