const path = require('path')

const mode = process.env.NODE_ENV === 'dev' ? 'development' : 'production'

module.exports = {
  mode,
  entry: './src/main.ts',
  target: 'node',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      { test: /\.ts/, loader: 'ts-loader' }
    ]
  }
}