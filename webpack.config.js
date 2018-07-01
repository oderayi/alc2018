// webpack.config.js
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractCSS = new ExtractTextPlugin({ filename: '[name].[chunkhash].css' })

module.exports = {
  entry: "./src/index.js",
  output: {
    path: __dirname + "/docs",
    filename: "[chunkhash].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!(autotrack))/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env"]
          }
        }
      },
      {
        test: /\.css$/,
        use: extractCSS.extract({
          use: ["css-loader?name=[hash].[ext]"],
          fallback: "style-loader?name=[hash].[ext]"
        })
      },
      {
        test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/,
        use: [
          {
            loader: "file-loader?name=[hash].[ext]"
          }
        ]
      },
      {
        test: /\.(png|jpg|ico|xml|json)$/,
        use: [
          {
            loader: "file-loader?name=[hash].[ext]"
          }
        ]
      }
    ]
  },
  plugins: [
    extractCSS,
    new HtmlWebpackPlugin({
      title: "Currency Converter",
      filename: "index.html",
      template: "./src/index.html",
      inject: true,
      hash: true,
      env: {
        Prod: true,
        Dev: false
      },
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new webpack.ProvidePlugin({
      $: "jquery/dist/jquery.min",
      jQuery: "jquery/dist/jquery.min",
      "window.jQuery": "jquery/dist/jquery.min",
      Popper: "popper.js/dist/umd/popper.min",
      "window.Popper": "popper.js/dist/umd/popper.min",
      Tether: "tether/dist/js/tether.min",
      Waves: "node-waves/dist/waves.min.js"
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        title: JSON.stringify("Currency Converter")
      }
    })
  ]
};
