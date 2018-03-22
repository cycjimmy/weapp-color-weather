import wepy from 'wepy';
import 'wepy-async-function';
import './polyfill/promise-finally.polyfill';

import {
  modalForUpdateManager
} from './shared/modal.funcs';

export default class extends wepy.app {
  config = {
    pages: [
      'pages/index/index',
      'pages/suggest/suggest',
      'pages/about/about',
      'pages/suggest/suggestInner/suggestInner'
    ],
    window: {
      backgroundTextStyle: 'dark',
      backgroundColor: '#e2e2e2',
      backgroundColorTop: '#f2f2f2',
      backgroundColorBottom: '#f2f2f2',
      navigationBarBackgroundColor: '#f2f2f2',
      navigationBarTitleText: '色彩天气',
      navigationBarTextStyle: 'black',
      enablePullDownRefresh: true
    },
    tabBar: {
      color: '#aab8b8',
      selectedColor: '#09ce6e',
      backgroundColor: '#f2f2f2',
      borderStyle: 'white',
      list: [{
        selectedIconPath: 'static/images/icon_weather_selected.png',
        iconPath: 'static/images/icon_weather.png',
        pagePath: 'pages/index/index',
        text: '天气'
      }, {
        selectedIconPath: 'static/images/icon_suggest_selected.png',
        iconPath: 'static/images/icon_suggest.png',
        pagePath: 'pages/suggest/suggest',
        text: '建议'
      }, {
        selectedIconPath: 'static/images/icon_about_selected.png',
        iconPath: 'static/images/icon_about.png',
        pagePath: 'pages/about/about',
        text: '关于'
      }]
    }
  };

  globalData = {};

  constructor() {
    super();
    this.use('requestfix');
  };

  onLaunch() {
    // UpdateManager
    if (wx.canIUse('getUpdateManager')) {
      this.updateManager = wx.getUpdateManager();

      // 请求完新版本信息的回调
      this.updateManager
        .onCheckForUpdate((res) => console.log('onCheckForUpdate: ' + res.hasUpdate));

      // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      this.updateManager
        .onUpdateReady(() => modalForUpdateManager()
          .then(() => this.updateManager.applyUpdate()));

      // 新的版本下载失败
      this.updateManager
        .onUpdateFailed(() => console.log('Update Download Failed!'));
    }
  };
};

