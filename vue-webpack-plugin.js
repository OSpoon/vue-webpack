/**
 * This function must be asynchronous, as dependencies may be installed
 * @returns 
 */
async function maybeUseVue() {

    return {
        plugins: [new (require('vue-loader').VueLoaderPlugin)],
        loaders: [
            {
                test: /\.vue$/,
                loader: require.resolve('vue-loader'),
            },
            {
                test: /\.js$/,
                loader: require.resolve('babel-loader'),
                exclude: /node_modules/
            }
        ],
    }
}

module.exports = class VueWebpackPlugin {

    /**
     * before
     * @param {*} compiler 
     */
    // async apply(compiler) {
    //     const maybeInstallVue = await maybeUseVue()

    //     compiler.options.module.rules = [
    //         ...(maybeInstallVue?.loaders || []),
    //         ...compiler.options.module.rules
    //     ].filter(Boolean)

    //     maybeInstallVue?.plugins?.forEach((plugin) => plugin.apply(compiler))
    // }

    /**
     * after
     * @param {*} compiler 
     */
    async apply(compiler) {
        compiler.hooks.beforeRun.tapPromise('VueWebpackPlugin', async (compiler) => {
            const maybeInstallVue = await maybeUseVue()

            compiler.options.module.rules = [
                ...(maybeInstallVue?.loaders || []),
                ...compiler.options.module.rules
            ].filter(Boolean)

            maybeInstallVue?.plugins?.forEach((plugin) => plugin.apply(compiler))
        });
    }
}