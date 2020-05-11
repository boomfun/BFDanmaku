const merge = require("webpack-merge");
const base = require("./webpack.base");
const htmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
module.exports = merge(base, {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    test: "./src/test/main.js",
  },
  devServer: {
    publicPath: "/",
    contentBase: path.resolve(__dirname, "..", "dist"),
    port: 8080,
    host: "localhost",
  },
  plugins: [
    new CopyWebpackPlugin([{ from: path.resolve(__dirname, "../src/test/video") }]),
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, "..", "src", "test", "index.html"),
    }),
  ],
});
