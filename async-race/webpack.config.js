const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const EslintPlugin = require("eslint-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    main: path.resolve(__dirname, "./src/index.ts"),
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: (assetsPath) => {
      const assetDest = path.dirname(assetsPath.filename).split("/").slice(1).join("/");
      return `${assetDest}/[name].[ext]`;
    },
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.ts$/i,
        use: "ts-loader",
      },
      {
        test: /\.(png|jpg|svg|ico)$/,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new EslintPlugin({ extensions: "ts" }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/index.html"),
      filename: "index.html",
      favicon: path.resolve(__dirname, "./src/assets/icons/favicon.svg"),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "src/assets/car",
          to: "assets/car",
        },
        {
          from: "src/assets/icons",
          to: "assets/icons",
        },
      ],
    }),
  ],
};
