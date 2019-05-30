require('@babel/polyfill');
const path = require('path');
const libraryName = 'deepmerge';
const outputFile = libraryName + '.js'

const lib = {
  entry: [
    // '@babel/polyfill',
    './index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
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