import {createContext, useState, ReactNode, useContext} from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};

type PlayerContextData = {
    episodeList: Array<Episode>;
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    hasPreviousEpisode: boolean;
    hasNextEpisode: boolean;
    play: (episode: Episode) => void;
    playList: (episodeList: Episode[], index: number) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    setPlayingState: (state: boolean) => void;
    playNext: () => void;
    playPrevious: () => void;
    clearPlayerState: () => void;
};

type PlayerContextProviderProps = {
    children: ReactNode;
};

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({ children}: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(episodeList: Episode[], index: number) {
      setEpisodeList(episodeList);
      setCurrentEpisodeIndex(index);
      setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function playNext() {
      if (isShuffling) {
        const nextRandomIndex = Math.floor(Math.random() * episodeList.length);
        setCurrentEpisodeIndex(nextRandomIndex);
      } else if (hasNextEpisode) {
        setCurrentEpisodeIndex(currentEpisodeIndex + 1);
      }
  }

  function playPrevious() {
    const previousEpisodeIndex = currentEpisodeIndex - 1;
    if (previousEpisodeIndex < 0) {
      return ;    
    }
    setCurrentEpisodeIndex(previousEpisodeIndex);
  }

  function clearPlayerState() {
      setEpisodeList([]);
      setCurrentEpisodeIndex(0);
  }

  const hasPreviousEpisode = (currentEpisodeIndex > 0);
  const hasNextEpisode     = isShuffling || ((currentEpisodeIndex+1) < episodeList.length);

  return (
    <PlayerContext.Provider value={ { 
        episodeList, 
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffling,
        play,
        playList,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        playNext,
        playPrevious,
        hasPreviousEpisode,
        hasNextEpisode,
        clearPlayerState,
    } }>
        {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}