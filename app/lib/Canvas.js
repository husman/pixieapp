import uuid from 'uuid';
import SocketClient from './SocketClient';
import {
  CANVAS_PEER_EVENT_IMAGE_CREATED,
  CANVAS_PEER_EVENT_OBJECT_DELETE,
  CANVAS_PEER_EVENT_OBJECT_MODIFIED,
  CANVAS_PEER_EVENT_PATH_CREATED,
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

  /**
   * Event handler for when we receive a new path from a peer.
   *
   * @param {{}} data - The newly created path.
   */
  onPeerCanvasPathCreated = (data) => {
    console.log('onPeerCanvasPathCreated', data);
    const {
      path,
      width,
      height,
      id,
    } = data;
    const {
      canvas,
      canvas: {
        width: activeWidth,
        height: activeHeight,
      },
    } = this;
    const xFactor = activeWidth / width;
    const yFactor = activeHeight / height;

    const p = fabric.Path.fromObject(path);
    const {
      scaleX,
      scaleY,
      left,
      top,
    } = p;
    const tempScaleX = scaleX * xFactor;
    const tempScaleY = scaleY * yFactor;
    const tempLeft = left * xFactor;
    const tempTop = top * yFactor;

    p.id = id;
    p.scaleX = tempScaleX;
    p.scaleY = tempScaleY;
    p.left = tempLeft;
    p.top = tempTop;

    p.setCoords();

    canvas.add(p);
    canvas.calcOffset();
    canvas.renderAll();
  };

  /**
   * Event handler for when we receive a new text on the canvas from a peer.
   *
   * @param {{}} data - The path corresponding to the text.
   */
  onPeerCanvasNewText = (data) => {
    const {
      path,
      width,
      height,
      id,
    } = data;
    const {
      canvas,
      canvas: {
        width: activeWidth,
        height: activeHeight,
      },
    } = this;
    const xFactor = activeWidth / width;
    const yFactor = activeHeight / height;

    const p = fabric.Path.fromObject(path);
    const originalLeft = p.left;
    const originalTop = p.top;

    const left = originalLeft * xFactor;
    const top = originalTop * yFactor;

    const text = new fabric.IText(path.text, {
      left,
      top,
      fill: path.fill,
    });
    text.id = id;

    canvas.add(text);
    canvas.renderAll();
  };

  /**
   * Event handler for when we receive a 'delete object[s]' event from a peer.
   *
   * @param {Array} ids - Array of object UUIDs.
   */
  onPeerDeleteObjects = ({ ids }) => {
    const {
      canvas,
    } = this;
    const elements = canvas
      .getObjects()
      .filter(obj => ids.indexOf(obj.id) !== -1);

    elements.forEach(elem => canvas.remove(elem));
  };

  /**
   * Event handler for when we receive a modified canvas object path from a peer.
   *
   * @param {{}} data - The path corresponding to the object.
   */
  onPeerCanvasObjectModified = (data) => {
    const {
      canvas,
    } = this;
    const {
      path,
      width,
      height,
      id,
    } = data;
    const element = canvas.getObjects().find(obj => obj.id === id);
    const isNewText = !element && path.type === 'i-text';
    const isTextEdit = element && element.text !== path.text;

    if (isNewText) {
      this.onPeerCanvasNewText({
        path,
        width,
        height,
        id,
      });
      return;
    }

    if (isTextEdit) {
      element.text = path.text;
      canvas.renderAll();
      return;
    }

    if (!element) {
      return;
    }

    const isImage = path.type === 'image';
    const {
      width: activeWidth,
      height: activeHeight,
    } = canvas;
    const xFactor = activeWidth / width;
    const yFactor = activeHeight / height;

    const p = fabric.Path.fromObject(path);
    const {
      scaleX,
      scaleY,
      left,
      top,
    } = p;

    const tempScaleX = scaleX * xFactor;
    const tempScaleY = scaleY * yFactor;
    const tempLeft = left * xFactor;
    const tempTop = top * yFactor;

    if (isImage) {
      element.scaleX = scaleX;
      element.scaleY = scaleY;
    } else {
      element.scaleX = tempScaleX;
      element.scaleY = tempScaleY;
    }

    element.left = tempLeft;
    element.top = tempTop;
    element.angle = path.angle;

    element.setCoords();

    canvas.calcOffset();
    canvas.renderAll();
  };

  /**
   * Dispatched when a peer adds an image to the canvas.
   *
   * @param {{}} data
   */
  onCanvasImageCreated = (data) => {
    const {
      canvas,
    } = this;
    const {
      path,
      width,
      height,
      id,
    } = data;
    const {
      width: activeWidth,
      height: activeHeight,
    } = canvas;
    const xFactor = activeWidth / width;
    const yFactor = activeHeight / height;
    const left = path.left * xFactor;
    const top = path.top * yFactor;
    const imgWidth = path.width * xFactor;
    const imgHeight = path.height * yFactor;

    fabric.Image.fromURL(path.src, (element) => {
      const img = element.set({
        left,
        top,
        width: imgWidth,
        height: imgHeight,
      });

      img.id = id;

      canvas.add(img);
      canvas.calcOffset();
      canvas.renderAll();
    });
  };

  /**
   * Initializes the canvas' socket events.
   */
  initRemoteEvents = () => {
    SocketClient.on(CANVAS_PEER_EVENT_PATH_CREATED, this.onPeerCanvasPathCreated);
    SocketClient.on(CANVAS_PEER_EVENT_OBJECT_MODIFIED, this.onPeerCanvasObjectModified);
    SocketClient.on(CANVAS_PEER_EVENT_OBJECT_DELETE, this.onPeerDeleteObjects);
    SocketClient.on(CANVAS_PEER_EVENT_IMAGE_CREATED, this.onCanvasImageCreated);
  };

  onAddImageToCanvas = (url) => {
    const {
      canvas,
    } = this;

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
      canvas.setActiveObject(img);

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
