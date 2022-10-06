import * as Tone from 'tone';
import {
  Instrument,
  InstrumentOptions,
} from 'tone/build/esm/instrument/Instrument';
import Section from 'controllers/Section';
import InstrumentFactory from 'factories/InstrumentFactory';
import EffectFactory from 'factories/EffectFactory';
import { differenceWith, intersectionWith, isEqual, isEqualWith } from 'lodash';
import { channelSkeletonData } from 'constants/constants';

interface SectionsObject {
  [id: string]: Section;
}

class Channel {
  readonly _id: string;
  _effectChain: any[];
  _instrument: Instrument<InstrumentOptions>;
  sectionStore: SectionsObject;

  _instrumentFactory: InstrumentFactory;
  _effectFactory: EffectFactory;

  volumeNode: Tone.Volume;
  soloNode: Tone.Solo;
  pannerNode: Tone.Panner;
  meterNode: Tone.Meter;

  constructor(id: string) {
    this._id = id;
    this._effectChain = [];
    this._instrument = new Tone.PolySynth(Tone.Synth);
    this.sectionStore = {};

    this._instrumentFactory = new InstrumentFactory();
    this._effectFactory = new EffectFactory();

    this.volumeNode = new Tone.Volume();
    this.soloNode = new Tone.Solo();
    this.pannerNode = new Tone.Panner();
    this.meterNode = new Tone.Meter();
    this.volumeNode.connect(this.meterNode);
    this.meterNode.connect(this.soloNode);
    this.soloNode.connect(this.pannerNode);
    this.connectEffectChain();

    // this.instrumentReferences = instrumentReferences;
    // this.meterNodeReferences = meterNodeReferences;
    // this.instrumentReferences[this.id] = this.instrument;
    // this.meterNodeReferences[this.id] = this.meterNode;
  }

  reconcile(prev = channelSkeletonData, curr: any) {
    this.reconcileInstrument(prev.instrument, curr.instrument);
    this.reconcileEffects(prev.effects, curr.effects);
    this.reconcileSections(prev.sections, curr.sections);
    this.reconcileChannelSettings(prev, curr);
    return this;
  }

  reconcileInstrument(prev: any, curr: any) {
    if (isEqual(prev, curr)) return;

    if (prev.id === curr.id) {
      this.instrument.set(curr.instrumentData);
    } else {
      const newInstrument = this._instrumentFactory.create(
        curr.type,
        curr.instrumentData
      );
      this.instrument = newInstrument;
    }
  }

  reconcileEffects(prev: any[], curr: any[]) {
    if (isEqual(prev, curr)) return;

    const onlySettingsHaveChanged =
      prev.length === curr.length &&
      isEqualWith(prev, curr, (a: any, b: any) => a.id === b.id);

    if (onlySettingsHaveChanged) {
      curr.forEach((effect, i) => {
        this.effectChain[i].set(effect.effectData);
      });
    } else {
      this.effectChain = curr.map((effect) =>
        this._effectFactory.create(effect.type, effect.effectData)
      );
    }
  }

  reconcileSections(prev: any[], curr: any[]) {
    if (isEqual(prev, curr)) return;
    // Sections that are in prev but not in curr are marked as sectionsToRemove
    const sectionsToRemove = differenceWith(
      prev,
      curr,
      (a, b) => a.id === b.id
    );
    // Sections that are in cur but not in prev are marked as sectionsToAdd
    const sectionsToAdd = differenceWith(curr, prev, (a, b) => a.id === b.id);
    // Sections that are in curr and prev potentially need to be updated. The version that is
    // stored in this variable is the version from curr - the version that the engine will need
    // to be in sync with.
    const sectionsToPotentiallyUpdate = intersectionWith(
      curr,
      prev,
      (a, b) => a.id === b.id
    );

    // delete the necessary sections
    sectionsToRemove.forEach((sectionData) =>
      this.deleteSection(sectionData.id)
    );

    // add the necessary sections
    sectionsToAdd.forEach((sectionData) => {
      const newSection = new Section(
        sectionData.id,
        sectionData.start
      ).reconcile(undefined, sectionData.notes) as Section;
      this.addSection(newSection);
    });

    // update the necessary sections
    sectionsToPotentiallyUpdate.forEach((sectionData) => {
      const prevSectionData = prev.find((el) => el.id === sectionData.id);
      if (isEqual(prevSectionData, sectionData)) {
        return;
      }
      const sectionInstance = this.sectionStore[sectionData.id];
      sectionInstance.reconcile(prevSectionData.notes, sectionData.notes);
    });
  }

  reconcileChannelSettings(prev: any, curr: any) {
    if (prev.volume !== curr.volume) {
      this.setVolume(curr.volume);
    }
    if (prev.pan !== curr.pan) {
      this.setPan(curr.pan);
    }
    if (prev.isMuted !== curr.isMuted) {
      if (curr.isMuted) {
        this.mute();
      } else {
        this.unmute();
      }
    }
    if (prev.isSolo !== curr.isSolo) {
      if (curr.isSolo) {
        this.solo();
      } else {
        this.unsolo();
      }
    }
  }

  get instrument() {
    return this._instrument;
  }

  set instrument(newInstrument) {
    const oldInstrument = this._instrument;
    const nextNode = this._effectChain.length
      ? this._effectChain[0]
      : this.volumeNode;
    oldInstrument.disconnect(nextNode);
    this._instrument = newInstrument;

    this._instrument.connect(nextNode);

    for (let section in this.sectionStore) {
      this.sectionStore[section].instrument = newInstrument;
    }
  }

  get effectChain() {
    return this._effectChain;
  }

  set effectChain(newEffectChaine) {
    this.disconnectEffectChain();

    this.effectChain = newEffectChaine;

    this.connectEffectChain();
  }

  connectEffectChain() {
    const completeChain = [
      this.instrument,
      ...this.effectChain,
      this.volumeNode,
    ];

    const chainNodes = completeChain.length - 1;

    for (let i = 0; i < chainNodes; i++) {
      completeChain[i].connect(completeChain[i + 1]);
    }

    this.pannerNode.connect(Tone.Destination);
  }

  disconnectEffectChain() {
    const completeChain = [
      this.instrument,
      ...this.effectChain,
      this.volumeNode,
    ];

    const chainNodes = completeChain.length - 1;

    for (let i = 0; i < chainNodes; i++) {
      completeChain[i].disconnect(completeChain[i + 1]);
    }

    this.pannerNode.disconnect(Tone.Destination);
  }

  setVolume(volume: number) {
    this.volumeNode.volume.value = volume;
  }

  mute() {
    this.volumeNode.mute = true;
  }

  unmute() {
    this.volumeNode.mute = false;
  }

  solo() {
    this.soloNode.solo = true;
  }

  unsolo() {
    this.soloNode.solo = false;
  }

  setPan(pan: number) {
    this.pannerNode.pan.value = pan;
  }

  addSection(section: Section) {
    this.sectionStore[section._id] = section;
    section.instrument = this.instrument;
  }

  deleteSection(sectionId: string) {
    const sectionToDelete = this.sectionStore[sectionId];
    sectionToDelete.delete();
    delete this.sectionStore[sectionId];
  }

  deleteChannel() {
    for (let sectionKey in this.sectionStore) {
      this.deleteSection(sectionKey);
    }
    this.disconnectEffectChain();
  }
}

export default Channel;
