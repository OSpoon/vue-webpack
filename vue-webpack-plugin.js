const MiniCssExtractPlugin = require("mini-css-extract-plugin");

/**
 * This function must be asynchronous, as dependencies may be installed
 * @returns 
 */
async function maybeUseVue(mode = 'development') {

    return {
        plugins: [
            new (require('vue-loader').VueLoaderPlugin),
            new MiniCssExtractPlugin,
        ],
        loaders: [
            {
                test: /\.vue$/,
                loader: require.resolve('vue-loader'),
                options: {
                    // `experimentalInlineMatchResource` should be enabled if `experiments.css` enabled currently
                    experimentalInlineMatchResource: false,
                },
            },
            {
                test: /\.js$/,
                loader: require.resolve('babel-loader'),
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    mode !== 'production'
                        ? 'vue-style-loader'
                        : MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ],
    }
}

module.exports = class VueWebpackPlugin {

    async apply(compiler) {
        const loadVueConfig = async () => {
            const maybeInstallVue = await maybeUseVue(compiler.options.mode)

            compiler.options.module.rules = [
                ...(maybeInstallVue?.loaders || []),
                ...compiler.options.module.rules
            ].filter(Boolean)

            maybeInstallVue?.plugins?.forEach((plugin) => plugin.apply(compiler))
        }

        if (compiler.options.mode === 'production') {
            compiler.hooks.beforeRun.tapPromise('VueWebpackPlugin', async (_) => {
                await loadVueConfig();
            });
            return;
        }
        await loadVueConfig();
    }
}