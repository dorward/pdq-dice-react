const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const mode = process.env.ENVIRONMENT === 'development' ? 'development' : 'production';

const htmlPlugin = new HtmlWebpackPlugin({
	template: './src/index.html',
	filename: './index.html',
	title: 'PDQ Dice',
});

const cssPlugin = new MiniCssExtractPlugin({
	filename: mode === 'development' ? '[name].css' : '[name].[contenthash].css',
	chunkFilename: mode === 'development' ? '[id].css' : '[id].[contenthash].css',
});

const dotEnv = new Dotenv({
	path: './.env',
});

module.exports = {
	mode,
	devtool: 'eval-source-map',
	entry: './src/index.tsx',
	plugins: [cssPlugin, htmlPlugin, dotEnv],
	devServer: {
		static: './dist',
		historyApiFallback: true,
		port: 5100,
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.(s?(a|c)ss)$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
			{
				test: /\.(woff|woff2|eot|ttf|svg|jpg|png)$/,
				use: {
					loader: 'url-loader',
				},
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		filename: 'bundle.js',
		filename: '[name].[contenthash].js',
		path: path.resolve(__dirname, 'dist'),
	},
	optimization: {
		usedExports: true,
	},
};
