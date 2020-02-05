class Pushup {
  constructor(options) {
    this.el = options.el;
    this.options = Object.assign({
      el: "#pushup", // 滚动区域 必填
      distance: 100, //滚动距离 单位px 非必填
      interval: 3000, //滚动时间间隔 单位ms 非必填
      pushupCount: 1, // 需要推送的元素个数 非必填，如果填了distance那么次参数无效
      autoStart: true,
      onEnd: noop,
      onStart: noop,
      onPushup: noop
    }, options);
    this.currentIndex = 0;
    this.movedDistance = 0;
    this.count = 0;
    this.pushuper = null;
    this.isAnimating = false;

    this.init();
    this.bindEvent();
    if (this.options.autoStart) this.start();
  }

  init() {
    const {
      el,
    } = this.options;

    const container = document.querySelector(el);
    const pushuper = container.children[0];
    const firstChildCloned = pushuper.children[0].cloneNode(true);
    const pushHeight = pushuper.children[0].offsetHeight;

    pushuper.appendChild(firstChildCloned);
    container.style = `height:${pushHeight}px; overflow:hidden`;

    this.options.distance = pushHeight;
    this.count = pushuper.children.length;
    this.pushuper = pushuper;
  }

  bindEvent() {
    this.pushuper.addEventListener('transitionend', () => {
      this.currentIndex++;

      if (this.currentIndex >= this.count - 1) {
        this.movedDistance = 0;
        this.currentIndex = 0;
        this.setDistance(0, false);
      }
    })
    this.pushuper.addEventListener('transitionstart', () => {})
  }

  tick() {
    const {
      interval,
      distance,
      onPushup
    } = this.options;

    this.timer = setInterval(() => {
      this.move();
      onPushup(this.movedDistance, this.currentIndex)
    }, interval);
  }

  move() {
    const {
      distance,
    } = this.options;
    this.movedDistance += distance;
    this.setDistance(this.movedDistance);
  }

  setDistance(y = 0, needTransitoin = true) {
    let transitonStyle = needTransitoin ? 'transition: transform .3s ease' : '';
    this.pushuper.style = `transform: translateY(-${y}px) translateZ(0); will-change: transform; ${transitonStyle};`;
  }

  start() {
    if (this.timer) return;

    this.options.onStart();
    this.tick();
  }

  pause() {
    clearInterval(this.timer);
    this.timer = null;
  }

  next() {
    if (this.currentIndex >= this.count - 1) return
    this.currentIndex++;
    this.move();
  }

  prev() {
    console.log(this.currentIndex);
    if (this.currentIndex <= 0) return
    this.currentIndex--;
    this.move();
  }

  refresh() {

  }

  push() {

  }
}

function noop() {};

export default Pushup
