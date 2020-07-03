/**
 * Copyright 2020 Neetos LLC. All rights reserved.
 */
import SocketClient from './SocketClient';
import {
  PEER_EVENT_USER_JOINED,
  PEER_EVENT_REMOVE_STREAM,
  PEER_SIGNAL,
  PEER_EVENT_ADD_STREAM,
} from '../constants/chat';
import {
  addRemoteStream,
  removeRemoteStream,
  updateRemoteStream,
} from '../actions/video';

class WebRtcSession {
  /**
   * Peer connection configuration
   *
   * @type {RTCConfiguration}
   */
  pcConfig = {
    iceServers:
      [
        {
          urls: 'stun:stun.neetos.com:3478',
          username: 'pixie',
          credential: '123456',
        },
        {
          urls: 'turn:turn.neetos.com:3478',
          username: 'pixie',
          credential: '123456',
        },
      ],
  };

  /**
   *
   * @type {Map<string, RTCPeerConnection>}
   */
  connections = new Map();

  /**
   * @type {Map<string, Set<RTCRtpSender>>}
   */
  localVideoTracks = new Map();

  /**
   * @type {MediaStream}
   */
  localVideoStream = null;

  /**
   * @type {Map<string, Set<RTCRtpSender>>}
   */
  localAudioTracks = new Map();

  /**
   * @type {MediaStream}
   */
  localAudioStream = null;

  /**
   * @type {Map<string, Set<RTCRtpSender>>}
   */
  localScreenShareTracks = new Map();

  /**
   * @type {MediaStream}
   */
  localScreenShareStream = null;

  onUserJoin = async ({
    id,
    nbUsers,
    users,
  }) => {
    users.forEach(({ id: clientId }) => {
      if (this.connections.has(clientId)) {
        return;
      }

      const rtcPeer = new RTCPeerConnection(this.pcConfig);
      this.connections.set(clientId, rtcPeer);

      rtcPeer.onicecandidate = (event) => {
        if (event.candidate !== null) {
          SocketClient.emit(
            PEER_SIGNAL,
            clientId,
            JSON.stringify({
              ice: event.candidate,
            }),
          );
        }
      };

      rtcPeer.ontrack = ({
        track,
        streams,
      }) => {
        const [stream] = streams;
        this.store.dispatch(updateRemoteStream(stream));

        stream.onremovetrack = () => {
          console.log('onremovetrack', stream.id);
          this.store.dispatch(removeRemoteStream(stream.id));
        };
        track.onended = () => {
          console.log('onended', stream.id);
          this.store.dispatch(removeRemoteStream(stream.id));
        };
      };

      rtcPeer.onnegotiationneeded = async () => {
        const sdpOffer = await rtcPeer.createOffer();
        await rtcPeer.setLocalDescription(sdpOffer);

        SocketClient.emit(
          PEER_SIGNAL,
          clientId,
          JSON.stringify({ sdp: rtcPeer.localDescription }),
        );
      };
    });

    if (nbUsers >= 2) {
      const newPeer = this.connections.get(id);

      const sdpOffer = await newPeer.createOffer();
      await newPeer.setLocalDescription(sdpOffer);

      SocketClient.emit(
        PEER_SIGNAL,
        id,
        JSON.stringify({ sdp: newPeer.localDescription }),
      );
    }
  };

  setLocalVideoStream = async (stream) => {
    this.localVideoStream = stream;

    for (let [clientId, rtcPeer] of this.connections) {
      if (clientId === SocketClient.getClientId()) {
        continue;
      }

      SocketClient.emit(PEER_EVENT_ADD_STREAM, {
        streamId: this.localVideoStream.id,
        streamType: 'video',
      });

      stream
        .getTracks()
        .map(track => rtcPeer.addTrack(track, stream));
    }
  };

  unsetLocalVideoStream = async () => {
    if (this.localVideoStream) {
      this.localVideoStream
        .getTracks()
        .map(track => track.stop());

      SocketClient.emit(PEER_EVENT_REMOVE_STREAM, {
        streamId: this.localVideoStream.id,
      });

      this.localVideoStream = null;
    }
  };

