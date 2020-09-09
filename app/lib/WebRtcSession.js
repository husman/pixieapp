/**
 * Copyright 2020 Neetos LLC. All rights reserved.
 */
import SocketClient from './SocketClient';
import {
  PEER_EVENT_USER_JOINED,
  PEER_EVENT_REMOVE_STREAM,
  PEER_SIGNAL,
  PEER_EVENT_ADD_STREAM,
  PEER_EVENT_SCREEN_SHARE_STREAM_ID,
} from '../constants/chat';
import {
  addRemoteStream,
  removeRemoteStream,
  setScreenShareScreenId,
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
        this.store.dispatch(addRemoteStream(stream));

        stream.onremovetrack = () => {
          this.store.dispatch(removeRemoteStream(stream.id));
        };
        track.onended = () => {
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

      this.sendVideoStreamsToPeers(clientId);
      this.sendAudioStreamsToPeers(clientId);
      this.sendScreenShareStreamToPeers(clientId);
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

    this.sendVideoStreamsToPeers();
  };

  unsetLocalVideoStream = async () => {
    if (!this.localVideoStream) {
      return;
    }

    for (let [clientId, rtcPeer] of this.connections) {
      if (clientId === SocketClient.getClientId()) {
        continue;
      }

      if (this.isConnectionOnline(rtcPeer)) {
        rtcPeer
          .getSenders()
          .forEach((sender) => {
            if (sender.track && sender.track.kind === 'video') {
              rtcPeer.removeTrack(sender);
            }
          });
      }
    }

    this.localVideoStream
      .getTracks()
      .map(track => track.stop());

    this.localVideoStream = null;
  };

  sendVideoStreamsToPeers = (clientId) => {
    const stream = this.localVideoStream;

    if (!stream) {
      return;
    }

    if (clientId) {
      const rtcPeer = this.connections.get(clientId);

      stream
        .getTracks()
        .map(track => rtcPeer.addTrack(track, stream));

      return;
    }

    for (let [clientId, rtcPeer] of this.connections) {
      if (clientId === SocketClient.getClientId()) {
        continue;
      }

      stream
        .getTracks()
        .map(track => rtcPeer.addTrack(track, stream));
    }
  };

  setLocalAudioStream = async (stream) => {
    this.localAudioStream = stream;

    this.sendAudioStreamsToPeers();
  };

  unsetLocalAudioStream = async () => {
    if (!this.localAudioStream) {
      return;
    }

    for (let [clientId, rtcPeer] of this.connections) {
      if (clientId === SocketClient.getClientId()) {
        continue;
      }

      if (this.isConnectionOnline(rtcPeer)) {
        rtcPeer
          .getSenders()
          .forEach((sender) => {
            if (sender.track && sender.track.kind === 'audio') {
              rtcPeer.removeTrack(sender);
            }
          });
      }
    }

    this.localAudioStream
      .getTracks()
      .map(track => track.stop());

    this.localAudioStream = null;
  };

  isConnectionOnline = (rtcPeer) => {
    const onlineStates = new Set([
      'new',
      'connecting',
      'connected',
    ]);

    return rtcPeer && onlineStates.has(rtcPeer.connectionState);
  };

  sendAudioStreamsToPeers = (clientId) => {
    const stream = this.localAudioStream;

    if (!stream) {
      return;
    }

    if (clientId) {
      const rtcPeer = this.connections.get(clientId);

      if (this.isConnectionOnline(rtcPeer)) {
        stream
          .getTracks()
          .map(track => rtcPeer.addTrack(track, stream));
      }

      return;
    }

    for (let [clientId, rtcPeer] of this.connections) {
      if (clientId === SocketClient.getClientId()) {
        continue;
      }

      stream
        .getTracks()
        .map(track => rtcPeer.addTrack(track, stream));
    }
  };

  setLocalScreenShareStream = async (stream) => {
    this.localScreenShareStream = stream;

    this.sendScreenShareStreamToPeers();
  };

  unsetLocalScreenShareStream = async () => {
    if (!this.localScreenShareStream) {
      return;
    }

    for (let [clientId, rtcPeer] of this.connections) {
      if (clientId === SocketClient.getClientId()) {
        continue;
      }

      if (this.isConnectionOnline(rtcPeer)) {
        rtcPeer
          .getSenders()
          .forEach((sender) => {
            if (sender.track && sender.track.kind === 'video') {
              rtcPeer.removeTrack(sender);
            }
          });
      }
    }

    this.localScreenShareStream
      .getTracks()
      .map(track => track.stop());

    this.localScreenShareStream = null;
  };

  sendScreenShareStreamToPeers = (clientId) => {
    const stream = this.localScreenShareStream;

    if (!stream) {
      return;
    }

    if (clientId) {
      const rtcPeer = this.connections.get(clientId);

      if (this.isConnectionOnline(rtcPeer)) {
        stream
          .getTracks()
          .map(track => {
            rtcPeer.addTrack(track, stream);

            SocketClient.emit(
              PEER_EVENT_SCREEN_SHARE_STREAM_ID,
              stream.id,
            );
          });
      }

      return;
    }

    for (let [clientId, rtcPeer] of this.connections) {
      if (clientId === SocketClient.getClientId()) {
        continue;
      }

      stream
        .getTracks()
        .map(track => {
          rtcPeer.addTrack(track, stream);

          SocketClient.emit(
            PEER_EVENT_SCREEN_SHARE_STREAM_ID,
            stream.id,
          );
        });
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

  onScreenShareId = (streamId) => {
    this.store.dispatch(setScreenShareScreenId(streamId));
  };

  init = () => {
    SocketClient.on(PEER_EVENT_USER_JOINED, this.onUserJoin);
    SocketClient.on(PEER_SIGNAL, this.onPeerSignal);
    SocketClient.on(PEER_EVENT_REMOVE_STREAM, this.onRemoveRemoteStream);
    SocketClient.on(PEER_EVENT_ADD_STREAM, this.onPeerStreamAdded);
    SocketClient.on(PEER_EVENT_SCREEN_SHARE_STREAM_ID, this.onScreenShareId);
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
