import { effectTypes, instrumentTypes } from 'constants/constants';

export type Dict = {
  [key: string]: any;
};

export type EffectTypes = typeof effectTypes[keyof typeof effectTypes];

export type InstrumentTypes =
  typeof instrumentTypes[keyof typeof instrumentTypes];
