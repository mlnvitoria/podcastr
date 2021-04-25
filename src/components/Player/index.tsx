import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Slider from 'rc-slider';

import { usePlayer } from '../../contexts/PlayerContexts';

import styles from './styles.module.scss';
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';


export function Player() {
    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        isLooping,
        isShuffling,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        playNext,
        playPrevious,
        hasPreviousEpisode,
        hasNextEpisode,
        clearPlayerState,
    } = usePlayer();
    const episodePlaying = episodeList[currentEpisodeIndex];
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);

    function setUpProgressListener() {
        audioRef.current.currentTime = 0;
        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(
                Math.floor(audioRef.current.currentTime)
            );
        })
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded() {
        if (hasNextEpisode) {
            playNext();
        } else {
            clearPlayerState();
        }
    }

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    return (
        <div className={styles.container}>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando agora</strong>
            </header>

            { episodePlaying ? (
                <div className={styles.currentEpisode}>
                    <Image width={592} height={592} src={episodePlaying.thumbnail} objectFit="cover" />
                    <strong>{episodePlaying.title}</strong>
                    <span>{episodePlaying.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            ) }

            <footer className={!episodePlaying ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{ convertDurationToTimeString(progress) }</span>
                    <div className={styles.slider}>
                        { episodePlaying ? (
                            <Slider 
                                max={ episodePlaying.duration }
                                value={ progress }
                                onChange={handleSeek}
                                trackStyle={{ backgroundColor: '#04b361'}}
                                railStyle={{ backgroundColor: '#9f75ff'}}
                                handleStyle={{ borderColor: '#04b361', borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        ) }
                    </div>
                    
                    <span>{ convertDurationToTimeString(episodePlaying?.duration ?? 0) }</span>
                </div>

                { episodePlaying && (
                    <audio 
                        src={episodePlaying.url} 
                        ref={audioRef} 
                        onPlay={ () => setPlayingState(true) }
                        onPause={ () => setPlayingState(false) }
                        onEnded={ () => handleEpisodeEnded() }
                        onLoadedMetadata={ () =>  setUpProgressListener() }
                        loop={isLooping}
                        autoPlay />
                ) }

                <div className={styles.buttons}>
                    <button 
                        type="button" 
                        disabled={!episodePlaying || episodeList.length === 1}
                        onClick={toggleShuffle}
                        className={ isShuffling ? styles.isActive : '' }
                    >
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>
                    <button type="button" disabled={!episodePlaying || !hasPreviousEpisode} onClick={ playPrevious }>
                        <img src="/play-previous.svg" alt="Tocar anterior" />
                    </button>
                    <button 
                        type="button" 
                        className={styles.playButton} 
                        disabled={!episodePlaying}
                        onClick={ togglePlay }
                    >
                        { isPlaying ? (
                            <img src="/pause.svg" alt="Pausar" />
                        ) : (
                            <img src="/play.svg" alt="Tocar" />
                        ) }
                    </button>
                    <button type="button" disabled={!episodePlaying || !hasNextEpisode} onClick={ playNext }>
                        <img src="/play-next.svg" alt="Tocar próxima" />
                    </button>
                    <button 
                        type="button" 
                        disabled={!episodePlaying}
                        onClick={toggleLoop}
                        className={ isLooping ? styles.isActive : '' }
                    >
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div>
    );
}