/**
 * @returns {object}
 */
function scriptLoader() {
  return {
    test: /\.(js|jsx)$/,
    include: [/(src)/],
    use: "babel-loader",
    exclude: /(node_modules)/,
  };
}

/**
 * @param {boolean} isDevMode
 * @returns {object}
 */
function styleLoader(isDevMode=true) {
  return {
    test: /\.(sc|c)ss$/,
    use: [
      "style-loader",
      {
        loader: "css-loader",
        options: {
          sourceMap: isDevMode,
        },
      },
      {
        loader: "sass-loader",
        options: {
          sourceMap: isDevMode,
        }
      },
    ],
  }
};

/**
 * @param {boolean} isDevMode
 * @returns {object}
 */
function fileLoader(isDevMode=true) {
  return {
    test: /\.(png|jpg|svg)$/i,
    use: [
      {
        loader: "file-loader",
        options: {
          //  This is the name of the file itself.
          //  It will be referenced when you import it, and use it as an img src.
          name: isDevMode ? "[path][name].[ext]" : "[hash].[ext]",

          //  This is where compiled files will go.
          //  NOTE: This should not be an absolute path, because it's relative to
          //        the global webpack output path.
          outputPath: "images",
        },
      },
      {
        loader: "image-webpack-loader",
        options: {
          //  On webpack >2.0, this means that images aren't minified when using
          //  webpack-dev-server
          disable: true,
        },
      }
    ],
  };
}

module.exports = {
  scriptLoader,
  styleLoader,
  fileLoader,
}