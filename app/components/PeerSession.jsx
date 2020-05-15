/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

class PeerSession {
  local = null;
  remotes = [];

  init() {
    if (!this.local) {
      this.local = new RTCPeerConnection();
    }


    this.local.addEventListener('icecandidate', handleConnection);
  }
}

export default new PeerSession();
