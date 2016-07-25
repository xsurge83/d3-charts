const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

module.exports = {
    // Source maps support ('inline-source-map' also works)
    devtool: 'source-map',
    entry: './main.ts',
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.ts', '.webpack.js', '.web.js', '.js'],
        // remove other default values
        modulesDirectories: ['node_modules']
    },

    // Add the loader for .ts files.
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            },
            /*
             * Raw loader support for *.css files
             * Returns file content as string
             *
             * See: https://github.com/webpack/raw-loader
             */
            {
                test: /\.css$/,
                loader: 'raw-loader'
            },
            /*
             * less loader support for *.less files
             * Returns file content as string
             *
             * See: https://github.com/webpack/less-loader
             */
            {
                test: /\.less$/,
                exclude: /node_modules/,
                loader: 'raw-loader!less-loader'
            }
        ]
    },
    plugins: [
        new ForkCheckerPlugin()
    ]
}