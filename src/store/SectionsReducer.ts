import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Note {
  id: string;
  time: string | number;
  note: string;
  duration: string | number;
  velocity: number;
}

export interface StoredSection {
  id: string;
  channelId: string;
  notes: Array<Note>;
  start: string; /// Format: '0:0:0'
  duration: string;
}

interface SectionsObject {
  [key: string]: StoredSection;
}

interface SectionsState {
  sections: SectionsObject;
}

const initialState: SectionsState = {
  sections: {},
};

function deletePropFromObject(obj: SectionsObject, prop: string) {
  let newObj = { ...obj };
  delete newObj[prop];
  return newObj;
}

function removePropsWithId(obj: SectionsObject, id: string) {
  let newObj: SectionsObject = {};
  for (let key in obj) {
    if (obj[key].channelId !== id) {
      newObj[key] = { ...obj[key] };
    }
  }
  return newObj;
}

const sectionsSlice = createSlice({
  name: 'sections',
  initialState,
  reducers: {
    addSection: (state, action: PayloadAction<{ section: StoredSection }>) => {
      const { section } = action.payload;
      state.sections = {
        ...state.sections,
        [section.id]: section,
      };
    },
    removeSection: (state, action: PayloadAction<{ sectionId: string }>) => {
      state.sections = deletePropFromObject(
        state.sections,
        action.payload.sectionId
      );
    },
    removeChannelSections: (
      state,
      action: PayloadAction<{ channelId: string }>
    ) => {
      state.sections = removePropsWithId(
        state.sections,
        action.payload.channelId
      );
    },
    updateSection: (state, action: PayloadAction<{ section: StoredSection }>) => {
      const { section } = action.payload;
      state.sections = {
        ...state.sections,
        [section.id]: section,
      };
    },
    addNote: (
      state,
      action: PayloadAction<{ note: Note; sectionId: string }>
    ) => {
      const { note, sectionId } = action.payload;
      state.sections = {
        ...state.sections,
        [sectionId]: {
          ...state.sections[sectionId],
          notes: [...state.sections[sectionId].notes, note],
        },
      };
    },
    removeNote: (
      state,
      action: PayloadAction<{ noteId: string; sectionId: string }>
    ) => {
      const { noteId, sectionId } = action.payload;
      state.sections = {
        ...state.sections,
        [sectionId]: {
          ...state.sections[sectionId],
          notes: state.sections[sectionId].notes.filter(
            (note) => note.id !== noteId
          ),
        },
      };
    },
  },
});

export const {
  addSection,
  removeChannelSections,
  removeSection,
  updateSection,
  addNote,
  removeNote,
} = sectionsSlice.actions;

export default sectionsSlice.reducer;
