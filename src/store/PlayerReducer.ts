import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_BPM } from 'constants/constants';

interface PlayerState {
  isPlaying: boolean;
  isPaused: boolean;
  isMuted: boolean;
  bpm: 120;
}

const initialState: PlayerState = {
  isPlaying: false,
  isPaused: false,
  isMuted: false,
  bpm: INITIAL_BPM,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    playTrack: (state) => {
      state.isPlaying = true;
    },
    pauseTrack: (state) => {
      state.isPlaying = false;
    },
    muteMaster: (state) => {
      state.isMuted = true;
    },
    unmuteMaster: (state) => {
      state.isMuted = false;
    },
  },
});

export const { playTrack, pauseTrack, muteMaster, unmuteMaster } =
  playerSlice.actions;

export default playerSlice.reducer;
