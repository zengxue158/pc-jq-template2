const pkg = require('../package.json')
const fs = require('fs')
const del = require('del')
const path = require('path')
const easeftp = require('easeftp/upload')
const account = require('../openID')
const iconv = require('iconv-lite')
const agent = require('../config/agent')

const cacheDir = path.resolve('../node_modules/.cache/easeftp/')

const HTML_REG = /\.s?html?/i
const CMS_ID_REG = /<meta\s+name=["']cms_id["']\s+content=["'](\w+)["']\s*\/?>/i
const RESULT_OK_REG = /<url>(.*)<\/url>/

function findFiles (rootPath, replacePath = '') {
  let result = []

  function finder (tempPath) {
    let files = fs.readdirSync(tempPath)
    files.forEach((val) => {
      let fPath = path.posix.join(tempPath, val)
      let stats = fs.statSync(fPath)

      if (stats.isDirectory()) {
        finder(fPath)
      } else if (stats.isFile()) {
        result.push(fPath.replace(rootPath, replacePath))
      }
    })
  }

  finder(rootPath)
  return result
}

function getPublickPath (staticUrls, isHTML = false) {
  let urls = staticUrls.slice(0)
  if (isHTML) {
    urls = urls.map(item => item.replace('https://static.ws.126.net/', 'https://wp.m.163.com/'))
  }
  return urls
}

function uploadStatic () {
  let allFiles = findFiles(`dist/static/`, 'static/')
  let cacheFiles = []
  let cachePath = `${cacheDir}/cache-files.json`
  if (fs.existsSync(cachePath)) {
    cacheFiles = JSON.parse(fs.readFileSync(cachePath, 'utf-8'))
  }
  let newFiles = allFiles.filter(item => cacheFiles.indexOf(item) === -1)
  return easeftp.addFile(newFiles, {
    debug: true,
    username: account.username,
    password: account.password,
    path: `f2e/${pkg.channel}/${pkg.name}`,
    cwd: path.resolve('dist')
  }).then(res => {
    console.log(getPublickPath(res.urls))
    if (!fs.existsSync(cacheDir)) {
      cacheDir.split('/').reduce((current, next) => {
        const full = path.resolve(current, next)
        if (!fs.existsSync(full)) {
          fs.mkdirSync(full)
        }
        return full
      }, '/')
    }
    fs.writeFileSync(cachePath, JSON.stringify(allFiles))
  })
}

/**
 * encoding character
 * @param {String} content
 * @param {String} charset default GBK
 */
function encodeStr(content, charset = 'GBK') {
  const buf = iconv.encode(content, charset)
  let str = ''
  let ch = '', i
  for (i = 0; i < buf.length; i++) {
    ch = buf[i].toString('16')
    if (ch.length === 1) {
      ch = '0' + ch
    }
    str += '%' + ch
  }

  return str.toUpperCase()
}

/**
 * update CMS template
 * @param {String} modelid 
 * @param {String | Buffer} content 
 * @param {Object} config
 * @param {Function} callback
 */
const updateTemplate = (modelid, content, callback) => {
  const { url, params } = account.cms.pc
  const data = params + '&modelid=' + modelid + '&content=' + encodeStr(content)
  return new Promise((resolve, reject) => {
    agent.post(url)
      .type('form')
      .send(data)
      .end(resp => RESULT_OK_REG.test(resp.text) ? resolve(resp.text) : reject(resp))
  })
}

const publish = () => {
  let files = fs.readdirSync(`dist/`)
  files.forEach(filepath => {
    if (HTML_REG.test(filepath)) {
      let content = fs.readFileSync(`dist/` + filepath, 'UTF-8')
      if (CMS_ID_REG.test(content)) {
        const cmsID = CMS_ID_REG.exec(content)[1]
        content = content.replace(CMS_ID_REG, '')
        updateTemplate(cmsID, content)
          .then(msg => {
            const url = RESULT_OK_REG.exec(msg)[1]
            console.log(`\x1b[32m%s\x1b[0m`, `publish successfully: [${path.resolve(filepath)}] ---> [${url}]`)
          })
          .catch(resp => console.log(`\x1b[31m%s\x1b[0m`, `the failure to publish for [${path.resolve(filepath)}]: \n ${resp.text}`))
      } else {
        console.log(`cmsid not found, ignore file: [${filepath}]`, false)
      }
    }
  })
}

exports['upload'] = async function () {
  await uploadStatic()
}

exports['publish'] = async function () {
  await publish()
}