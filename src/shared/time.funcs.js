let _addZero = (num) => num < 10
  ? '0' + num
  : '' + num
;

export let getUpdatedTimeStr = (timestamp) => {
  let _date = new Date(timestamp);
  return _addZero(_date.getHours()) + ':' + _addZero(_date.getMinutes());
};

