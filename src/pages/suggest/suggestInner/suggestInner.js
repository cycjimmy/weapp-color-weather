import wepy from 'wepy';

import StoreServiceIns from '../../../store/Store.service.ins';

export default class extends wepy.page {
  config = {
    navigationBarTitleText: ''
  };

  data = {
    tip: '',
    title: '',
    zs: '',
    des: ''
  };

  methods = {};

  onLoad(option) {
    this.renderData(option.tip);
  };

  onPullDownRefresh() {
    new StoreServiceIns()
      .updateData({
        isRefresh: true
      })
      .then(() => this.renderData(this.tip))
      .finally(() => wx.stopPullDownRefresh());
  };

  onShareAppMessage() {
    return {
      title: '【今日' + this.title + ': ' + this.zs + '】' + this.des
    }
  };

  renderData(tip) {
    return new Promise(resolve => {
      let _suggestionStore = new StoreServiceIns().getStore().suggestion[tip];
      wx.setNavigationBarTitle({
        title: _suggestionStore.tipt
      });

      this.tip = _suggestionStore.tip;
      this.title = _suggestionStore.tipt;
      this.zs = _suggestionStore.zs;
      this.des = _suggestionStore.des;

      setTimeout(() => {
        this.$apply();
        resolve();
      }, 100);
    });
  };
};

