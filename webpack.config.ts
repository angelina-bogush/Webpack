import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import TerserPlugin from "terser-webpack-plugin";
import autoprefixer from "autoprefixer";
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import ReactRefreshTypeScript from 'react-refresh-typescript'

type Mode = "production" | "development";
interface IEnvVariables {
  mode: Mode;
  port: number;
}
export default (env: IEnvVariables) => {
  const isDev = env.mode === "development";

  const config: webpack.Configuration = {
    mode: env.mode ?? "development",
    entry: path.resolve(__dirname, "src", "index.tsx"),
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "[name].[contenthash].js",
      clean: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public", "index.html"),
      }),
      new webpack.ProgressPlugin(),
      new MiniCssExtractPlugin(),
      isDev && new ReactRefreshWebpackPlugin()
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          // use: "ts-loader",
          exclude: /node_modules/,
          use:[
            {
              loader: "ts-loader",
              options:{
                getCustomTransformers: () => ({
                  before: [isDev && ReactRefreshTypeScript()].filter(Boolean),
                }),
              }
            }
          ]
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins: [isDev && require.resolve('react-refresh/babel')].filter(Boolean),
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
              ],
            },
          },
        },  
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: isDev
                    ? "[path][name]__[local]"
                    : "[hash:base64:8]",
                },
              },
            },
            "postcss-loader",
            "sass-loader",
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: "@svgr/webpack",
              options: {
                icon: true,
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    devtool: "inline-source-map",
    devServer: {
      port: env.port ?? 8080,
      open: true,
      hot: true
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
  };
  return config;
};
