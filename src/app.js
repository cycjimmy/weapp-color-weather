import wepy from 'wepy';
import 'wepy-async-function';
import './polyfill/promise-finally.polyfill';

export default class extends wepy.app {
  config = {
    pages: [
      'pages/index/index',
      'pages/suggest/suggest',
      'pages/about/about',
      'pages/suggest/suggestInner/suggestInner'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#f2f2f2',
      navigationBarTitleText: 'Color Weather',
      navigationBarTextStyle: 'black'
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
  };
};

