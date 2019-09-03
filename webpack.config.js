module.exports = {
    entry: './components/main.js',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        }
      ]
    },
    resolve: {
      extensions: ['*', '.js', '.jsx']
    },
    output: {
      path: __dirname + '/static',
      publicPath: '/',
      filename: 'bundle.js'
    },
    devServer: {
      contentBase: './static'
    }
}