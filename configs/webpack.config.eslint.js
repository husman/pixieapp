/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */

/* eslint import/no-unresolved: off, import/no-self-import: off */
require('@babel/register');

module.exports = require('./webpack.config.renderer.dev.babel').default;
