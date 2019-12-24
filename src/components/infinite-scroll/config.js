export const STATUS = {
  READY: 0,
  LOADING: 1,
  COMPLETE: 2,
  ERROR: 3,
};

/**
 * default slot styles
 */
export const SLOT_STYLES = {
  color: '#666',
  fontSize: '14px',
  padding: '10px 0',
};

/**
 * default slot messages
 */
export const texts = {
  noResults: '还没有数据 :(',
  noMore: '没有更多数据了 :)',
  loading: '加载中...',
};

/**
 * the 3rd argument for event bundler
 * @see https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
 */

export const evt3rdArg = (() => {
  let result = false;

  try {
    const arg = Object.defineProperty({}, 'passive', {
      get() {
        result = { passive: true };
        return true;
      },
    });

    window.addEventListener('testpassive', arg, arg);
    window.remove('testpassive', arg, arg);
  } catch (e) { /* */ }

  return result;
})();