// const merge = require("webpack-merge");
// const path = require("path");
// const base = require("./base");
// const TerserPlugin = require("terser-webpack-plugin");

// module.exports = merge(base, {
//   mode: "production",
//   output: {
//     filename: "bundle.min.js"
//   },
//   devtool: false,
//   performance: {
//     maxEntrypointSize: 900000,
//     maxAssetSize: 900000
//   },
//   optimization: {
//     minimizer: [
//       new TerserPlugin({
//         terserOptions: {
//           output: {
//             comments: false
//           }
//         }
//       })
//     ]
//   }
// });

// webpack/prod.js
const { merge } = require('webpack-merge');
const path = require('path');
const baseConfig = require('./base');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle.min.js'
  },
  optimization: {
    minimizer: [new TerserPlugin({
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    })],
  },
});
