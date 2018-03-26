const COLOR = {
  sunny: '#ffeb99',
  cloudy: '#def9c0',
  overcast: '#cedff4',
  thunder: '#c49fff',
  rain: '#79d6f2',
  sandstorm: '#e5c093',
  haze: '#b7bdc4',
  fog: '#dce3e5',
  snow: '#CEEAED',
  AQI_L1: '#8dff8d',
  AQI_L2: '#fff75a',
  AQI_L3: '#FFD58A',
  AQI_L4: '#ffa488',
  AQI_L5: '#f288a9',
  AQI_L6: '#ad40a3',
  tempMinus40: '#5471ff',
  temp10: '#b4ffc5',
  temp11: '#e8ff94',
  temp50: '#ff602b'
};

export let getAQILevelColorStr = (nLevel) => COLOR['AQI_L' + nLevel];

export let getWeatherTextColorStr = (weatherText) => {
  let _getColor = (weatherStr) => {
    if (weatherStr.indexOf('晴') !== -1) {
      return COLOR.sunny;
    }

    if (weatherStr.indexOf('云') !== -1) {
      return COLOR.cloudy;
    }

    if (
      weatherStr.indexOf('阴') !== -1 ||
      weatherStr.indexOf('风') !== -1
    ) {
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

    if (
      weatherStr.indexOf('雪') !== -1 ||
      weatherStr.indexOf('霜') !== -1 ||
      weatherStr.indexOf('冰') !== -1 ||
      weatherStr.indexOf('冻') !== -1
    ) {
      return COLOR.snow;
    }
  };

  let _aColor = weatherText
    .split('转')
    .map(weather => _getColor(weather));

  if (_aColor.length === 0) {
    _aColor = [COLOR.sunny, COLOR.sunny];
  } else if (_aColor.length === 1) {
    _aColor = [_aColor[0], _aColor[0]];
  }

  console.log(_aColor);

  return _aColor.join(',');
};

// convert #hex notation to rgb array
let _parseColor = hexStr => hexStr.length === 4
  ? hexStr
    .substr(1)
    .split('')
    .map(str => 0x11 * parseInt(str, 16))
  : [
    hexStr.substr(1, 2),
    hexStr.substr(3, 2),
    hexStr.substr(5, 2)
  ].map(str => parseInt(str, 16));

// zero-pad 1 digit to 2
let _pad = str => (str.length === 1)
  ? '0' + str
  : str;

let _getColorOnGradient = ({
                             startColor,
                             endColor,
                             start,
                             end,
                             now,
                             gamma = 2.2
                           }) => {
  let steps = end - start + 1;
  now = now - start;
  let ms = now / (steps - 1);
  let me = 1 - ms;
  let _normalize = (channel) => Math.pow(channel / 255, gamma);
  startColor = _parseColor(startColor).map(_normalize);
  endColor = _parseColor(endColor).map(_normalize);

  let aHex = [];
  for (let i = 0; i < 3; i++) {
    aHex[i] = _pad(
      Math.round(
        Math.pow(
          startColor[i] * me + endColor[i] * ms,
          1 / gamma
        ) * 255
      ).toString(16)
    );
  }
  return '#' + aHex.join('');
};

export let getTemperatureColor = (sTemperature) => {
  let _num = parseInt(sTemperature, 10);
  let _color = '';
  let _getLowTemperatureColor = (num) => _getColorOnGradient({
    startColor: COLOR.tempMinus40,
    endColor: COLOR.temp10,
    start: -40,
    end: 10,
    now: num
  });
  let _getHighTemperatureColor = (num) => _getColorOnGradient({
    startColor: COLOR.temp11,
    endColor: COLOR.temp50,
    start: 11,
    end: 50,
    now: num
  });

  if (_num > 10) {
    _color = _getHighTemperatureColor(_num);
  } else {
    _color = _getLowTemperatureColor(_num);
  }
  console.log('getTemperatureColor:', _num, _color);
  return _color;
};

