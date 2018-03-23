import {vibrateShort} from './vibrate.funcs';

let _modalPromise = ({
                       title,
                       content,
                       cancelColor = '#999',
                       confirmText
                     }) => new Promise((resolve, reject) => {
  vibrateShort();

  wx.showModal({
    title: title,
    content: content,
    cancelColor: cancelColor,
    confirmText: confirmText,
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

export let modalForGetWeatherFail = () => _modalPromise({
  title: '天气信息获取失败',
  content: '是否重新获取',
  confirmText: '重新获取'
});

export let modalForReAuth = () => _modalPromise({
  title: '程序需要您授权位置服务以继续',
  content: '是否进入授权页面',
  confirmText: '进入授权'
});

export let modalForUpdateManager = () => _modalPromise({
  title: '发现到新版本',
  content: '立即重启更新？',
  confirmText: '更新'
});

