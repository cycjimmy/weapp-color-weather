import wepy from 'wepy';

import {
  modalForGetWeatherFail
} from '../../shared/modal.funcs';

import {
  getWeatherTextColorStr,
  getTemperatureColor
} from '../../shared/color.funcs';

import {
  getUpdatedTimeStr
} from '../../shared/time.funcs';

import StoreServiceIns from '../../store/Store.service.ins';

import {
  infoListTouchEvent,
  TOUCH_EVENTS
} from '../../shared/touchEvent';

export default class extends wepy.page {
  config = {
    navigationBarTitleText: '色彩天气'
  };

  data = {
    isInitOver: false,
    dataReady: false,
    weatherTextColorStr: '',
    temperatureColor: '',
    updatedTime: '00:00',
    current: {},
    forecast: []
  };

  methods = {
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
    this.infoListTouchEvent = infoListTouchEvent;
    this.infoListTouchEvent.bind({
      swipe: e => {
        console.log('swipe ' + e.direction);
        if (e.direction === 'Left') {
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
    this._getWeather(true)
      .finally(() => wx.stopPullDownRefresh());
  };

  onShareAppMessage() {
    return {
      title: '现在的天气是什么色彩？'
    }
  };

  renderData() {
    return new Promise(resolve => {
      let _store = new StoreServiceIns().getStore();
      this.current = _store.current;
      this.forecast = _store.forecast;
      this.updatedTime = getUpdatedTimeStr(_store.updated);
      this.weatherTextColorStr = getWeatherTextColorStr(this.current.weatherDesc);
      this.temperatureColor = getTemperatureColor(this.current.currentTemperature);
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

