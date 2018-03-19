import bmap from '../libs/bmap-wx';
import {
  modalForReAuth
} from './modal.funcs';

const apiKey = 'vS58Ifa5GreEZzVLCLyzFQZK5GXDokqp';

export let setAQI = (sAQI) => {
  let nAQI = parseInt(sAQI, 10);

  if (nAQI <= 50) {
    return sAQI + ' | 优'
  } else if (nAQI <= 100) {
    return sAQI + ' | 良'
  } else if (nAQI <= 150) {
    return sAQI + ' | 轻度污染'
  } else if (nAQI <= 200) {
    return sAQI + ' | 中度污染'
  } else if (nAQI <= 300) {
    return sAQI + ' | 重度污染'
  } else {
    return sAQI + ' | 严重污染'
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
      result.forecast = [
        originalData.weather_data[1],
        originalData.weather_data[2],
        originalData.weather_data[3]
      ];

      // suggestion
      result.suggestion.dress = suggestion[0];
      result.suggestion.uv = suggestion[4];
      result.suggestion.cold = suggestion[2];
      result.suggestion.sport = suggestion[3];
      result.suggestion.carWash = suggestion[1];

      ['dress', 'uv', 'cold', 'sport', 'carWash'].forEach(tip => {
        result.suggestion[tip].tip = tip;
      });
      console.log(data);
      setTimeout(() => resolve(result), 0);
    };

    BMap.weather({
      fail: fail,
      success: success
    });
  }).catch(err => {
    wx.hideLoading();
    if (err.errMsg === 'getLocation:fail auth deny') {
      return reAuth()
        .then(() => Promise.reject(err));
    }
    return Promise.reject(err);
  });
};

const COLOR = {
  sunny: '#F4E192',
  cloudy: '#CFE2E1',
  overcast: '#A6B2CC',
  thunder: '#BD8AFF',
  rain: '#60BBEF',
  sandstorm: '#99825F',
  haze: '#9DA5B2',
  fog: '#C7D2D3',
  snow: '#CEEAED'
};

export let getColorStr = (weatherText) => {
  let _getColor = (weatherStr) => {
    if (weatherStr.indexOf('晴') !== -1) {
      return COLOR.sunny;
    }

    if (weatherStr.indexOf('多云') !== -1) {
      return COLOR.cloudy;
    }

    if (weatherStr.indexOf('阴') !== -1) {
      return COLOR.overcast;
    }

    if (weatherStr.indexOf('雷') !== -1) {
      return COLOR.thunder;
    }

    if (weatherStr.indexOf('雨') !== -1) {
      return COLOR.rain;
    }

    if (
      weatherStr.indexOf('沙') !== -1 ||
      weatherStr.indexOf('尘') !== -1
    ) {
      return COLOR.sandstorm;
    }

    if (weatherStr.indexOf('霾') !== -1) {
      return COLOR.haze;
    }

    if (weatherStr.indexOf('雾') !== -1) {
      return COLOR.fog;
    }

    if (weatherStr.indexOf('雪') !== -1) {
      return COLOR.snow;
    }
  };

  let _aColor = weatherText
    .split('转')
    .map(weather => _getColor(weather));

  console.log(_aColor);
  return _aColor.join(',');
};
