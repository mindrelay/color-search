const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require('autoprefixer');

const prod = process.argv.indexOf('-p') !== -1;
const srcPath = path.join(__dirname, '/src/client/app/');
const distPath = path.join(__dirname, '/dist/client/app/');

const config = {
    cache: true,
    context: srcPath,
    entry: {
        app: './app.js',
    },
    output: {
        filename: "js/[name].bundle.js",
        chunkFilename: '[name]-[chunkhash].js',
        path: distPath,
    },
    externals: {
        jquery: 'jQuery',
        angular: 'angular',
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: 'css-loader',
                        options: { minimize: false },
                    },
                    {
                        loader: 'postcss-loader',
                        options: { plugins() { return [autoprefixer]; } },
                    },
                    'sass-loader'],
                }),
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: 'css-loader',
                        options: { minimize: false },
                    },
                    {
                        loader: 'postcss-loader',
                        options: { plugins() { return [autoprefixer]; } },
                    }],
                }),
            },
            {
                test: /\.(eot|ttf|woff|woff2|otf)$/,
                loader: 'file-loader',
                options: {
                    name: '[name]_[hash].[ext]',
                    outputPath: 'fonts/',
                    publicPath: '../',
                },
            },
            {
                test: /\.(png|gif|jpg|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name]_[hash].[ext]',
                    outputPath: 'imgs/',
                    publicPath: '../',
                },
            },
            {
                test: /\.html$/,
                loader: "html-loader",
            },
        ],
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks(module) {
                if (module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
                    return false;
                }
                return module.context && module.context.indexOf("node_modules") !== -1;
            },
        }),
        new ExtractTextPlugin("css/styles.css"),
    ],
};

// configuration for production
// babel, uglify, sourcemaps
if (prod) {
    config.devtool = 'source-map';
    config.module.rules.push({
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['es2015', 'es2017'],
                plugins: ['transform-runtime'],
            },
        },
    });
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
        },
        parallel: true,
        sourceMap: "source-map",
    }));
}

module.exports = config;
