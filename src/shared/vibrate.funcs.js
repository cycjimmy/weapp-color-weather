export let vibrateLong = () => {
  if (wx.canIUse('vibrateLong')) {
    wx.vibrateLong();
  }
};

export let vibrateShort = () => {
  if (wx.canIUse('vibrateShort')) {
    wx.vibrateShort();
  }
};

