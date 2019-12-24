<template>
  <div class="vue-list"
       ref="scroll-container">
    <ul :style="{
      paddingTop: lineTopHeight +'px',
      paddingBottom: lineBottomHeight +'px'
      }">
      <slot :visibleItems="visibleItems"></slot>
    </ul>
    <div class="load-more-gif"
         v-if="loading">loading...</div>
    <div v-if="!canLoadMore">没有更多了</div>
  </div>
</template>

<script>
import { STATUS, SLOT_STYLES, texts, evt3rdArg } from "./config";
import { throttleer, isVisible, warn, scrollBarStorage } from "./utils";

export default {
  name: "infinite-scroll",
  props: {
    list: {
      type: Array,
      required: true,
      default() {
        return [];
      }
    },
    // item的高度
    heightPerItem: {
      type: Number,
      default: 44
    },
    loadMore: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      distance: this.heightPerItem,
      lineTopHeight: 0,
      lineBottomHeight: 0,
      visibleItems: [],
      displayCount: 0,
      loading: false,
      canLoadMore: true
    };
  },
  mounted() {
    this.scrollHandler = ev => {
      if (ev && ev.constructor === Event && isVisible(this.$el)) {
        throttleer.throttle(this.handleScroll);
      } else {
        this.handleScroll();
      }
    };

    this.$nextTick(() => {
      this.initData();
      this.handleScroll();
      this.$refs["scroll-container"].addEventListener(
        "scroll",
        this.scrollHandler,
        evt3rdArg
      );
    });
  },
  destroyed() {
    this.$refs["scroll-container"].removeEventListener(
      "scroll",
      this.scrollHandler,
      evt3rdArg
    );
  },
  deactivated() {
    this.$refs["scroll-container"].removeEventListener(
      "scroll",
      this.scrollHandler,
      evt3rdArg
    );
  },
  activated() {
    this.$refs["scroll-container"].addEventListener(
      "scroll",
      this.scrollHandler,
      evt3rdArg
    );
  },
  methods: {
    initData() {
      // init data
      this._rowsInWindow = Math.ceil(
        this.$el.offsetHeight / this.heightPerItem
      );
      this._above = this._rowsInWindow * 2;
      this._below = this._rowsInWindow;
      this._max = this._rowsInWindow * this.heightPerItem;
    },
    handleScroll() {
      let _scrollTop = this.$el.scrollTop;
      // 截取数据 get from and to
      let _from = Math.max(
        parseInt(_scrollTop / this.heightPerItem) - this._above,
        0
      );
      let _to = Math.min(
        _from + this._above + this._rowsInWindow + this._below,
        this.list.length
      );

      this.from = _from;
      this.to = _to;

      // set top height and bottom height
      this.lineTopHeight = _from * this.heightPerItem;
      this.lineBottomHeight = (this.list.length - _to) * this.heightPerItem;
      this.resetVisibleItems(_from, _to);

      if (this.canLoadMore) {
        this.$nextTick(() => {
          let heightUnderViewportBottom =
            this.$el.querySelectorAll("ul")[0].offsetHeight -
            this.$el.scrollTop -
            this.$el.offsetHeight;

          if (
            _to === this.list.length &&
            heightUnderViewportBottom < this.distance
          ) {
            this.internalLoadMore(this.from, this.to);
          }
        });
      }
    },
    internalLoadMore(from, to) {
      if (this.loading) {
        return;
      }

      console.log("internalLoadMore", this.canLoadMore, from, to);
      this.loading = true;

      if (!this.canLoadMore) {
        this.loading = false;
        return;
      }

      this.loadMore({
        loaded: () => {
          this.handleScroll();
          this.loading = false;
        },
        complete: () => {
          this.canLoadMore = false;
          this.loading = false;
        }
      });
    },
    resetVisibleItems(from, to) {
      if (!this.canLoadMore) {
        to = Math.min(to, this.list.length);
      }
      this.visibleItems = [];
      for (; from < to; from++) {
        this.visibleItems.push(this.list[from]);
      }
    }
  },
  components: {}
};
</script>

<style lang="less">
.vue-list {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  &::scroll-bar {
    width: 0;
  }
  ul {
    margin: 0;
    padding: 0;
  }
  .load-more-gif {
    width: 100%;
    height: 44px;
    text-align: center;
    line-height: 44px;
    background: #fff;
    border-top: none;
    color: #48b884;
  }
}
</style>
