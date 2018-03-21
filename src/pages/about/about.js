import wepy from 'wepy';

export default class extends wepy.page {
  config = {
    navigationBarTitleText: '关于色彩天气'
  };

  data = {
    version: '0.0.12',
    repository: 'cycjimmy/weapp-color-weather',
    license: 'MIT',
    copyright: 'Copyright (c) 2018 cycjimmy'
  };

  methods = {};

  onLoad() {
  };
};

