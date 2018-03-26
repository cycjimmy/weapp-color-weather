import wepy from 'wepy';

import StoreServiceIns from '../../store/Store.service.ins';

import {
  infoListTouchEvent,
  TOUCH_EVENTS
} from '../../shared/touchEvent';

import {vibrateShort} from '../../shared/vibrate.funcs';

export default class extends wepy.page {
  config = {
    navigationBarTitleText: '关于色彩天气'
  };

  data = {
    version: '0.0.19',
    repository: 'cycjimmy/weapp-color-weather',
    license: 'MIT'
  };

  methods = {
    ...TOUCH_EVENTS
  };

  onLoad() {
    new StoreServiceIns()
      .updateData({});
  };

  onShow() {
    vibrateShort();

    this.infoListTouchEvent = infoListTouchEvent;
    this.infoListTouchEvent.bind({
      swipe: e => {
        console.log('swipe ' + e.direction);

        if (e.direction === 'Right') {
          wx.switchTab({
            url: '/pages/suggest/suggest'
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
      .finally(() => wx.stopPullDownRefresh());
  };

  onShareAppMessage() {
    return {
      title: '不来贡献一发代码？'
    }
  };
};

