const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false,
  context: path.resolve(__dirname, 'src'),
  mode: process.env.NODE_ENV,
  entry: './index.ts',
  resolve: {
    extensions: ['.js', '.ts'],
  },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    clean: true,
  },
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 4200,
    hot: true,
    static: path.resolve(__dirname, './dist'),
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.svg$/,
        use: 'svg-sprite-loader',
      },
      {
        test: /\.(png|jpg|jpeg|gif|webp)$/i,
        type: 'asset/inline',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new Dotenv(),
    new ESLintPlugin({ extensions: 'ts' }),
    new HtmlWebpackPlugin({
      template: './index.html',
      favicon: './assets/image/favicon.ico',
    }),
    new MiniCssExtractPlugin({ filename: './style.css' }), 
  ],
};