import wepy from 'wepy';
import fetch from '@/utils/fetch';

export default class base extends fetch {
  static baseUrl = wepy.$instance.globalData.baseUrl;
  static FilebaseUrl = wepy.$instance.globalData.FilebaseUrl;
}
