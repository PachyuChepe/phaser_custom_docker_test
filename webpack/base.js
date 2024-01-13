const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: "raw-loader"
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml)$/i,
        use: "file-loader"
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, "../")
    }),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    }),
    new HtmlWebpackPlugin({
      template: "./index.html"
    })
  ],
  devServer: {
    // 모든 호스트에서의 접근을 허용
    host: '0.0.0.0',
    disableHostCheck: true,
  }
    // devServer 설정 추가
    // devServer: {
    //   host: '0.0.0.0', // 모든 네트워크 인터페이스에서 들어오는 요청을 수락
    //   port: 8080, // 사용할 포트 번호 (선택적)
    //   disableHostCheck: true, // 호스트 체크 비활성화
    //   contentBase: path.join(__dirname, "public"), // 정적 파일 경로 (선택적)
    //   publicPath: '/', // 번들에 접근하기 위한 경로 (선택적)
    //   hot: true // 핫 모듈 교체 활성화 (선택적)
    // }
};
