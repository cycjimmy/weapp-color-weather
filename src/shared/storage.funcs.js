const STORAGE_KEY = 'weatherData';

export let getStorage = () => new Promise((resolve, reject) => {
  wx.getStorage({
    key: STORAGE_KEY,
    success: res => resolve(res.data),
    fail: err => reject(err)
  });
});

export let setStorage = (data) => new Promise((resolve, reject) => {
  wx.setStorage({
    key: STORAGE_KEY,
    data: data,
    success: res => resolve(data),
    fail: err => reject(err)
  });
});

