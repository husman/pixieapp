import uuid from 'uuid';
import SocketClient from './SocketClient';
import {
  CANVAS_PEER_EVENT_IMAGE_CREATED,
} from '../constants/canvas';

/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

class Canvas {
  canvas = null;

  /**
   * Initializes the canvas reference.
   *
   * @param {{}} canvas - The canvas reference.
   */
  init(canvas) {
    if (!canvas) {
      return;
    }

    this.canvas = canvas;
  }

  onAddImageToCanvas = (url) => {
    const {
      canvas,
    } = this;

    console.error('onAddImageToCanvas(...)', canvas);

    if (!canvas) {
      return;
    }

    fabric.Image.fromURL(url, (element) => {
      const ratio = element.width / element.height;
      let width = canvas.width / 2;
      let height = canvas.height / 2;

      if (element.width > element.height) {
        height = width / ratio;
      } else {
        width = height * ratio;
      }

      const imgLeft = (canvas.width - width) / 2;
      const imgTop = (canvas.height - height) / 2;

      const img = element.set({
        left: imgLeft,
        top: imgTop,
        width,
        height,
      });

      img.id = uuid.v4();

      canvas.add(img);

      const data = {
        path: {
          left: imgLeft,
          top: imgTop,
          width,
          height,
          src: url,
        },
        width: canvas.width,
        height: canvas.height,
        id: img.id,
      };

      SocketClient.emit(CANVAS_PEER_EVENT_IMAGE_CREATED, data);
    });
  };
}

export default new Canvas();
