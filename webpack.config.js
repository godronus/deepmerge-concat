const path = require('path');
require('@babel/polyfill');

const lib = {
  entry: [
    '@babel/polyfill',
    // entry point of our app
    './index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'lib.js'
  },
  target: "web",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};

module.exports = [ lib ];