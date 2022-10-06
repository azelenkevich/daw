import * as Tone from 'tone';
import { differenceWith, intersectionWith, isEqual } from 'lodash';

import Channel from 'controllers/Channel';

class Bus {
  channels: Array<Channel>;
  masterVolumeNode: Tone.Volume;
  masterMeterNode: Tone.Meter;

  constructor() {
    this.channels = [];

    this.masterVolumeNode = new Tone.Volume();
    this.masterMeterNode = new Tone.Meter();

    Tone.Destination.chain(this.masterVolumeNode, this.masterMeterNode);
  }

  reconcile(prev: any, curr: any) {
    this.reconcilePlayer(prev.playerInfo, curr.playerInfo);
    this.reconcileChannels(prev.channels, curr.channels);
  }

  reconcilePlayer(prev: any, curr: any) {
    // return early if nothing in this slice of state has changed.
    if (isEqual(prev, curr)) return;
    // If isPlaying or isPaused have changed, work out whether the track needs to be started,
    // paused or stopped.
    if (prev.isPlaying !== curr.isPlaying || prev.isPaused !== curr.isPaused) {
      if (curr.isPaused) {
        Tone.Transport.pause();
      } else if (curr.isPlaying) {
        Tone.Transport.start('+0.1');
      } else {
        Tone.Transport.stop();
      }
    }
    // if the mute, volume or bpm settings have changed, update as necessary.
    if (prev.isMuted !== curr.isMuted) {
      Tone.Destination.mute = curr.isMuted;
    }
    if (prev.volume !== curr.volume) {
      this.masterVolumeNode.volume.value = curr.volume;
    }
    if (prev.bpm !== curr.bpm) {
      Tone.Transport.bpm.value = curr.bpm;
    }
  }

  reconcileChannels(prev: any[], curr: any[]) {
    if (isEqual(prev, curr)) return;

    const channelsToRemove = differenceWith(
      prev,
      curr,
      (a, b) => a.id === b.id
    );

    const channelsToAdd = differenceWith(curr, prev, (a, b) => a.id === b.id);

    const channelsToPotentiallyUpdate = intersectionWith(
      curr,
      prev,
      (a, b) => a.id === b.id
    );

    channelsToRemove.forEach((channel) => {
      this.removeChannel(channel.id);
    });

    channelsToAdd.forEach((channel) => {
      const newChannel = new Channel(channel.id).reconcile(undefined, channel);
      this.addChannel(newChannel);
    });

    channelsToPotentiallyUpdate.forEach((channel) => {
      const prevChannelData = prev.find((el) => el.id === channel.id);
      if (isEqual(prevChannelData, channel)) return;

      const channelInstance = this.channels.find((el) => el._id === channel.id);
      channelInstance?.reconcile(prevChannelData, channel);
    });
  }

  addChannel(channel: Channel) {
    this.channels.push(channel);
  }

  removeChannel(channelId: string) {
    const channelToRemove = this.channels.find(
      (channel) => channel._id === channelId
    );
    channelToRemove?.deleteChannel();
    this.channels = this.channels.filter(
      (channel) => channel._id !== channelId
    );
  }

  clearChannels() {
    for (let channel of this.channels) {
      channel.deleteChannel();
    }
  }
}

export default Bus;
