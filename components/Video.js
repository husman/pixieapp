/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

import React from 'react';

export default class Video extends React.Component {
  /**
   * @inheritDoc
   */
  componentWillUnmount() {
    if (this.video) {
      // https://developer.mozilla.org/de/docs/Web/HTML/Using_HTML5_audio_and_video#Stopping_the_download_of_media
      this.video.pause();
      this.video.src = '';
      this.video.srcObject = null;
    }
  }

  /**
   * Initializes the video.
   *
   * @param {HTMLElement} video - The video DOM element.
   */
  onInit = (video) => {
    const {
      onInit,
    } = this.props;

    this.video = video;

    if (video && onInit) {
      onInit(video);
    }
  };

  /**
   * @inheritDoc
   */
  render() {
    const {
      autoPlay,
      className,
    } = this.props;

    return (
        <video
            autoPlay={autoPlay}
            ref={this.onInit}
            className={className}
        >
          Your device does not support videos.
        </video>
    );
  }
};
