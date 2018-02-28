import wepy from 'wepy'

const apiKey = 'adeef881d44a4d28a768275bbc28c2dd'

export let getLocation = () => new Promise(resolve => {
  // 默认经纬度
  let result = {
    error: 'error',
    latitude: 39.90,
    longitude: 116.399
  }

  wx.getLocation({
    success: res => {
      result.error = 'ok'
      result.latitude = res.latitude
      result.longitude = res.longitude

      resolve(result)
    },
    fail: () => resolve(result)
  })
})

export let getWeather = (latitude, longitude) => {
  let apiURL = 'https://free-api.heweather.com/s6/weather/now?location=' + longitude + ',' + latitude + '&key=' + apiKey

  return new Promise((resolve) => {
    wepy.request({
      url: apiURL,
      header: {
        'content-type': 'application/json'
      },
      success: (weatherData) => resolve(weatherData.data.HeWeather6[0]),
      fail: () => resolve()
    })
  })
}
