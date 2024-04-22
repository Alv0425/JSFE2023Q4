const { merge } = require("webpack-merge");
const common = require("./webpack.config.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",

  devServer: {
    static: "./dist",
    open: true,
    host: "localhost",
    port: 7000,
    hot: true,
    historyApiFallback: true,
  },
});
