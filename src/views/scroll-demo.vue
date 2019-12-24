<template>
  <div class="content">
      <div class="preview">
        <div class="preview-content" ref="container">
          <infinite-scroll :list='list' :loadMore="loadMore" :heightPerItem="40">
            <template v-slot="{ visibleItems }">
                <div v-for="(item, index) in visibleItems" :key="index">
                    <div style="height:40px">
                        {{ item.title }}
                    </div>
                </div>
            </template>
          </infinite-scroll>
        </div>
      </div>
  </div>
</template>

<script>
import InfiniteScroll from '../components/infinite-scroll/infinite-scroll.vue'
import { throttleer } from '../components/infinite-scroll/utils';

export default {
  name: 'infinite-scroll-view',
  components: {
    InfiniteScroll
  },
  data () {
    return {
      list: []
    }
  },
  created () {
    for (var i = 0; i < 50; i++) {
      this.list.push({
        title: 'item ' + (this.list.length+1)
      })
    }
  },
  methods: {
    loadMore ($state) {
        setTimeout(()=>{
            const MAX = 505;
            for (var i = 0; i < 10 && this.list.length < MAX; i++) {
                this.list.push({
                        title: 'item ' + (this.list.length+1)
                })
            }
            $state.loaded();
            if (this.list.length >= MAX) {
                $state.complete();
            }
        },1000);
        
    },
  }
}
</script>

<style scoped lang="less">
  .loading-bar {
    height: 40px;
    text-align: center;
    line-height: 40px;
  }

  .icon-loading {
    transform: rotate(0deg);
    animation-name: loading;
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }

  @keyframes loading
  {
    from {transform: rotate(0deg);}
    to {transform: rotate(360deg);}
  }

  .content{
    display: flex;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    &>div{
      flex: 1;
      height: 100%;
    }
    .preview{
    //   position: relative;
        height: 100%;
      .preview-content{
        width: 256px;
        height: 600px;
        // position: absolute;
        left: 0px;
        top: 0px;
        background: #fff;
        overflow-y: scroll;
      }
    }
    .setting{
      span{
        color: #48B884;
      }
    }
  }
</style>
