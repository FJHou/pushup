(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Pushup = factory());
}(this, function () { 'use strict';

  class Pushup {
    constructor(options) {
      this.el = options.el;
      this.options = Object.assign({
        el: "#pushup", // 滚动区域 必填
        distance: 100, //滚动距离 单位px 非必填
        interval: 1, //滚动时间间隔 单位ms 非必填
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

      this.options.distance = pushHeight;
      this.count = pushuper.children.length;
      this.pushuper = pushuper;

      pushuper.appendChild(firstChildCloned);
      container.style = `height:${pushHeight}px; overflow:hidden`;
    }

    bindEvent() {
      this.pushuper.addEventListener('transitionend', () => {
        this.currentIndex++;

        if (this.currentIndex === this.count - 1) {
          this.movedDistance = 0;
          this.currentIndex = 0;
          this.setDistance(0, false);
        }
      });
    }

    tick() {
      const {
        interval,
        distance,
        onPushup
      } = this.options;

      this.timer = setInterval(() => {
        this.movedDistance += distance;
        this.setDistance(this.movedDistance);
        onPushup(this.movedDistance);
      }, interval * 1000);
    }

    setDistance(y = 0, needTransitoin = true) {
      let transitonStyle = needTransitoin ? 'transition: transform .3s ease' : '';
      this.pushuper.style = `transform: translateY(-${y}px) translateZ(0); will-change: transform; ${transitonStyle};`;
    }

    start() {
      this.options.onStart();
      this.tick();
    }

    stop() {
      clearInterval(this.timer);
    }

    pause() {

    }

    refresh() {}

    next() {

    }

    prev() {

    }
  }

  function noop() {}

  return Pushup;

}));
