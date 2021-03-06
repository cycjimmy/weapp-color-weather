import wepy from 'wepy';

import {
  modalForGetWeatherFail
} from '../../shared/modal.funcs';

import StoreServiceIns from '../../store/Store.service.ins';

import {
  infoListTouchEvent,
  TOUCH_EVENTS
} from '../../shared/touchEvent';

import {
  vibrateShort
} from '../../shared/vibrate.funcs';

export default class extends wepy.page {
  config = {
    navigationBarTitleText: '天气小贴士'
  };

  data = {
    isInitOver: false,
    dataReady: false,
    suggestion: {}
  };

  methods = {
    navigateTo(event) {
      let _tip = event.currentTarget.dataset.tip;
      console.log('tip: ' + _tip);
      vibrateShort();
      this.$root.$navigate('suggestInner/suggestInner', {
        tip: _tip
      });
    },
    retry() {
      console.log('retry');
      this._getWeather();
    },
    ...TOUCH_EVENTS
  };

  onLoad() {
    this._getWeather();
  };

  onShow() {
    vibrateShort();

    this.infoListTouchEvent = infoListTouchEvent;
    this.infoListTouchEvent.bind({
      swipe: e => {
        console.log('swipe ' + e.direction);

        if (e.direction === 'Left') {
          wx.switchTab({
            url: '/pages/about/about'
          });
        }

        if (e.direction === 'Right') {
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    });
  };

  onHide() {
    this.infoListTouchEvent = null;
  };

  onPullDownRefresh() {
    this._getWeather(true)
      .finally(() => wx.stopPullDownRefresh());
  };

  onShareAppMessage() {
    return {
      title: '天气小贴士告诉你今天适合干什么'
    }
  };

  renderData() {
    return new Promise(resolve => {
      let _store = new StoreServiceIns().getStore();
      this.suggestion = _store.suggestion;
      this.dataReady = true;
      this.isInitOver = true;

      setTimeout(() => {
        this.$apply();
        resolve();
      }, 100);
    });
  };

  _getWeather(isRefresh = false) {
    return new StoreServiceIns()
      .updateData({
        preRender: () => this.renderData(),
        isRefresh
      })
      .then(() => this.renderData())
      .catch((err) => {
        console.log(err);
        modalForGetWeatherFail()
          .then(() => this._getWeather(),
            () => {
              this.isInitOver = true;
              setTimeout(() => this.$apply(), 100);
            });
      });
  };
};

