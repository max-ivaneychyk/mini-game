let webpack = require('webpack');

let config  = {
    entry: { // входная точка - исходный файл
       main: "./app/app.js"
    },
    output:{
        path: __dirname + '/build',     // путь к каталогу выходных файлов - папка public
        publicPath: '/',
        filename: "main.js"       // название создаваемого файла
    },
    resolve:{
        extensions: [".js"] // расширения для загрузки модулей
    },
    // source map
    devtool: 'source-map',
    watch: true,
    watchOptions: {
        aggregateTimeout: 100,
        poll: 1000
    },
    module:{
        loaders: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                loader: "babel-loader",
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    plugins: [
        // остановить сборку при ошибках
        new webpack.NoErrorsPlugin(),
        // глобальная переменные для разработки: c NODE_ENV js файлах
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify({})
        })
    ]
};


module.exports = config;