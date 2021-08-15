const path = require('path') /* busca o path da aplicação e atribui aos comandos path.etc */
const Webpack = require('webpack')

/* Webpack é um compilador que consegue juntar todos os arquivos src como .sass e .js e gerar os outputs a serem lidos pelo browser */

const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin') /* Puxa todos os estilos css de um js e compila num arquivo css, evitando o problema css in js */
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')

const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev'

const dirApp = path.join(__dirname, 'app')
const dirImages = path.join(__dirname, 'images')
const dirShared = path.join(__dirname, 'shared')
const dirStyles = path.join(__dirname, 'styles')
const dirVideos = path.join(__dirname, 'videos')
const dirNode = 'node_modules'

/* estas 3 linhas de código são as pastas onde estarão os arquivos do projeto */

// console.log(dirApp, dirShared, dirStyles)

// module exports é o comando que exporta as funções etc geradas aqui para serem usadas por outros arquivos

module.exports = {
  entry: [
    path.join(dirApp, 'index.js'),
    path.join(dirStyles, 'index.scss')
  ],

  resolve: {
    modules: [
      dirApp,
      dirImages,
      dirShared,
      dirStyles,
      dirVideos,
      dirNode
    ]
  },

  plugins: [
    new Webpack.DefinePlugin({
      IS_DEVELOPMENT
    }),

    new CleanWebpackPlugin(),

    // new Webpack.ProvidePlugin({
    // // uma forma de importar libraries para seu projeto. só incluir aqui dentro que já era. o lado ruim é que pode começar a deixar seu projeto pesado se vc perder o controle
    // }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: './shared',
          to: ''
        }
      ]

    }),

    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        // Lossless optimization with custom option
        // Feel free to experiment with options for better result for you
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['jpegtran', { progressive: true }],
          ['optipng', { optimizationLevel: 5 }]
        ]
      }
    })
  ],

  module: {
    rules: [
      { // js
        test: /\.js$/,
        use: { loader: 'babel-loader' }
      },

      { // css
        test: /\.scss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader, options: { publicPath: '' } },
          { loader: 'css-loader' }, // extrai css de js e coloca no código final
          { loader: 'postcss-loader' }, // converte automaticamente css não compatível com navegadores antigos -ex.: quando algumas propriedades precisam vir com o -webkit- ou o -moz- -
          { loader: 'sass-loader' }
        ]
      },

      { // imagens
        test: /\.(jpe?g|png|gif|svg|woff2?|fnt|webp)$/,
        loader: 'file-loader',
        options: {
          // outputPath: 'images', //coloca numa subpasta
          name (file) {
            return '[hash].[ext]'
          }
        }
      },

      { // minifier
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: ImageMinimizerPlugin.loader
          }
        ]
      },
      { // webGL
        test: /\.(glsl|frag|vert)$/,
        loader: 'glslify-loader',
        exclude: /node_modules/
      },
      { // webGL
        test: /\.(glsl|frag|vert)$/,
        loader: 'raw-loader',
        exclude: /node_modules/
      }
    ]
  }
}
