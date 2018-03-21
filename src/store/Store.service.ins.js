// constructor
import CreateInstance from '../shared/CreateInstance';
import {getWeather} from '../shared/weather.funcs';
import {
  getStorage,
  setStorage
} from '../shared/storage.funcs';

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
    this.TIMEOUT = 60 * 60 * 1e3;  // 1hour

    _instance(this);
  };

  setStore({current, forecast, suggestion, updated}) {
    this.current = current;
    this.forecast = forecast;
    this.suggestion = suggestion;
    this.updated = updated;
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
               preRender = () => Promise.resolve()
             }) {
    let _now = new Date().getTime();
    let _needUpdate = true;
    if (this._isNoNeedUpdate(_now, this.updated)) {
      return Promise.resolve();
    }

    return this._getDataFromLocalStorage()
      .then(() => {
        _needUpdate = !this._isNoNeedUpdate(_now, this.updated);
        return Promise.resolve(_needUpdate);
      }, (err) => {
        console.log(err);
        return Promise.resolve(_needUpdate);
      })
      .then((needUpdate) => needUpdate
        ? preRender()
          .then(() => Promise.all([
            (() => {
              wx.showLoading({title: '获取中'});
            })(),
            this._getDataFromSever(_now)
          ]))
        : Promise.resolve()
      )
      .finally(() => {
        wx.hideLoading();
      });
  };

  _isNoNeedUpdate(now, updated) {
    return updated + this.TIMEOUT > now
  };

  _getDataFromLocalStorage() {
    return getStorage()
      .then(weatherData => new Promise(resolve => {
        this.setStore(weatherData);
        setTimeout(resolve, 10);
      }));
  };

  _getDataFromSever(now) {
    return getWeather()
      .then(weatherData => new Promise(resolve => {
        weatherData.updated = now;
        this.setStore(weatherData);
        setStorage(weatherData);
        setTimeout(resolve, 10);
      }));
  };
};
