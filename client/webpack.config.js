/**
 * Project:  valueinfinity-mvp-client
 * File:     /webpack.config.js
 * Created:  2019-02-19 21:44:32
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-03-16 17:25:52
 * Editor:   Darrin Tisdale
 */
/* eslint jsx-control-statements/jsx-jcs-no-undef: "off" */
module.exports = {
  entry: "./src/App.js",
  output: {
    path: __dirname + "/build/js",
    filename: "build.js"
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: "./node_modules/", loader: "babel-loader" }
    ]
  },
  eslint: {
    emitError: true,
    emitWarning: true,
    failOnError: true,
    failOnWarning: false
  }
};
