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

        // Adds a hook right before running the compiler.
        if (compiler.options.mode === 'production') {
            compiler.hooks.beforeRun.tapPromise('VueWebpackPlugin', async (_) => {
                await loadVueConfig();
            });
            return;
        }
        await loadVueConfig();
    }
}