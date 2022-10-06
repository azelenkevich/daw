import * as Tone from 'tone';
import { Seconds } from 'tone/build/esm/core/type/Units';
import {
  Instrument,
  InstrumentOptions,
} from 'tone/build/esm/instrument/Instrument';
import { Note } from 'store/SectionsReducer';
import { differenceWith, isEqual } from 'lodash';

interface NotesObject {
  [id: string]: Note;
}

class Section {
  readonly _part: Tone.Part;
  readonly _id: string;
  noteStore: NotesObject;
  _start: string;
  _instrument: Instrument<InstrumentOptions>;

  constructor(id: string, start: string) {
    this._part = new Tone.Part();
    this._id = id;
    this.noteStore = {};
    this._instrument = new Tone.PolySynth(Tone.Synth);
    this._start = start || '0:0:0';
    this._part.start(this.start);
    this._part.callback = this._partCallback.bind(this);
  }

  reconcile(prev = [], curr: any[]) {
    if (isEqual(prev, curr)) return;

    /// Notes which are in prev, but not in curr, marked as notesToRemove
    const notesToRemove = differenceWith(
      prev,
      curr,
      (a: Note, b: Note) => a.id === b.id
    );

    /// Notes which are in curr, but not in prev, marked as notesToAdd
    const notesToAdd = differenceWith(
      curr,
      prev,
      (a: Note, b: Note) => a.id === b.id
    );

    notesToRemove.forEach((noteData) => {
      this.removeNote(noteData.id);
    });

    notesToAdd.forEach((noteData) => {
      this.addNote({
        id: noteData.id,
        note: noteData.note,
        duration: noteData.duration,
        time: noteData.time,
        velocity: noteData.velocity,
      });
    });

    return this;
  }

  get start() {
    return this._start;
  }

  set start(newStart: string) {
    this._start = newStart;
    this._part.start(newStart);
  }

  get instrument() {
    return this._instrument;
  }

  set instrument(newInstrument) {
    this._instrument = newInstrument;
  }

  addNote(note: Note) {
    this._part.add(note);
    this.noteStore[note.id] = note;
  }

  removeNote(noteId: string) {
    const noteRef = this.noteStore[noteId];
    if (noteRef) {
      this._part.remove(noteRef.time, noteRef);
      delete this.noteStore[noteId];
    }
  }

  _partCallback(time: Seconds, value: Note): void {
    this._instrument.triggerAttackRelease(
      value.note,
      value.duration,
      time,
      value.velocity
    );
  }

  delete() {
    this._part.dispose();
  }
}

export default Section;
