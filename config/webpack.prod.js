const merge = require("webpack-merge");
const base = require("./webpack.base");
const UglifyWebpackPlugin = require("uglifyjs-webpack-plugin");
module.exports = merge(base, {
  mode: "production",
  optimization: {
    minimizer: [
      new UglifyWebpackPlugin({
        parallel: 4,
        uglifyOptions: {
          output: {
            comments: /@license/i,
          },
        },
      }),
    ],
  },
});
