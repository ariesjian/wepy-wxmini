import wepy from 'wepy'
import U from './utils'
import { TOKEN } from '../constant/storageKey'

export default class fetch {
  static request(method, url, data, contType) {
    let param = {
      url: url,
      method: method,
      data: data,
      header: {
        'Content-type': contType||'application/x-www-form-urlencoded',
        'cache-control': 'no-cache',
        'appName': wepy.$instance.globalData.appName,
        'appVersion': wepy.$instance.globalData.appVersion,
        'source': wepy.$instance.globalData.source,
        'appMode': wepy.$instance.globalData.appMode||wx.getStorageSync('RequestData').appMode,
        'appMuId': wepy.$instance.globalData.RequestData.imei||wx.getStorageSync('RequestData').imei,
        // ★★★★★以下：除登录、注册，其他与用户相关接口必传★★★★★
        'appId': wepy.$instance.globalData.RequestData.appId||wx.getStorageSync('RequestData').appId,
        'accessToken':wepy.$instance.globalData.RequestData.accessToken||wx.getStorageSync('RequestData').accessToken,
        'MINITYPE':'QUSHENGHUO',
        'appBundleID':wepy.$instance.globalData.appBundleID,
        // 'appId': 'qz2JB0P18K0Q6TFN1G4E061ZT5C5K4162',
        // 'accessToken':'+NEflO3uj02MBMS5Y1lDrWp6h2nk+NkrJvSsGhwGPyeZbZcxWyDaVD+aTb0KpEariXyNJOo2L3RwTJSnOxSuxF2HUatE20zb7Sw+PEgIa9N6LuLLZ8J48T8apy0TQrvuM7iZZRCTzAUjwlbuEk9VGfLBxRDzHbYYEiJWMr0/tZE6ALL43HDF/A=='
      }
    }
    return wepy.request(param)
  }
  static LoginOrRigister(method, url, data) {
    let params = {
      url: url,
      method: method,
      data: data,
      header: {
        'Content-type': 'application/x-www-form-urlencoded',
        'cache-control': 'no-cache',
        'appName': 'QZA',
        'appVersion': '1.0',
        'appMode': 'DEV',
        'appMuId': 'ffffffff-fa7d-4abe-0000-000034ce3987',
        'source': 601,
        'MINITYPE':'QUSHENGHUO'
      }
    }
    return wepy.request(params);
  }
  static get(url, data) {
    if (data) {
      url = `${url}?${U.param(data)}`
    }
    return this.request('GET', url,'')
  }
  static post(url, data) {
    return this.request('POST', url, data)
  }
  static jsonpost(url,data){
    return this.request('POST', url, data,'application/json')
  }
  static delete(url, data) {
    return this.request('DELETE', url, data)
  }
  static put(url, data) {
    return this.request('PUT', url, data)
  }
}
