import wepy from 'wepy';

import StoreServiceIns from '../../../store/Store.service.ins';

import {
  infoListTouchEvent,
  TOUCH_EVENTS
} from '../../../shared/touchEvent';
import {vibrateShort} from '../../../shared/vibrate.funcs';

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

  methods = {
    ...TOUCH_EVENTS
  };

  onLoad(option) {
    this.renderData(option.tip);
  };

  onShow() {
    vibrateShort();

    this.infoListTouchEvent = infoListTouchEvent;
    this.infoListTouchEvent.bind({
      swipe: e => {
        console.log('swipe ' + e.direction);

        if (e.direction === 'Right') {
          wx.navigateBack({
            delta: 1
          });
        }
      }
    });
  };

  onHide() {
    this.infoListTouchEvent = null;
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

