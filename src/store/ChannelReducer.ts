import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StoredChannelProps {
  id: string;
  name: string;
  instrumentId: string;
  instrumentType: string;
}

export interface StoredChannel {
  id: string;
  name: string;
  instrumentId: string;
  instrumentType: string;
  effectIds: string[];
  sectionIds: string[];
  volume: number;
  pan: number;
  isMuted: boolean;
  isSolo: boolean;
}

interface ChannelState {
  channels: StoredChannel[];
  selectedChannelId: string;
}

const initialState: ChannelState = {
  channels: [],
  selectedChannelId: '',
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: (state, action: PayloadAction<StoredChannelProps>) => {
      state.channels.push({
        id: action.payload.id,
        name: action.payload.name,
        instrumentId: action.payload.instrumentId,
        instrumentType: action.payload.instrumentType,
        effectIds: [],
        sectionIds: [],
        volume: 0,
        pan: 0,
        isMuted: false,
        isSolo: false,
      });
    },
    removeChannel: (state, action: PayloadAction<{ channelId: string }>) => {
      state.channels = state.channels.filter(
        (channel) => channel.id !== action.payload.channelId
      );
    },
    updateChannel: (state, action: PayloadAction<{ channel: any }>) => {
      state.channels = state.channels.map((channel) =>
        channel.id === action.payload.channel.id
          ? action.payload.channel
          : channel
      );
    },
    addChannelSection: (
      state,
      action: PayloadAction<{ sectionId: string; channelId: string }>
    ) => {
      const { channelId, sectionId } = action.payload;
      state.channels = state.channels.map((channel) => {
        if (channel.id === channelId) {
          return {
            ...channel,
            sectionIds: [...channel.sectionIds, sectionId],
          };
        } else {
          return channel;
        }
      });
    },
    removeChannelSection: (
      state,
      action: PayloadAction<{ sectionId: string; channelId: string }>
    ) => {
      const { channelId, sectionId } = action.payload;
      state.channels = state.channels.map((channel) => {
        if (channel.id === channelId) {
          return {
            ...channel,
            sectionIds: channel.sectionIds.filter(
              (id: string) => id !== sectionId
            ),
          };
        } else {
          return channel;
        }
      });
    },
    selectChannel(state, action: PayloadAction<string>) {
      state.selectedChannelId = action.payload;
    },
    removeChannelSelection(state) {
      state.selectedChannelId = '';
    },
  },
});

export const {
  addChannel,
  removeChannel,
  updateChannel,
  addChannelSection,
  removeChannelSection,
  selectChannel,
  removeChannelSelection,
} = channelsSlice.actions;

export default channelsSlice.reducer;
