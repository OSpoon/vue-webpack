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
     * before: 
     * Run `npm run build`:
     * ERROR in ./src/App.vue 1:0
     *  Module parse failed: Unexpected token (1:0)
     *  You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file.
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
     * after:
     * @param {*} compiler 
     */
    async apply(compiler) {
        const loadVueConfig = async () => {
            const maybeInstallVue = await maybeUseVue()

            compiler.options.module.rules = [
                ...(maybeInstallVue?.loaders || []),
                ...compiler.options.module.rules
            ].filter(Boolean)

            maybeInstallVue?.plugins?.forEach((plugin) => plugin.apply(compiler))
        }

        // Executes a plugin during watch mode after a new compilation is triggered but before the compilation is actually started.
        compiler.hooks.watchRun.tapPromise('VueWebpackPlugin', async (_) => {
            console.log('===watchRun===')
            await loadVueConfig()
        });

        // Adds a hook right before running the compiler.
        compiler.hooks.beforeRun.tapPromise('VueWebpackPlugin', async (_) => {
            console.log('===beforeRun===')
            await loadVueConfig()
        });
    }
}