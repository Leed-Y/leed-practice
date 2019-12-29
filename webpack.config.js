const path = require('path');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = {
  entry: {
    snowfall: './src/snowfall/index.js',
    goeyfooter: './src/goeyfooter/index.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist/')
  },
  devServer: {
    contentBase: './dist'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.pug$/,
        use: ['html-loader?interpolate', 'pug-html-loader']
      },
      {
        test: /\.(sa|sc|c)ss$/,
        // This compiles styles from Semantic-UI
        use: [MiniCssExtractPlugin.loader,"css-loader",'sass-loader']
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      allChunks: true
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/snowfall/index.html',
      filename: 'snowfall.html',
      minify: {
        collapseWhitespace: true,
      },
      chunks: ['manifest', 'vendor', 'snowfall']
    }),
    new HtmlWebpackPlugin({
      template: './src/goeyfooter/index.pug',
      filename: 'goeyfooter.html',
      minify: {
        collapseWhitespace: true,
      },
      chunks: ['manifest', 'vendor']
    })]
};