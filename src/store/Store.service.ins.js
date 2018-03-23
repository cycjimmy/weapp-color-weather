// constructor
import CreateInstance from '../shared/CreateInstance';
import {getWeather} from '../shared/weather.funcs';
import {
  getStorage,
  setStorage
} from '../shared/storage.funcs';
import {
  vibrateLong,
  vibrateShort
} from '../shared/vibrate.funcs';

let
  _instance = new CreateInstance()
;

export default class {
  constructor() {
    if (_instance()) {
      return _instance();
    }

    this.current = {};
    this.forecast = [];
    this.suggestion = {};
    this.updated = 0;
    this.TIMEOUT = 120 * 60 * 1e3;                   // 2hour
    this.TIMEOUT_FOR_ALLOW_REFRESH = 60 * 1e3;  // 15min

    _instance(this);
  };

  setStore({current, forecast, suggestion, updated}) {
    return new Promise(resolve => {
      this.current = current;
      this.forecast = forecast;
      this.suggestion = suggestion;
      this.updated = updated;
      setTimeout(resolve, 0);
    });
  };

  getStore() {
    return {
      current: this.current,
      forecast: this.forecast,
      suggestion: this.suggestion,
      updated: this.updated
    }
  };

  updateData({
               preRender = () => Promise.resolve(),
               isRefresh = false
             }) {
    let _now = new Date().getTime();

    if (isRefresh && this._isNoNeedUpdate(_now, this.updated, isRefresh)) {
      wx.showToast({
        title: '数据已是最新',
        icon: 'none'
      });
      vibrateShort();
      return Promise.resolve();
    }

    if (!isRefresh && this._isNoNeedUpdate(_now, this.updated)) {
      return Promise.resolve();
    }

    return this._getDataFromLocalStorage()
      .then(
        () => this._isNoNeedUpdate(_now, this.updated)
          ? Promise.resolve('noNeedUpdate')
          : Promise.resolve('needUpdate'),
        () => Promise.resolve('noData')
      )
      .then(stateStr => {
        switch (stateStr) {
          case 'noNeedUpdate':
            return Promise.resolve();

          case 'needUpdate':
            return preRender()
              .then(() => this._getDataFromSever());

          case 'noData':
            return this._getDataFromSever();
        }
      });
  };

  _isNoNeedUpdate(now, updated, isRefresh = false) {
    return isRefresh
      ? updated + this.TIMEOUT_FOR_ALLOW_REFRESH > now
      : updated + this.TIMEOUT > now
  };

  _getDataFromLocalStorage() {
    return getStorage()
      .then(weatherData => this.setStore(weatherData));
  };

  _getDataFromSever() {
    return getWeather()
      .then(weatherData => Promise.all([
        (() => vibrateLong())(),
        this.setStore(weatherData),
        setStorage(weatherData)
      ]));
  };
};

