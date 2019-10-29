const path = require('path')
const fs = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')

const PATHS = {
  src: path.resolve(__dirname, '../src'),
  dist: path.resolve(__dirname, '../dist'),
  assets: 'assets/'
}

const PAGES_DIR = `${PATHS.src}/pages/`

// Getting all sub directories of "PAGES_DIR"
const FOLDERS = fs.readdirSync(PAGES_DIR).map(__dirname => path.join(PAGES_DIR, __dirname))

// Getting ABSOLUTE pathes to all .pug files of all sub directories
const PAGES = (FOLDERS.map(folder => fs.readdirSync(folder).filter(fileName => fileName.endsWith('.pug')).map(fileName => path.join(folder, fileName)))).flat();

module.exports = {
  externals: {
    paths: PATHS,
  },
  entry: {
    main: `${PATHS.src}/main.js`,
  },
  output: {
    filename: `${PATHS.assets}js/[name].js`,
    path: PATHS.dist,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/',
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          pretty: true,
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        exclude: [/fonts/],
        loader: 'file-loader',
        options: {
          name: `${PATHS.assets}img/[name].[ext]`
        },
      },
      {
        test: /\.(woff(2)?|ttf|otf|eot|svg)$/,
        include: [/fonts/],
        loader: 'file-loader',
        options: {
          name: `${PATHS.assets}fonts/[name].[ext]`,
          publicPath: `../../`
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true, config: {path: 'build/postcss.config.js'} },
          },
          {
            loader: 'resolve-url-loader'
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${PATHS.assets}css/[name].css`,
    }),
    ...PAGES.map(page => new HtmlWebpackPlugin({
      template: page,
      filename: `./${path.basename(page).replace(/\.pug/,'.html')}`
    })),
    // new CopyWebpackPlugin([
    //   {from: `${PATHS.src}/img`, to: `${PATHS.assets}img` },
    // ]),
  ],
}
