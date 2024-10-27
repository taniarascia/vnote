const path = require('path')

const dotenv = require('dotenv')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

/**
 * Obtain client id for OAuth link in React
 *
 * If in development mode or local production mode, search the .env file for
 * client id. If using Docker, pass a build arg.
 */
const getEnvFromDotEnvFile = dotenv.config()
let envKeys

if (getEnvFromDotEnvFile.error) {
  console.log('Getting environment variables from build args for production') // eslint-disable-line
  envKeys = {
    'process.env.CLIENT_ID': JSON.stringify(process.env.CLIENT_ID),
    'process.env.DEMO': JSON.stringify(process.env.DEMO),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  }
} else {
  envKeys = {
    'process.env.CLIENT_ID': JSON.stringify(getEnvFromDotEnvFile.parsed['CLIENT_ID']),
    'process.env.DEMO': JSON.stringify(getEnvFromDotEnvFile.parsed['DEMO']),
  }
}

module.exports = {
  entry: ['./src/client/index.tsx'],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[fullhash].bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      /**
       * TypeScript (.ts/.tsx files)
       *
       * The TypeScript loader will compile all .ts/.tsx files to .js. Babel is
       * not necessary here since TypeScript is taking care of all transpiling.
       */
      {
        test: /\.ts(x?)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      // Fonts
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/,
        type: 'asset/inline',
      },
      // Markdown
      {
        test: /\.md$/,
        type: 'asset/source',
      },
      // Images
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    // Resolve in this order
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx', '.md'],
    // Allow `@/` to map to `src/client/`
    alias: {
      '@': path.resolve(__dirname, '../src/client'),
      '@resources': path.resolve(__dirname, '../src/resources'),
      stream: 'stream-browserify',
      path: 'path-browserify',
    },
  },
  plugins: [
    // Get environment variables in React
    new webpack.DefinePlugin(envKeys),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'),
          globOptions: {
            ignore: ['*.DS_Store', 'favicon.ico', 'template.html'],
          },
        },
      ],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
}
