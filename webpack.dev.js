const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const output_dir = path.resolve(__dirname, 'dist')
module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: [output_dir, path.join(__dirname, 'src/assets')]
    }
});