const path = require('path');

const config = {
  entry: './src/index.ts',
  output: {
    path: __dirname + '/out',
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      "@model": __dirname + "/src/model",
      "@view": __dirname + "/src/view",
      "@controller": __dirname + "/src/controller",

      "@item": __dirname + "/src/item",
      "@interceptor": __dirname + "/src/interceptor",
      "@texture": __dirname + "/src/texture",
      "@animation": __dirname + "/src/animation",
      "@event": __dirname + "/src/event",

      "@util": __dirname + "/src/util",
    }
  },
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ['ts-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    port: 3000,
  }
}

module.exports = config

