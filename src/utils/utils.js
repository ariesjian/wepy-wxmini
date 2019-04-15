import Tips from './tips';
import onfire from './onfire'
import wepy from 'wepy';
import {
  TOKEN,
  EXPIRETOKEN
} from '../constant/storageKey'

export default class Utils extends Tips {
  static onfire = onfire;
  /**
   * 检测用户有没有授权
   */
  static async checkoutAuth(fn){
    try{
      const userInfo = await wepy.getUserInfo();
      Utils.againLogin()
    }catch(e){
      fn()
    }
  }
  /**
   * 授权完进来
   */
  static againLogin() {
      this.getUserInfo(async v => {
        const url = `${wepy.$instance.globalData.baseUrl}/sns`
        const data = Object.assign({}, v, {
          channel: 8
        })
        let param = {
          url: url,
          method: 'POST',
          data: data,
          header: {
            'X-Channel': 'wechatApp',
            'Content-type': 'application/json',
            'cache-control': 'no-cache'
          }
        }
        let res = await wepy.request(param)
        if (res.code != '1') return console.log('登录接口报错');
        const {
          data: {
            token,
            expireTime
          }
        } = res;
        wx.setStorageSync(TOKEN, token);
        wx.setStorageSync(EXPIRETOKEN, expireTime);
        wx.startPullDownRefresh();
    });
  }
  /**
   * 登录授权等操作
   * @param {Function} fn 当前页面的初始化数据
   */
  static async goLogin(fn) {
    fn()
  }

  /**
   * 获取小程序授权登录信息
   */
  static async getUserInfo(fn) {
    const loginInfo = await wepy.login();
    const userInfo = await wepy.getUserInfo();
    const {
      iv,
      encryptedData,
      userInfo: {
        nickName: name,
        avatarUrl: avatar
      }
    } = userInfo;
    typeof fn === 'function' && fn({
      code: loginInfo.code,
      iv,
      encryptedData,
      avatar,
      name
    })

  }
  /**
   * 兼容性判断
   */
  static canIUse(str) {
    if (wx.canIUse) {
      return wx.canIUse(str);
    } else {
      return false;
    }
  }
  /**
   * 检查SDK版本
   */
  static isSDKExipred() {
    const {
      SDKVersion
    } = wx.getSystemInfoSync();
    console.info(`[version]sdk ${SDKVersion}`);
    return SDKVersion == null || SDKVersion < '1.2.0'
  }
  /**
   * 检查SDK版本
   */
  static checkSDK() {
    if (this.isSDKExipred()) {
      Tips.modal('您的微信版本太低，为确保正常使用，请尽快升级');
    }
  }

