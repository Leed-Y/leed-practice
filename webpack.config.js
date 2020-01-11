const path = require('path');
const glob = require('glob');
const fs = require('fs');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const SUPPORT_TEMPLATE = ['.pug', '.html']
const getTemplateFile = (pathname) => {
  let templatePath = '';
  SUPPORT_TEMPLATE.forEach(t => {
    const tempPath = path.join(__dirname, `src/${pathname}/index${t}`);
    templatePath = fs.existsSync(tempPath) ? tempPath : templatePath;
  })
  return templatePath;
}
const getMpa = () => {
  let entry = {};//入口对象
  let htmlWebpackPlugins = [];//html-webpack-plugin配置

  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));
  Object.keys(entryFiles).map(index => {
    const entryFil = entryFiles[index];
    //获取文件夹名称
    const match = entryFil.match(/src\/(.*)\/index\.js/);
    const pathname = match && match[1];
    //配置入口文件对象
    entry[pathname] = entryFil;
    //获取对应的模版文件，配置html-webpack-plugin
    let templatePath = getTemplateFile(pathname);

    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: templatePath,
        filename: pathname == 'main' ? `${pathname}.html` : `module/${pathname}.html`,
        chunks: [pathname, 'manifest', 'vendor'],
        minify: {
          collapseWhitespace: true,
        },
      })
    )
  });
  return {
    entry , htmlWebpackPlugins
  }
}

const {entry,htmlWebpackPlugins} = getMpa();

module.exports = {
  entry: entry,
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist/')
  },
  devServer: {
    contentBase: './dist',
    openPage: 'main.html'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.pug$/,
        use: ['pug-loader']
      },
      {
        test: /\.(sa|sc|c)ss$/,
        // This compiles styles from Semantic-UI
        use: [MiniCssExtractPlugin.loader, "css-loader", 'sass-loader']
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      allChunks: true
    }),
    new CleanWebpackPlugin()].concat(htmlWebpackPlugins)
};