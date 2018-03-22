import WxTouchEvent from '../libs/wx-touch-event';

export let infoListTouchEvent = new WxTouchEvent();

export const TOUCH_EVENTS = {
  touchStart: infoListTouchEvent.start.bind(infoListTouchEvent),
  touchMove: infoListTouchEvent.move.bind(infoListTouchEvent),
  touchEnd: infoListTouchEvent.end.bind(infoListTouchEvent),
  touchCancel: infoListTouchEvent.cancel.bind(infoListTouchEvent)
};

