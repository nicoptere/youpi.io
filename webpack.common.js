const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const output_dir = path.resolve(__dirname, 'dist')

module.exports = {

    entry: {
        app: [
            './src/main.js'
        ]
    },
    output: {
        filename: 'js/[name].js',
        path: output_dir
    },
    plugins: [

        new CleanWebpackPlugin(),
        new CopyPlugin([
            { from: 'contents/', to: output_dir },
            { from: 'src/html/index.html', to: output_dir }
        ]),
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
    ],
    
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "sass-loader", options: {
                            sourceMap: true,
                            includePaths: ['./node_modules']
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(glsl|txt)$/,
                use: [
                    'raw-loader'
                ]
            },
            {
                test: /\.worker\.js$/,
                use: { loader: 'worker-loader' }
            }
        ]
    }

};