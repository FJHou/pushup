class Pushup {
  constructor(options) {
    this.el = options.el;
    this.options = Object.assign({
      el: "#pushup", // 滚动区域 必填
      distance: 100, //滚动距离 单位px 非必填
      interval: 3, //滚动时间间隔 单位ms 非必填
      pushupCount: 1, // 需要推送的元素个数 非必填，如果填了distance那么次参数无效
      onEnd: noop,
      onStart: noop,
      onPushup: noop
    }, options);

    this.initStyle();
    this.start();
  }

  initStyle() {
    const {
      el,
    } = this.options;
    const container = document.querySelector(el);
    const pushuper = this.pushuper = container.children[0];
    const pushHeight = this.options.distance = pushuper.children[0].offsetHeight;
    this.totalHeight = pushuper.offsetHeight;
    container.style = `height:${pushHeight}px; overflow:hidden`;
    this.setDistance()
  }

  tick() {
    const {
      interval,
      distance,
    } = this.options;
    let moved = 0;

    this.timer = setInterval(() => {
      moved += distance
      this.setDistance(moved)
      if (this.totalHeight === moved) {
        moved = 0
        this.options.onEnd();
        this.setDistance(moved)
      }
    }, interval * 1000);
  }

  setDistance(y = 0, needTransitoin = true) {
    let transitonStyle = needTransitoin ? 'transition: transform .3s ease' : ''
    this.pushuper.style = `transform: translateY(-${y}px) translateZ(0); will-change: transform; ${transitonStyle};`
  }

  start() {
    this.options.onStart();
    this.tick()
  }

  stop() {
    clearInterval(this.timer);
  }
}

function noop() {};

export default Pushup
