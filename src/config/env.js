/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 *
 */
let baseUrl = ''
let routerMode = 'hash'
let baseImgPath
let logoutUrl = 'http://admin-upper.jin10.com'

if (process.env.NODE_ENV === 'development') {
  baseUrl = 'http://localhost:3001/bonus'
} else {
  baseUrl = 'http://sign-api.jin10.com/bonus'
}

export {
  baseUrl,
  routerMode,
  baseImgPath,
  logoutUrl
}
