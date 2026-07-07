/**
 * video.tutor.webrtc.engine.js
 * UniMentorAI - WebRTC Core Engine (Zoom-grade foundation)
 */

class VideoTutorWebRTCManager {
  constructor({
    eventBus,
    logger,
    networkOptimizer,
    signalingClient
  }) {
    this.eventBus = eventBus;
    this.logger = logger;

    this.networkOptimizer = networkOptimizer;
    this.signaling = signalingClient;

    this.peers = new Map(); // userId -> RTCPeerConnection
    this.localStream = null;
  }

  /**
   * 🎥 INIT LOCAL MEDIA
   */
  async initLocalStream(constraints = {
    video: true,
    audio: true
  }) {
    try {
      this.localStream =
        await navigator.mediaDevices.getUserMedia(constraints);

      this.eventBus.emit("webrtc.local_stream.ready", {
        tracks: this.localStream.getTracks().length
      });

      return this.localStream;

    } catch (err) {
      this.logger.error("Local stream error", err);
      throw err;
    }
  }

  /**
   * 🤝 CREATE PEER CONNECTION
   */
  createPeer(userId, config = {}) {
    const pc = new RTCPeerConnection({
      iceServers: config.iceServers || [
        { urls: "stun:stun.l.google.com:19302" }
      ]
    });

    // Add local tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream);
      });
    }

    // ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.signaling.send({
          type: "ice-candidate",
          userId,
          candidate: event.candidate
        });
      }
    };

    // Remote stream
    pc.ontrack = (event) => {
      this.eventBus.emit("webrtc.remote_stream", {
        userId,
        stream: event.streams[0]
      });
    };

    // Connection state
    pc.onconnectionstatechange = () => {
      this._handleConnectionState(userId, pc.connectionState);
    };

    this.peers.set(userId, pc);

    return pc;
  }

  /**
   * 📤 CREATE OFFER
   */
  async createOffer(userId) {
    const pc = this._getPeer(userId);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    this.signaling.send({
      type: "offer",
      userId,
      offer
    });

    return offer;
  }

  /**
   * 📥 HANDLE ANSWER
   */
  async handleAnswer(userId, answer) {
    const pc = this._getPeer(userId);

    await pc.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  }

  /**
   * 📡 HANDLE ICE CANDIDATE
   */
  async handleIceCandidate(userId, candidate) {
    const pc = this._getPeer(userId);

    await pc.addIceCandidate(
      new RTCIceCandidate(candidate)
    );
  }

  /**
   * 🔁 RECONNECT LOGIC
   */
  async reconnect(userId) {
    this.logger.warn("Reconnecting peer", userId);

    this.closePeer(userId);

    const pc = this.createPeer(userId);

    await this.createOffer(userId);

    this.eventBus.emit("webrtc.reconnected", {
      userId
    });
  }

  /**
   * ❌ CLOSE PEER
   */
  closePeer(userId) {
    const pc = this.peers.get(userId);

    if (pc) {
      pc.close();
      this.peers.delete(userId);
    }
  }

  /**
   * ⚙️ NETWORK ADAPTATION HOOK
   */
  adaptToNetwork(userId) {
    const quality =
      this.networkOptimizer.getQuality?.() || 1;

    const pc = this._getPeer(userId);

    const senders = pc.getSenders();

    senders.forEach(sender => {
      const params = sender.getParameters();

      if (!params.encodings) return;

      params.encodings.forEach(enc => {
        enc.maxBitrate =
          quality > 0.7
            ? 2500000
            : quality > 0.4
            ? 1000000
            : 300000;
      });

      sender.setParameters(params);
    });
  }

  /**
   * 📊 CONNECTION STATE HANDLER
   */
  _handleConnectionState(userId, state) {
    this.eventBus.emit("webrtc.state.change", {
      userId,
      state
    });

    if (state === "failed") {
      this.reconnect(userId);
    }

    if (state === "disconnected") {
      this.logger.warn("Peer disconnected", userId);
    }
  }

  /**
   * 🔍 GET PEER
   */
  _getPeer(userId) {
    const pc = this.peers.get(userId);

    if (!pc) {
      return this.createPeer(userId);
    }

    return pc;
  }

  /**
   * 📡 SNAPSHOT
   */
  getState() {
    return {
      peers: this.peers.size,
      hasLocalStream: !!this.localStream
    };
  }
}

module.exports =
  VideoTutorWebRTCManager;
