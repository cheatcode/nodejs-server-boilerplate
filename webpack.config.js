import webpack from "webpack";
import fs from "fs";
import path from "path";
import nodeExternals from "webpack-node-externals";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

export default {
  stats: "none",
  mode: process.env.NODE_ENV,
  target: "node",
  externals: [nodeExternals()],
  entry: "./index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.js?$/,
        loader: "babel-loader",
        exclude: [/node_modules/, path.resolve(__dirname, "dist")],
        options: {
          presets: ["@babel/preset-env"],
          plugins: [
            "@babel/plugin-transform-runtime",
            "@babel/plugin-proposal-class-properties",
            "@babel/plugin-proposal-private-methods",
          ],
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      "process.env": webpack.DefinePlugin.runtimeValue(() => {
        return JSON.stringify({
          ...process.env,
          APP_SETTINGS: fs.readFileSync(
            `./settings-${process.env.NODE_ENV}.json`,
            "utf-8"
          ),
        });
      }, [
        path.resolve(__dirname, "settings-development.json"),
        path.resolve(__dirname, "settings-staging.json"),
        path.resolve(__dirname, "settings-production.json"),
      ]),
    }),
  ],
};
