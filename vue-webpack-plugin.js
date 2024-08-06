module.exports = class VueWebpackPlugin {
    async apply(compiler) {
        compiler.options.module.rules = [
            {
                test: /\.vue$/,
                loader: require.resolve('vue-loader'),
            },
            {
                test: /\.js$/,
                loader: require.resolve('babel-loader'),
                exclude: /node_modules/
            }
        ]

        new (require('vue-loader').VueLoaderPlugin)().apply(compiler)
    }
}