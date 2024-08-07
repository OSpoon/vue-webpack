const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueWebpackPlugin = require('./vue-webpack-plugin')

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            inject: true
        }),
        new VueWebpackPlugin(),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist')
        },
        hot: true
    },
    mode: 'development',
    experiments: {
        // You can't use `experiments.css` (`experiments.futureDefaults` enable built-in CSS support by default) and `css-loader` together, please set `experiments.css` to `false` or set `{ type: "javascript/auto" }` for rules with `css-loader` in your webpack config (now css-loader does nothing).
        css: false,
    }
};
