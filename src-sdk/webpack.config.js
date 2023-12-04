const path = require('path');
const webpack = require('webpack');
const { CheckerPlugin } = require('awesome-typescript-loader');

// Is the current build a development build
const IS_DEV = (process.env.NODE_ENV === 'dev');

const dirNode = 'node_modules';
const dirApp = path.join(__dirname, 'src');

/**
 * Webpack Configuration
 */
module.exports = {
    entry: {
        bundle: path.join(dirApp, 'index.ts')
    },
    resolve: {
        // modules: [
        //     dirNode,
        //     dirApp,
        // ],
        extensions: [".ts", ".tsx", ".js"]
    },
    plugins: [
        new webpack.DefinePlugin({
            IS_DEV: IS_DEV
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: "babel-loader"
            },
            {
                test: /\.ts?$/,
                exclude: /node_modules/,
                use: ["awesome-typescript-loader"]
            }
        ]
    },
    plugins: [
        new CheckerPlugin()
    ]
};
