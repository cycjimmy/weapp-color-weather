import bmap from '../libs/bmap-wx';

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
    let fail = (data) => {
      console.log(data);
      reject(data);
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
      result.suggestionDate = originalData.weather_data[0].date;
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
  });
};

