/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

import React from 'react';
import PropTypes from 'prop-types';

export default class Audio extends React.Component {
  /**
   * @inheritDoc
   */
  componentWillUnmount() {
    if (this.audio) {
      // https://developer.mozilla.org/de/docs/Web/HTML/Using_HTML5_audio_and_video#Stopping_the_download_of_media
      this.audio.pause();
      this.audio.src = '';
      this.audio.srcObject = null;
    }
  }

  /**
   * Initializes the audio.
   *
   * @param {HTMLElement} audio - The audio DOM element.
   */
  onInit = (audio) => {
    const {
      onInit,
    } = this.props;

    this.audio = audio;

    if (audio && onInit) {
      onInit(audio);
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
      <audio
        autoPlay={autoPlay}
        ref={this.onInit}
        className={className}
      >
        Your device does not support audios.
      </audio>
    );
  }
}

Audio.defaultProps = {
  autoPlay: false,
  className: undefined,
  onInit: undefined,
};

Audio.propTypes = {
  autoPlay: PropTypes.bool,
  className: PropTypes.string,
  onInit: PropTypes.func,
};
