/**
 * video.tutor.media.stream.manager.js
 * UniMentorAI - Media Stream Manager (Audio/Video Core Layer)
 */

class VideoTutorMediaStreamManager {
  constructor({
    eventBus,
    logger
  }) {
    this.eventBus = eventBus;
    this.logger = logger;

    this.localStream = null;
    this.audioTrack = null;
    this.videoTrack = null;

    this.devices = {
      audioInputs: [],
      videoInputs: []
    };
  }

  /**
   * 🎥 INIT MEDIA STREAM
   */
  async initStream(constraints = {
    video: true,
    audio: true
  }) {
    try {
      this.localStream =
        await navigator.mediaDevices.getUserMedia(constraints);

      this._extractTracks();

      this.eventBus.emit("media.stream.ready", {
        audio: !!this.audioTrack,
        video: !!this.videoTrack
      });

      return this.localStream;

    } catch (err) {
      this.logger.error("Media init failed", err);
      throw err;
    }
  }

  /**
   * 🎧 EXTRACT TRACKS
   */
  _extractTracks() {
    if (!this.localStream) return;

    this.audioTrack = this.localStream.getAudioTracks()[0] || null;
    this.videoTrack = this.localStream.getVideoTracks()[0] || null;
  }

  /**
   * 🔇 MUTE / UNMUTE AUDIO
   */
  toggleAudio(enable = true) {
    if (!this.audioTrack) return;

    this.audioTrack.enabled = enable;

    this.eventBus.emit("media.audio.toggle", {
      enabled: enable
    });
  }

  /**
   * 📹 ENABLE / DISABLE VIDEO
   */
  toggleVideo(enable = true) {
    if (!this.videoTrack) return;

    this.videoTrack.enabled = enable;

    this.eventBus.emit("media.video.toggle", {
      enabled: enable
    });
  }

  /**
   * 🔁 SWITCH CAMERA
   */
  async switchCamera(deviceId) {
    if (!this.videoTrack) return;

    const newStream =
      await navigator.mediaDevices.getUserMedia({
        video: { deviceId },
        audio: false
      });

    const newVideoTrack =
      newStream.getVideoTracks()[0];

    const oldTrack = this.videoTrack;

    this.localStream.removeTrack(oldTrack);
    this.localStream.addTrack(newVideoTrack);

    this.videoTrack = newVideoTrack;

    oldTrack.stop();

    this.eventBus.emit("media.camera.switched", {
      deviceId
    });
  }

  /**
   * 🎧 SWITCH MICROPHONE
   */
  async switchMicrophone(deviceId) {
    const newStream =
      await navigator.mediaDevices.getUserMedia({
        audio: { deviceId },
        video: false
      });

    const newAudioTrack =
      newStream.getAudioTracks()[0];

    const oldTrack = this.audioTrack;

    this.localStream.removeTrack(oldTrack);
    this.localStream.addTrack(newAudioTrack);

    this.audioTrack = newAudioTrack;

    oldTrack.stop();

    this.eventBus.emit("media.microphone.switched", {
      deviceId
    });
  }

  /**
   * 📊 GET DEVICE LIST
   */
  async updateDeviceList() {
    const devices =
      await navigator.mediaDevices.enumerateDevices();

    this.devices.audioInputs =
      devices.filter(d => d.kind === "audioinput");

    this.devices.videoInputs =
      devices.filter(d => d.kind === "videoinput");

    return this.devices;
  }

  /**
   * 🔁 REPLACE TRACK (WebRTC INTEGRATION)
   */
  replaceTrack(peerConnection, type = "video") {
    if (!peerConnection) return;

    const sender =
      peerConnection.getSenders().find(s =>
        s.track && s.track.kind === type
      );

    if (!sender) return;

    const newTrack =
      type === "video"
        ? this.videoTrack
        : this.audioTrack;

    if (newTrack) {
      sender.replaceTrack(newTrack);
    }
  }

  /**
   * ⚙️ ATTACH STREAM TO ELEMENT
   */
  attachToElement(videoElement) {
    if (!videoElement) return;

    videoElement.srcObject = this.localStream;

    this.eventBus.emit("media.attached", {
      element: true
    });
  }

  /**
   * 📡 SNAPSHOT
   */
  getState() {
    return {
      hasStream: !!this.localStream,
      audioEnabled: !!this.audioTrack?.enabled,
      videoEnabled: !!this.videoTrack?.enabled,
      devices: this.devices
    };
  }
}

module.exports =
  VideoTutorMediaStreamManager;
