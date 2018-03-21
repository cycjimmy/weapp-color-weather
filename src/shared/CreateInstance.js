/**
 * 单例模式构造函数(设计模式)
 * @returns {function(*=)}
 * @constructor
 */
export default () => {
  let instance;
  return (newInstance) => {
    if (newInstance) {
      instance = newInstance;
    }
    return instance;
  }
};

