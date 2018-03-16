export let modalForGetWeatherFail = () => new Promise((resolve, reject) => {
  wx.showModal({
    title: '天气信息获取失败',
    content: '是否重新获取',
    cancelColor: '#999',
    confirmText: '重新获取',
    success: (res) => {
      if (res.confirm) {
        console.log('confirm');
        resolve();
      } else if (res.cancel) {
        console.log('cancel');
        reject(new Error('cancel'));
      }
    }
  });
});

