export const INITIAL_BPM = 120;
export const METRONOME_LENGTH = 0.05; //seconds

export const instrumentTypes = {
  default: 'synth',
  am: 'amSynth',
  fm: 'fmSynth',
  duo: 'duoSynth',
  mono: 'monoSynth',
  drumKit: 'drumKit'
} as const;

export const effectTypes = {
  autoFilter: 'autoFilter',
  bitCrusher: 'bitCrusher',
  chorus: 'chorus',
  compressor: 'compressor',
  distortion: 'distortion',
  eq3: 'eq3',
  feedbackDelay: 'feedbackDelay',
  filter: 'filter',
  freeverb: 'freeverb',
  gate: 'gate',
  jcReverb: 'jcReverb',
  lfo: 'lfo',
  limiter: 'limiter',
  multibandCompressor: 'multibandCompressor',
  phaser: 'phaser',
  pingPongDelay: 'pingPongDelay',
  pitchShift: 'pitchShift',
  tremolo: 'tremolo',
  vibrato: 'vibrato'
} as const;

export const channelSkeletonData = {
  id: '',
  effects: [],
  isMuted: false,
  isSolo: false,
  pan: 0,
  volume: 0,
  sections: [],
  instrument: {
      id: '',
      channelId: '',
      type: '',
      instrumentData: {}
  }
}