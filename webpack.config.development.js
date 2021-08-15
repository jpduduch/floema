const { merge } = require('webpack-merge') /* a variável dentro dos { } é uma novidade do ES6 que refere a um objeto do conteúdo declarado. No exemplo acima, basicametne está compilando require('webpack-merge').merge */

const path = require('path')

const config = require('./webpack.config')

module.exports = merge(config, {
  mode: 'development',
  devtool: 'inline-source-map',

  devServer: {
    writeToDisk: true
  },

  output: {
    path: path.resolve(__dirname, 'public')
  }
})
