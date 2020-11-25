<template>
  <transition>
    <div class="food" v-show="showFlag" ref="food">
      <div class="food-content">
        <!-- 图片 -->
        <div class="image-header">
          <img :src="food.image" />
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>

        <!-- 商品价格 -->
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>

          <!-- 购物车按钮 -->
          <div class="cartcontrol-wrapper">
            <cart-control :food="food"></cart-control>
          </div>
          <transition name="fade">
            <div
              class="buy"
              v-show="!food.count || food.count===0"
              @click.stop.prevent="addFirst"
            >加入购物车</div>
          </transition>
        </div>

        <!-- 分割组件 -->
        <split v-show="food.info"></split>

        <!-- 商品信息 -->
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>

        <!-- 分割组件 -->
        <split></split>

        <!-- 商品评价 -->
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <rating-select
            :ratings="food.ratings"
            :select-type="selectType"
            :only-content="onlyContent"
            :desc="desc"
            @select="select"
            @togglecontent="togglecontent"
          ></rating-select>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li
                class="rating-item border-1px"
                v-for="(rating, index) in food.ratings"
                :key="index"
                v-show="needShow(rating.rateType,rating.text)"
              >
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar" />
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span
                    :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"
                  ></span>
                  {{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Vue from "vue";
import BScroll from "better-scroll";
import CartControl from "../components/CartControl";
import split from "../components/split";
import RatingSelect from "../components/RatingSelect";

import { formatDate } from "../assets/js/date";

const ALL = 2;

export default {
  name: "food",
  props: {
    food: Object,
  },
  data() {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: "全部",
        positive: "推荐",
        negative: "吐槽",
      },
    };
  },
  methods: {
    show() {
      this.showFlag = true;
      //   初始化数据
      this.selectType = ALL;
      this.onlyContent = true;
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true,
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    hide() {
      this.showFlag = false;
    },
    addFirst(event) {
      if (!event._constructed) {
        return;
      }
      // 给父组件传递数据
      this.$emit("cart", event.target);
      Vue.set(this.food, "count", 1);
    },
    // 数据联动
    needShow(type, text) {
      if (this.onlyContent && !text) {
        return false;
      }
      if (this.selectType === ALL) {
        return true;
      } else {
        return type === this.selectType;
      }
    },
    select(type) {
      // console.log(type);
      this.selectType = type;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },
    togglecontent(onlyContent) {
      // console.log(onlyContent);
      this.onlyContent = onlyContent;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },
  },
  filters: {
    // 时间转换
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    },
  },
  components: {
    CartControl,
    split,
    RatingSelect,
  },
};
</script>

<style lang="stylus" scoped>
@import '../assets/stylus/mixin.styl';

.v-enter, .v-leave-to {
  transform: translate3d(100%, 0, 0);
}

.v-enter-active, .v-leave-active {
  transition: all 0.2s linear;
}

.v-enter-to, .v-leave {
  transform: translate3d(0, 0, 0);
}

.fade-leave, .fade-enter-to {
  opacity: 1;
}

.fade-leave-active {
  transition: all 0.2s;
}

.fade-leave-to, .fade-enter {
  opacity: 0;
  z-index: -1;
}

.food {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 48px;
  z-index: 30;
  width: 100%;
  background: #fff;

  .image-header {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .back {
      position: absolute;
      top: 10px;
      left: 0;

      .icon-arrow_lift {
        display: block;
        padding: 10px;
        font-size: 20px;
        color: #fff;
      }
    }
  }

  .content {
    position: relative;
    padding: 18px;

    .title {
      line-height: 14px;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 700;
      color: rgb(7, 17, 27);
    }

    .detail {
      margin-bottom: 18px;
      line-height: 10px;
      height: 10px;
      font-size: 0;

      .sell-count, .rating {
        font-size: 10px;
        color: rgb(147, 153, 159);
      }

      .sell-count {
        margin-right: 12px;
      }
    }

    .price {
      font-weight: 700;
      line-height: 24px;

      .now {
        margin-right: 8px;
        font-size: 14px;
        color: rgb(240, 20, 20);
      }

      .old {
        text-decoration: line-through;
        font-size: 10px;
        color: rgb(147, 153, 159);
      }
    }

    .cartcontrol-wrapper {
      position: absolute;
      right: 12px;
      bottom: 12px;
    }

    .buy {
      position: absolute;
      right: 18px;
      bottom: 18px;
      z-index: 10;
      height: 24px;
      line-height: 24px;
      padding: 0 12px;
      box-sizing: border-box;
      border-radius: 12px;
      font-size: 10px;
      color: #fff;
      background: rgb(0, 160, 220);
    }
  }

  .info {
    padding: 18px;

    .title {
      line-height: 14px;
      margin-bottom: 6px;
      font-size: 14px;
      color: rgb(7, 17, 27);
    }

    .text {
      line-height: 24px;
      padding: 0 8px;
      font-size: 12px;
      color: rgb(77, 85, 93);
    }
  }

  .rating {
    padding-top: 18px;

    .title {
      line-height: 14px;
      margin-left: 18px;
      font-size: 14px;
      color: rgb(7, 17, 27);
    }

    .rating-wrapper {
      padding: 0 18px;

      .rating-item {
        position: relative;
        padding: 16px 0;
        border-1px(rgba(7, 17, 27, 0.1));

        .user {
          position: absolute;
          right: 0;
          top: 16px;
          line-height: 12px;
          font-size: 0;

          .name {
            display: inline-block;
            margin-right: 6px;
            vertical-align: top;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }

          .avatar {
            border-radius: 50%;
          }
        }

        .time {
          margin-bottom: 6px;
          line-height: 12px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }

        .text {
          line-height: 16px;
          font-size: 12px;
          color: rgb(7, 17, 27);

          .icon-thumb_up, .icon-thumb_down {
            margin-right: 4px;
            line-height: 16px;
            font-size: 12px;
          }

          .icon-thumb_up {
            color: rgb(0, 160, 220);
          }

          .icon-thumb_down {
            color: rgb(147, 153, 159);
          }
        }
      }

      .no-rating {
        padding: 16px 0;
        font-size: 12px;
        color: rgb(147, 153, 159);
      }
    }
  }
}
</style>