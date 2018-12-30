const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    electron: [
      './electron.js',
    ],
    app: [
      './app.jsx',
    ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: [
    nodeExternals(),
  ],
  resolve: {
    extensions: [
      '.js',
      '.jsx',
    ],
    modules: [
      path.join(__dirname), // root
    ],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  'electron',
                ],
                'react',
                'stage-0',
              ],
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
            },
            {
              loader: 'sass-loader',
            },
          ],
          fallback: 'style-loader',
        }),
      },
      {
        test: /.(jpg|jpeg|png|gif|woff(2)?|eot|otf|ttf|svg|pdf|csv)(\?[a-z0-9=.]+)?$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: 'electron',
      },
    }),
    new ExtractTextPlugin('styles.css'),
    new webpack.NamedModulesPlugin(),
  ],
  devtool: 'inline-source-map',
};
