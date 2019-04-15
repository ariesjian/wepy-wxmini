import base from './base';

export default class home extends base {
  // 小程序登录接口_无授权获取unionid
  static login(data) {
    const url = `${this.baseUrl}/small/login.do`;
    return this.post(url, data);
  }

  // json
  static myCenter_conf() {
    const url = `${this.FilebaseUrl}/file/miniConfig/my_center_conf.json?${Math.random()}`;
    return this.get(url)
  }
}
