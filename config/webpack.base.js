const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const outputPath = path.resolve(__dirname, "..", "dist");

module.exports = {
  entry: {
    BFDanmaku: "./src/core/index.ts",
  },
  output: {
    path: outputPath,
    filename: "[name].js",
    publicPath: "/",
  },
  resolve: { extensions: [".js", ".ts", ".json"] },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: [/node_modules/],
      },
    ],
  },
  plugins: [new CleanWebpackPlugin()],
};