  setLocalAudioStream = async (stream) => {
    this.localAudioStream = stream;

    for (let [clientId, rtcPeer] of this.connections) {
      if (clientId === SocketClient.getClientId()) {
        continue;
      }

      SocketClient.emit(PEER_EVENT_ADD_STREAM, {
        streamId: this.localAudioStream.id,
        streamType: 'audio',
      });

      stream
        .getTracks()
        .map((track) => rtcPeer.addTrack(track, stream));
    }
  };

  unsetLocalAudioStream = async () => {
    if (this.localAudioStream) {
      this.localAudioStream
        .getTracks()
        .map(track => track.stop());

      SocketClient.emit(PEER_EVENT_REMOVE_STREAM, {
        streamId: this.localAudioStream.id,
      });

      this.localAudioStream = null;
    }
  };

  setLocalScreenShareStream = async (stream) => {
    this.localScreenShareStream = stream;

    for (let [clientId, rtcPeer] of this.connections) {
      if (clientId === SocketClient.getClientId()) {
        continue;
      }

      SocketClient.emit(PEER_EVENT_ADD_STREAM, {
        streamId: this.localScreenShareStream.id,
        streamType: 'screen',
      });

      stream
        .getTracks()
        .map(track => rtcPeer.addTrack(track, stream));
    }
  };

  unsetLocalScreenShareStream = async () => {
    if (this.localScreenShareStream) {
      this.localScreenShareStream
        .getTracks()
        .map(track => track.stop());

      SocketClient.emit(PEER_EVENT_REMOVE_STREAM, {
        streamId: this.localScreenShareStream.id,
      });

      this.localScreenShareStream = null;
    }
  };

  onRemoveRemoteStream = ({
    streamId,
  }) => {
    this.store.dispatch(removeRemoteStream(streamId));
  };

  onPeerSignal = async (fromId, message) => {
    if (fromId === SocketClient.getClientId()) {
      return;
    }

    const signal = JSON.parse(message);
    const rtcPeer = this.connections.get(fromId);

    if (signal.sdp) {
      const sdp = new RTCSessionDescription(signal.sdp);

      if (sdp.type) {
        await rtcPeer.setRemoteDescription(sdp);
      }

      if (sdp.type === 'offer') {
        const sdpAnswer = await rtcPeer.createAnswer();
        await rtcPeer.setLocalDescription(sdpAnswer);

        SocketClient.emit(
          PEER_SIGNAL,
          fromId,
          JSON.stringify({ sdp: rtcPeer.localDescription }),
        );
      }
    }

    if (signal.ice) {
      await rtcPeer.addIceCandidate(new RTCIceCandidate(signal.ice));
    }
  };

  onPeerStreamAdded = ({
    streamId,
    streamType,
  }) => {
    this.store.dispatch(addRemoteStream({
      streamId,
      streamType,
    }));
  };

  init = () => {
    SocketClient.on(PEER_EVENT_USER_JOINED, this.onUserJoin);
    SocketClient.on(PEER_SIGNAL, this.onPeerSignal);
    SocketClient.on(PEER_EVENT_REMOVE_STREAM, this.onRemoveRemoteStream);
    SocketClient.on(PEER_EVENT_ADD_STREAM, this.onPeerStreamAdded);
  };

  disconnect = async () => {
    // Disconnect from all peers
    this.connections.forEach(peer => peer.close());

    // Clean up local streams
    await this.unsetLocalVideoStream();
    await this.unsetLocalAudioStream();
    await this.unsetLocalScreenShareStream();

    // Clean-up references to peer connection.
    this.connections.clear()

  };

  onUserLeft = (user) => {
    const { id } = user;
    const peer = this.connections.get(id);

    if (peer) {
      peer.close();
      this.connections.delete(id);
    }
  };

  setStore = (store) => {
    this.store = store;
  };
}

export default new WebRtcSession();
