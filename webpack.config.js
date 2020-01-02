const HTMLWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const webpackLoaders = require(path.resolve("webpack-config/loaders"));

const isDevMode = true;
const config = {
  mode: isDevMode ? "development" : "production",

  devServer: {
    inline: true,
    port: 8000,
  },

  entry: [
    path.resolve("src/index.jsx"),
  ],
  output: {
    publicPath: "/",    //  Source: https://stackoverflow.com/a/56702327
    
    path: path.resolve("dist"),
    filename: "[name].js",
  },

  module: {
    rules: [
      webpackLoaders.scriptLoader(),
      webpackLoaders.fileLoader(isDevMode),
      webpackLoaders.styleLoader(isDevMode)
    ]
  },

  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve("public/index.html"),
    }),
  ]
};

module.exports = config;