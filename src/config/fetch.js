import { baseUrl } from './env'
import router from '@/router'

export default async (url = '', data = {}, type = 'GET', method = 'fetch') => {
  type = type.toUpperCase()
  url = baseUrl + url
  if (type === 'GET') {
    let dataStr = '' // 数据拼接字符串
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&'
    })
    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'))
      url = url + '?' + dataStr
    }
  }
  if (window.fetch && method === 'fetch') {
    let jwt = localStorage.getItem('jwt')
    let requestConfig = {
      credentials: 'include',
      method: type,
      headers: {
        'Accept': 'application/json',
        'x-version': '1.0.0',
        'x-app-id': 'v2C3vqANKrFBkBJw'
      },
      mode: 'cors',
      cache: 'force-cache'
    }
    !(data instanceof FormData) && (requestConfig.headers['Content-Type'] = 'application/json')
    jwt && (requestConfig.headers['Authorization'] = `Bearer ${jwt}`)
    if (type === 'POST') {
      Object.defineProperty(requestConfig, 'body', {
        value: data instanceof FormData ? data : JSON.stringify(data)
      })
    }
    try {
      const response = await fetch(url, requestConfig)
      const responseJson = await response.json()
      if (responseJson.code === 20) {
        console.log('tokem 超时')
        router.push('/')
      }
      return responseJson
    } catch (error) {
      throw new Error(error)
    }
  } else {
    return new Promise((resolve, reject) => {
      let requestObj
      if (window.XMLHttpRequest) {
        requestObj = new XMLHttpRequest()
      } else {
        requestObj = new ActiveXObject()
      }
      let sendData = ''
      if (type === 'POST') {
        sendData = data instanceof FormData ? data : JSON.stringify(data)
      }
      requestObj.open(type, url, true)
      !(data instanceof FormData) && requestObj.setRequestHeader('Content-Type', 'application/json')
      requestObj.send(sendData)
      requestObj.onreadystatechange = () => {
        if (requestObj.readyState === 4) {
          if (requestObj.status === 200) {
            let obj = requestObj.response
            if (typeof obj !== 'object') {
              obj = JSON.parse(obj)
            }
            resolve(obj)
          } else {
            reject(requestObj)
          }
        }
      }
    })
  }
}
