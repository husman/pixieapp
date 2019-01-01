/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

/**
 * The default drawing color.
 *
 * @type {String}
 */
export const CANVAS_DEFAULT_DRAWING_COLOR = '#ccff00';

/**
 * The default drawing stroke width.
 *
 * @type {Number}
 */
export const CANVAS_DEFAULT_STROKE_WIDTH = 3;

/**
 * This peer event is dispatched when a new path is created on the canvas.
 *
 * @type {String}
 */
export const CANVAS_PEER_EVENT_PATH_CREATED = 'canvas:path:created';

/**
 * This event is dispatched by the canvas when a new path is created on the canvas.
 *
 * @type {String}
 */
export const CANVAS_PATH_CREATED = 'path:created';

/**
 * This event is dispatched by the canvas when an object is modified.
 *
 * @type {String}
 */
export const CANVAS_OBJECT_MODIFIED = 'object:modified';

/**
 * This peer event is dispatched when an object is modified on the canvas.
 *
 * @type {String}
 */
export const CANVAS_PEER_EVENT_OBJECT_MODIFIED = 'canvas:object:modified';

/**
 * This peer event is dispatched when object[s] are deleted on the canvas.
 *
 * @type {String}
 */
export const CANVAS_PEER_EVENT_OBJECT_DELETE = 'canvas:object:delete';

/**
 * DOM element type for the 'text' field.
 *
 * @type {string}
 */
export const ELEMENT_TYPE_TEXT = 'text';

/**
 * DOM element type for the 'textarea' field.
 *
 * @type {string}
 */
export const ELEMENT_TYPE_TEXTAREA = 'textare';

/**
 * List of DOM text field types.
 *
 * @type {Set<any>}
 */
export const CANVAS_TEXT_ELEMENT_TYPES = new Set([
  ELEMENT_TYPE_TEXT,
  ELEMENT_TYPE_TEXTAREA,
]);