  /**
   * 上传图片
   */
  static uploadFile(file) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: wepy.$instance.globalData.baseUrl + '/resources/moments',
        filePath: file,
        name: 'file',
        header: {
          'Content-Disposition': 'form-data',
          'X-Token': wx.getStorageSync(TOKEN),
          'Content-Type': 'image/jpeg',
        },
        success(res) {
          let {
            data,
            errMsg,
            statusCode
          } = res;
          if (statusCode >= 200 && statusCode < 3000) {
            try {
              data = JSON.parse(data)
              resolve({
                code: '1',
                data
              })
            } catch (e) {
              resolve({
                code: '-1',
                desc: errMsg
              })
            }
          } else {
            resolve({
              code: '-1',
              desc: errMsg
            })
          }
        },
        fail() {
          reject()
        }
      });
    })
  }




  /**
   * 去除字符串所有空格
   *
   * @param {String} text
   */
  static sTrim(text) {
    return text.replace(/\s/ig, '')
  }
  /**
   * 浮点型乘法
   *
   * @param {Object} a
   */
  static param(a = {}) {
    var b = []
    for (var i in a) {
      b.push(`${i}=${a[i]}`)
    }
    return b.join('&')
  }
  /**
   * 浮点型乘法
   *
   * @param {Number} a
   * @param {Number} b
   */
  static mul(a, b) {
    var c = 0,
      d = a.toString(),
      e = b.toString();
    try {
      c += d.split(".")[1].length;
    } catch (f) {}
    try {
      c += e.split(".")[1].length;
    } catch (f) {}
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
  }
  /**
   * 浮点型加法函数
   *
   * @param {Number} arg1
   * @param {Number} arg2
   */
  static accAdd(arg1, arg2) {
    var r1, r2, m;
    try {
      r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return ((arg1 * m + arg2 * m) / m).toFixed(2);
  }
  /**
   * 浮点型除法
   *
   * @param {Number} a
   * @param {Number} b
   */
  static div(a, b) {
    var c, d, e = 0,
      f = 0;
    try {
      e = a.toString().split(".")[1].length;
    } catch (g) {}
    try {
      f = b.toString().split(".")[1].length;
    } catch (g) {}
    return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
  }
  /**
   * 验证是否是手机号码
   *
   * @param {Number} number
   */
  static vailPhone(number) {
    let flag = false;
    // let myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/;
   // let myreg = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
    if (number.length != 11) {
      flag = flag;
    } else {
      flag = true;
    }
    return flag;
  }



  /**
   * 验证Q码是否符合规范
   */
  static verQma(str) {
    let ver = false
    let myReg = /^[a-zA-Z0-9_]{6,12}$/
    let myRegSp = /^\S*$/
    let myRegZF = /^(?:(?![,-./，。]).)*$/
    if (myReg.test(str) && myRegSp.test(str) && myRegZF.test(str)) {
      ver = true
    } else {
      ver = ver
    }
    return ver
  }


  /**
   * 返回当前系统时间
   */
  static getCurrentTime() {
    var keep = '';
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var f = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    keep = y + '' + m + '' + d + '' + h + '' + f + '' + s;
    return keep;
  }

  /**
   * 格式化时间
   */
  static formatDate(date, flag,flagOne) {
    date = !date ? new Date() : date;
    var keep = '';
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var f = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    if (flag) {
      keep = y + '-' + m + '-' + d;
      // keep = new Date(keep).toISOString();
    } else {
      if(!flagOne){
        keep = y + '-' + m + '-' + d + ' ' + h + ':' + f + ':' + s;
      }else{
        keep = m + '-' + d + ' '+h + ':' + f ;

      }

      // keep = new Date(keep).toISOString();
    }
    return keep;
  }


  // 时间展示处理
  static dateFormate(serverdate, datapldate) {
    let pldate = datapldate;
    let date = parseInt(new Date(serverdate) - new Date(pldate)) / 1000;
    // date = date - 8 * 60 * 60;
    if (0 < date && date < 60) {
      return '1分钟前';
    } else if (date > 60 && date < 3600) {
      return parseInt(date / 60) + '分钟前';
    } else if (date < 60 * 60 * 24 && date > 3600) {
      return parseInt(date / (60 * 60)) + '小时前';
    } else if (
      date > 60 * 60 * 24 &&
      new Date(serverdate).getYear() == new Date(pldate).getYear()
    ) {
      let getPldate = new Date(pldate);
      let getMonte =
        getPldate.getMonth() + 1 < 10 ?
        '0' + (getPldate.getMonth() + 1) :
        getPldate.getMonth() + 1;
      let getDate =
        getPldate.getDate() < 10 ?
        '0' + getPldate.getDate() :
        getPldate.getDate();
      getPldate.getDate();
      //截取到年月日分钟
      return getMonte + '月' + getDate + '日';
    } else if (new Date(serverdate).getYear() != new Date(pldate).getYear()) {
      return pldate;
    } else {
      return '';
    }
  }


  static nowDate() {
    let date = new Date();
    let keep = '';
    let y = date.getFullYear();
    let m = date.getMonth() + 1;

    m = m < 10 ? '0' + m : m;
    let d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    keep = y + '-' + m + '-' + d + 'T23:59:59.999Z';
    // keep = y + '-' + m + '-' + d;
    // keep = new Date(keep).toISOString();
    return keep;
  }

  static withData(param) {
    return param < 10 ? '0' + param : '' + param;
  }

  // 传入dateTimePicker之前格式化
  static getNewDateArry(time) {
    // 当前时间的处理
    let newDate = new Date(time);
    let year = this.withData(newDate.getFullYear()),
      mont = this.withData(newDate.getMonth() + 1),
      date = this.withData(newDate.getDate()),
      hour = this.withData(newDate.getHours()),
      minu = this.withData(newDate.getMinutes());

    return `${year}-${mont}-${date} ${hour}:${minu}:00`;
  }
  /**
   *
   * @param {下限} Min
   * @param {上限} Max
   */
  static RandomNum(Min, Max) {
    let Range = Max - Min;
    let Rand = Math.random();
    let num = Min + parseInt(Rand * Range); //舍去
    return num;
  }

  // 解码，配合decodeURIComponent使用
  static base64_decode (input) {
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      while (i < input.length) {
          enc1 = base64EncodeChars.indexOf(input.charAt(i++));
          enc2 = base64EncodeChars.indexOf(input.charAt(i++));
          enc3 = base64EncodeChars.indexOf(input.charAt(i++));
          enc4 = base64EncodeChars.indexOf(input.charAt(i++));
          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;
          output = output + String.fromCharCode(chr1);
          if (enc3 != 64) {
              output = output + String.fromCharCode(chr2);
          }
          if (enc4 != 64) {
              output = output + String.fromCharCode(chr3);
          }
      }
      return this.utf8_decode(output);
  }
  // utf-8解码
  static utf8_decode (utftext) {
      var string = '';
      let i = 0;
      let c = 0;
      let c1 = 0;
      let c2 = 0;
      while (i < utftext.length) {
          c = utftext.charCodeAt(i);
          if (c < 128) {
              string += String.fromCharCode(c);
              i++;
          } else if ((c > 191) && (c < 224)) {
              c1 = utftext.charCodeAt(i + 1);
              string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
              i += 2;
          } else {
              c1 = utftext.charCodeAt(i + 1);
              c2 = utftext.charCodeAt(i + 2);
              string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
              i += 3;
          }
      }
      return string;
  }
  //防抖
  static throttle(fn, gapTime) {
    if (gapTime == null || gapTime == undefined) {
      gapTime = 1500
    }
    let _lastTime = null
    // 返回新的函数
    return function () {
        let _nowTime = + new Date()
        if (_nowTime - _lastTime > gapTime || !_lastTime) {
            fn.apply(this, arguments)   //将this和参数传给原函数
            _lastTime = _nowTime
        }
    }
  }

}
