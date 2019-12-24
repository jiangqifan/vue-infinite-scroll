export const throttleer = {
  timers: [],
  caches: [],
  throttle(fn) {
    if (this.caches.indexOf(fn) === -1) {
      // cache current handler
      this.caches.push(fn);

      // save timer for current handler
      this.timers.push(setTimeout(() => {
        fn();

        // empty cache and timer
        this.caches.splice(this.caches.indexOf(fn), 1);
        this.timers.shift();
      }, 50));
    }
  },
  reset() {
    // reset all timers
    this.timers.forEach((timer) => {
      clearTimeout(timer);
    });
    this.timers.length = 0;

    // empty caches
    this.caches = [];
  },
};

export const scrollBarStorage = {
  key: '_infiniteScrollHeight',
  getScrollElm(elm) {
    return elm === window ? document.documentElement : elm;
  },
  save(elm) {
    const target = this.getScrollElm(elm);

    // save scroll height on the scroll parent
    target[this.key] = target.scrollHeight;
  },
  restore(elm) {
    const target = this.getScrollElm(elm);

    /* istanbul ignore else */
    if (typeof target[this.key] === 'number') {
      target.scrollTop = target.scrollHeight - target[this.key] + target.scrollTop;
    }

    this.remove(target);
  },
  remove(elm) {
    if (elm[this.key] !== undefined) {
      // remove scroll height
      delete elm[this.key]; // eslint-disable-line no-param-reassign
    }
  }
};

/**
 * @param {String} msg console content
 */
export function warn(msg) {
  /* istanbul ignore else */
  console.warn(`[Vue-infinite-loading warn]: ${msg}`);
}

/**
 * get visibility for element
 * @param   {DOM}     elm
 * @return  {Boolean}
 */
export function isVisible(elm) {
  return (elm.offsetWidth + elm.offsetHeight) > 0;
}
