/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

import { Tools } from 'react-sketch';
import canvas from '../../../app/reducers/canvas';
import { setCanvasTool } from '../../../app/actions/canvas';

describe('actions', () => {
  describe('#setCanvasTool', () => {
    it('should default to the pencil tool', () => {
      const state = canvas(undefined, {});

      expect(state.tool).toBe(Tools.Pencil);
    });

    it('should update the active tool', () => {
      const state = canvas({}, setCanvasTool(Tools.Text));

      expect(state.tool).toBe(Tools.Text);
    });
  });
});
