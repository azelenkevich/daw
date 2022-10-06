import Tone from 'tone';
import { instrumentTypes } from 'constants/constants';
import { InstrumentTypes } from 'types/common';

class InstrumentFactory {
  create(instrumentType: InstrumentTypes, data: any) {
    switch (instrumentType) {
      case instrumentTypes.default:
        return this._createSynth(data);

      case instrumentTypes.am:
        return this._createAMSynth(data);

      case instrumentTypes.fm:
        return this._createFMSynth(data);

      //   case instrumentTypes.duo:
      //     return this._createDuoSynth(data);

      case instrumentTypes.mono:
        return this._createMonoSynth(data);

      default:
        return new Tone.PolySynth(Tone.Synth);
    }
  }

  _createSynth(data: any) {
    const synth = new Tone.PolySynth(Tone.Synth);
    if (data) {
      synth.set(data);
    }
    return synth;
  }

  _createAMSynth(data: any) {
    const synth = new Tone.PolySynth(Tone.AMSynth);
    if (data) {
      synth.set(data);
    }
    return synth;
  }

  _createFMSynth(data: any) {
    const synth = new Tone.PolySynth(Tone.FMSynth);
    if (data) {
      synth.set(data);
    }
    return synth;
  }

  //   _createDuoSynth(data: any) {
  //     const synth = new Tone.PolySynth(new Tone.DuoSynth());
  //     if (data) {
  //       synth.set(data);
  //     }
  //     return synth;
  //   }

  _createMonoSynth(data: any) {
    const synth = new Tone.PolySynth(Tone.MonoSynth);
    if (data) {
      synth.set(data);
    }
    return synth;
  }
}

export default InstrumentFactory;
