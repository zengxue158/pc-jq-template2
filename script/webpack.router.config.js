const fs = require('fs')

const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')

function findFiles (rootPath) {
  let result = []

  function finder (tempPath) {
    let files = fs.readdirSync(tempPath)
    files.forEach((val) => {
      if (val !== '.DS_Store') {
        result.push(val)
      }
    })
  }

  finder(rootPath)
  return result
}
let pages = findFiles(`./src/pages/`)
let entry = {}
let plugins = []
pages.forEach(item => {
  entry[item] = path.join(__dirname, `../src/pages/${item}/index.js`)
  const excludeChunks = pages.slice(0);
  excludeChunks.splice(index, 1);
  plugins.push(
    new HtmlWebPackPlugin({
      excludeChunks: excludeChunks,
      template: `../src/pages/${item}/index.html`,
      filename: `./${item}.html`
    })
  )
})
module.exports = {
  entry,
  plugins
}