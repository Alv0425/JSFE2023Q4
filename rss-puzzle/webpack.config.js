const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const EslintPlug = require("eslint-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { merge } = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const base = {
  entry: path.resolve(__dirname, "./src/index"),
  mode: "development",
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
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "./dist"),
    assetModuleFilename: (assetsPath) => {
      const assetDest = path.dirname(assetsPath.filename).split("/").slice(1).join("/");
      return `${assetDest}/[name].[ext]`;
    },
  },
  plugins: [
    new EslintPlug({ extensions: "ts" }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/index.html"),
      filename: "index.html",
      favicon: path.resolve(__dirname, "./src/assets/icons/favicon.svg"),
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: "src/components/data",
          to: "assets/data",
        },
        {
          from: "src/assets/background",
          to: "assets/background",
        },
        {
          from: "src/assets/icons",
          to: "assets/icons",
        },
      ],
    }),
  ],
};

module.exports = ({ mode }) => {
  if (mode === "prod") return merge(base, require("./webpack.prod.config"));
  return merge(base, require("./webpack.dev.config"));
};
