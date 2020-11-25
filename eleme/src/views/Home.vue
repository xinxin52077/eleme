<template>
  <div class="home">
    <home-header :seller="seller"></home-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller" />
    </keep-alive>
  </div>
</template>

<script>
// @ is an alias to /src
import HomeHeader from '@/components/HomeHeader.vue'
import axios from "axios";

export default {
  name: 'Home',
  data() {
    return {
      seller: {}
    }
  },
  methods: {
    getHomeInfo() {
      axios.get("./data/data.json").then(this.getHomeInfoSucc);
    },
    getHomeInfoSucc(res) {
      // console.log(res.data.seller);
      this.seller = res.data.seller;
    },
  },
  mounted() {
    this.getHomeInfo();
  },
  components: {
    HomeHeader
  }
}
</script>

<style lang="stylus" scoped>
@import "../assets/stylus/mixin"
.tab
  display: flex
  width: 100%
  height: 40px
  line-height: 40px
  // border-bottom: 1px solid rgba(7, 17, 27, 0.1)
  border-1px(rgba(7, 17, 27, 0.1))
  .tab-item
    flex: 1
    text-align: center
    & > a
      display: block
      font-size: 14px
      color: rgb(77, 85, 93)
      &.link-exact-active
        color: rgb(240, 20, 20)
</style>
