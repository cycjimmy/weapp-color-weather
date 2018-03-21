import bmap from '../libs/bmap-wx';

import {
  modalForReAuth
} from './modal.funcs';

import {
  getAQILevelColorStr
} from './color.funcs';

const apiKey = 'vS58Ifa5GreEZzVLCLyzFQZK5GXDokqp';

export let setAQI = (sAQI) => {
  let nAQI = parseInt(sAQI, 10);

  if (nAQI <= 50) {
    return {
      text: sAQI + ' | 优',
      color: getAQILevelColorStr(1)
    };
  } else if (nAQI <= 100) {
    return {
      text: sAQI + ' | 良',
      color: getAQILevelColorStr(2)
    };
  } else if (nAQI <= 150) {
    return {
      text: sAQI + ' | 轻度污染',
      color: getAQILevelColorStr(3)
    };
  } else if (nAQI <= 200) {
    return {
      text: sAQI + ' | 中度污染',
      color: getAQILevelColorStr(4)
    };
  } else if (nAQI <= 300) {
    return {
      text: sAQI + ' | 重度污染',
      color: getAQILevelColorStr(5)
    };
  } else {
    return {
      text: sAQI + ' | 严重污染',
      color: getAQILevelColorStr(6)
    };
  }
};

let reAuth = () => {
  console.log('getLocation未授权');

  return modalForReAuth()
    .then(() => new Promise((resolve, reject) => {
      wx.openSetting({
        success: (res) => res.authSetting['scope.userLocation']
          ? resolve()
          : reject(new Error('unauthorized'))
      });
    }));
};

export let getWeather = () => {
  let BMap = new bmap.BMapWX({
    ak: apiKey
  });
  // default resolve data
  let result = {
    current: {},
    forecast: [],
    suggestion: {}
  };

  return new Promise((resolve, reject) => {
    let fail = (err) => {
      reject(err);
    };
    let success = (data) => {
      let originalData = data.originalData.results[0];
      let currentWeather = originalData.weather_data[0];
      let suggestion = originalData.index;

      // current
      result.current.currentCity = originalData.currentCity;
      result.current.currentTemperature = currentWeather.date.replace(/^.+实时：|℃.+$/g, '');
      result.current.maxTemperature = currentWeather.temperature.replace(/\s.+$/g, '');
      result.current.minTemperature = currentWeather.temperature.replace(/^.+\s|℃$/g, '');
      result.current.day = currentWeather.date.replace(/\s.+$/g, '');
      result.current.pm25 = setAQI(originalData.pm25);
      result.current.dayPictureUrl = currentWeather.dayPictureUrl;
      result.current.nightPictureUrl = currentWeather.nightPictureUrl;
      result.current.weatherDesc = currentWeather.weather;
      result.current.wind = currentWeather.wind;

      // forecast
      result.forecast = originalData.weather_data.slice(1, originalData.weather_data.length);

      // suggestion
      suggestion.forEach(suggestionObj => {
        console.log(suggestionObj);

        switch (suggestionObj.tipt) {
          case '穿衣指数':
            result.suggestion.dress = {
              tip: 'dress',
              ...suggestionObj
            };
            break;

          case '紫外线强度指数':
            result.suggestion.uv = {
              tip: 'uv',
              ...suggestionObj
            };
            break;

          case '感冒指数':
            result.suggestion.cold = {
              tip: 'cold',
              ...suggestionObj
            };
            break;

          case '运动指数':
            result.suggestion.sport = {
              tip: 'sport',
              ...suggestionObj
            };
            break;

          case '洗车指数':
            result.suggestion.carWash = {
              tip: 'carWash',
              ...suggestionObj
            };
            break;
        }
      });
      console.log(data);
      setTimeout(() => resolve(result), 0);
    };

    BMap.weather({
      fail: fail,
      success: success
    });
  }).catch(err => {
    console.error(err);
    wx.hideLoading();
    if (err.errMsg === 'getLocation:fail auth deny') {
      return reAuth()
        .then(() => Promise.reject(err));
    }
    return Promise.reject(err);
  });
};

