module.exports = {
  entry: "./src/auto-jest-cucumber.js",
  output: {
    path: __dirname + "/dist",
    filename: 'auto-jest-cucumber.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader'
      }
    }]
  },
  target: 'node',
  mode: 'production',
  externals: {
    "caller-callsite": "caller-callsite",
    "jest-cucumber": "jest-cucumber"
  },
  devtool: 'source-map',
  node: {
    __dirname: false
  }
};