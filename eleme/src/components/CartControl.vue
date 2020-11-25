<template>
  <div class="cartcontrol">
    <!-- 减少的按钮 -->
    <transition>
      <div 
      class="cart-decrease" 
      v-show="food.count>0" 
      @click.stop.prevent="decreaseCart"
      >
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <!-- 中间的数字 -->
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <!-- 增加的按钮 -->
    <div 
    class="cart-add icon-add_circle" 
    @click.stop.prevent="addCart"
    ></div>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  name: "CartControl",
  props: {
    food: Object,
  },
  methods: {
    addCart(event) {
      if (!event._constructed) {
        return;
      }
      // console.log("click");
      if (!this.food.count) {
        Vue.set(this.food, "count", 1);
      } else {
        this.food.count++;
      }
      // 给父组件传递数据
      this.$emit('cart', event.target);
    },
    decreaseCart(event) {
      if (!event._constructed) {
        return;
      }
      if (this.food.count) {
        this.food.count--;
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.v-enter, .v-leave-to {
  opacity: 0;
  transform: translate3d(24px, 0, 0);
  transform: rotate(0);
}

.v-enter-active, .v-leave-active {
  transition: all 0.4s linear;
}

.v-enter-to, .v-leave {
  opacity: 1;
  transform: translate3d(0, 0, 0);
  transform: rotate(180deg);
}

.cartcontrol {
  font-size: 0;

  .cart-decrease {
    display: inline-block;
    padding: 6px;

    .inner {
      display: inline-block;
      line-height: 24px;
      font-size: 24px;
      color: rgb(0, 160, 220);
    }
  }

  .cart-count {
    display: inline-block;
    vertical-align: top;
    width: 12px;
    padding-top: 6px;
    line-height: 24px;
    text-align: center;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }

  .cart-add {
    display: inline-block;
    padding: 6px;
    line-height: 24px;
    font-size: 24px;
    color: rgb(0, 160, 220);
  }
}
</style>