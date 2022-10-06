import { configureStore } from '@reduxjs/toolkit';
import PlayerReducer from 'store/PlayerReducer';
import ChannelsReducer from 'store/ChannelReducer';
import SectionsReducer from 'store/SectionsReducer';

const store = configureStore({
  reducer: {
    player: PlayerReducer,
    channels: ChannelsReducer,
    sections: SectionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
