import wepy from 'wepy';

import StoreServiceIns from '../../store/Store.service.ins';

export default class extends wepy.page {
  config = {
    navigationBarTitleText: '关于色彩天气'
  };

  data = {
    version: '0.0.13',
    repository: 'cycjimmy/weapp-color-weather',
    license: 'MIT'
  };

  methods = {};

  onLoad() {
    new StoreServiceIns()
      .updateData({});
  };

  onPullDownRefresh() {
    new StoreServiceIns()
      .updateData({
        isRefresh: true
      })
      .finally(() => wx.stopPullDownRefresh());
  };

  onShareAppMessage() {
    return {
      title: '不来贡献一发代码？'
    }
  };
};

