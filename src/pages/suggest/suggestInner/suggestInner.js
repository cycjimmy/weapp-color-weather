import wepy from 'wepy';

import StoreServiceIns from '../../../store/Store.service.ins';

export default class extends wepy.page {
  config = {
    navigationBarTitleText: ''
  };

  data = {
    iconUrl: '',
    title: '',
    zs: '',
    des: ''
  };

  methods = {};

  onLoad(option) {
    let _suggestionStore = new StoreServiceIns().getStore().suggestion[option.tip];
    wx.setNavigationBarTitle({
      title: _suggestionStore.title
    });

    this.iconUrl = '../../../static/images/icon-' + _suggestionStore.tip + '.svg';
    this.title = _suggestionStore.title;
    this.zs = _suggestionStore.zs;
    this.des = _suggestionStore.des;

    setTimeout(() => this.$apply(), 100);
  };
};

