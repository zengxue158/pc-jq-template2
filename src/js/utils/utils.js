// 获取url参数
function getSearch (name, url = window.location.href) {
  let href = url.replace(/#.*/, '')

  let search = /\?.*/.exec(href)
  search = (search && search[0]) || ''

  let data = {}
  search.replace(/([^?=&]+)(=([^&]*))?/g, ($0, $1, $2, $3) => {
    data[decodeURIComponent($1)] = decodeURIComponent($3)
  })
  return name ? data[name] : data
}

// 设置url参数
function setSearch (name, value, url = window.location.href) {
  let href = url.replace(/[?#].*/, '')

  let data = getSearch(null, url)
  data[name] = value

  let search = '?' + toSearchParams(data)

  let hash = /#.*/.exec(url)
  hash = (hash && hash[0]) || ''

  return href + search + hash
}

// 将对象转换为Search参数
function toSearchParams (params) {
  let result = []
  for (let i in params) {
    if (params.hasOwnProperty(i)) {
      result.push(encodeURIComponent(i) + '=' + encodeURIComponent(params[i]))
    }
  }
  return result.join('&')
}

// 格式化时间
function formatDate (dateInput, format) {
  let date = new Date(dateInput)

  let o = {
    'M+': date.getMonth() + 1, // month
    'd+': date.getDate(), // day
    'h+': date.getHours(), // hour
    'm+': date.getMinutes(), // minute
    's+': date.getSeconds(), // second
    'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
    'S': date.getMilliseconds() // millisecond
  }

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }

  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}

// 单页面高度适配
function getResizeStyle (targetHeight = 603, needTranslate = true) {
  if (window.innerWidth >= window.innerHeight) return

  let deltaHeight = 603 - window.innerHeight * 375 / window.innerWidth
  let scale = Math.min((targetHeight - deltaHeight) / targetHeight, 1)

  let transform = `scale(${scale})`
  if (needTranslate) {
    let translateY = (scale - 1) / 2 * (100 / scale) + '%'
    transform += ` translateY(${translateY})`
  }

  return {
    transform
  }
}

// 获取static目录文件的实际路径
function getStaticPath (path) {
  return process.env.BASE_URL + 'static/' + path
}

// 获取当前页面绝对路径
function getAbsPath (url) {
  if (url) {
    let a = document.createElement('a')
    a.href = url
    return a.href
  } else {
    return window.location.href.replace(/([?#]).*/, '')
  }
}

// 加载script
function loadScript (url, callback) {
  let script = document.createElement('script')
  script.src = url
  script.onload = function () {
    callback && callback()
    script.parentNode.removeChild(script)
  }
  let target = document.getElementsByTagName('script')[0]
  target.parentNode.insertBefore(script, target)
}

// 异步执行函数，等待上一次执行完成后才能进行下次的执行
let asyncKeys = {}
async function asyncExec (func, key) {
  if (asyncKeys[key]) return

  asyncKeys[key] = true
  try {
    await func()
    delete asyncKeys[key]
  } catch (e) {
    delete asyncKeys[key]
    throw e
  }
}

// 异步等待函数
async function sleep (duration) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, duration)
  })
}

export {
  getSearch,
  setSearch,
  toSearchParams,
  formatDate,
  getResizeStyle,
  getStaticPath,
  getAbsPath,
  loadScript,
  asyncExec,
  sleep
}
