<template>
  <div>
    <div class="goods">
      <!-- 左侧 -->
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li
            class="menu-item"
            v-for="(item, index) in goods"
            :key="item.name"
            :class="{'current':currentIndex===index}"
            @click="selectMenu(index,$event)"
          >
            <span class="text border-1px">
              <span class="icon" v-show="item.type>0" :class="classMap[item.type]"></span>
              {{item.name}}
            </span>
          </li>
        </ul>
      </div>

      <!-- 右侧 -->
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li class="food-list food-list-hook" v-for="good in goods" :key="good.name">
            <h1 class="title">{{good.name}}</h1>

            <ul>
              <li
                class="food-item border-1px"
                v-for="food in good.foods"
                :key="food.name"
                @click="selectFood(food,$event)"
              >
                <!-- 商品图片 -->
                <div class="icon">
                  <img width="57" height="57" :src="food.icon" />
                </div>

                <!-- 内容 -->
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>

                  <!-- 购物图标 -->
                  <div class="cartcontrol-wrapper">
                    <cart-control :food="food" @cart="_drop"></cart-control>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <!-- 引入购物车组件 -->
      <shop-cart
        ref="shopcart"
        :select-foods="selectFoods"
        :delivery-price="seller.deliveryPrice"
        :min-price="seller.minPrice"
      ></shop-cart>
    </div>

    <!-- 商品详情页组件 -->
    <food :food="selectedFood" ref="food" @cart="_drop"></food>
  </div>
</template>

<script>
import axios from "axios";
import BScroll from "better-scroll";
import ShopCart from "../components/ShopCart";
import CartControl from "../components/CartControl";
import food from "../components/food";



export default {
  name: "HomeGoods",
  data() {
    return {
      goods: {},
      listHeight: [],
      scrollY: 0,
      seller: {},
      selectedFood: {},
    };
  },
  computed: {
    currentIndex() {
      // 滚动联动
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
      return 0;
    },
    selectFoods() {
      let foods = [];
      if (this.goods instanceof Array) {
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
      }
      // console.log(this.goods.foods instanceof Array);
      return foods;
    },
  },
  methods: {
    selectMenu(index, event) {
      // console.log(index);
      if (!event._constructed) {
        return; // 元素事件return掉
      }
      let foodList = this.$refs.foodsWrapper.getElementsByClassName(
        "food-list-hook"
      );
      let el = foodList[index];
      this.foodsScroll.scrollToElement(el);
    },
    getHomeInfo() {
      axios.get("./data/data.json").then(this.getHomeInfoSucc);
    },
    getHomeInfoSucc(res) {
      this.goods = res.data.goods;
      this.seller = res.data.seller;
      // console.log(this.seller);

      // 异步更新
      this.$nextTick(() => {
        this._initScroll();
        this._calculateHeight();
      });
    },
    _initScroll() {
      // 滚动
      // 拿到ref=menuWrapper的元素
      this.meunScroll = new BScroll(this.$refs.menuWrapper, {
        click: true, // 让better-scroll可以被点击
      });
      // 拿到ref=foodsWrapper的元素
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true, // 让better-scroll可以被点击
        probeType: 3, // 实时滚动的位置
      });

      // 实时拿到滚动位置
      this.foodsScroll.on("scroll", (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    _calculateHeight() {
      // 计算高度
      let foodList = this.$refs.foodsWrapper.getElementsByClassName(
        "food-list-hook"
      );
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    _drop(target) {
      // console.log(target);
      // 体验优化,异步执行下落动画
      this.$nextTick(() => {
        this.$refs.shopcart.drop(target);
      });
    },
    selectFood(food, event) {
      if (!event._constructed) {
        return;
      }
      this.selectedFood = food;
      this.$refs.food.show();
    },
  },
  created() {
    this.classMap = ["decrease", "discount", "special", "invoice", "guarantee"];
  },
  mounted() {
    this.getHomeInfo();
    // console.log(this.$refs.foodsWrapper);
  },
  components: {
    ShopCart,
    CartControl,
    food,
  },
};
</script>

<style lang="stylus" scoped>
@import '../assets/stylus/mixin';

.goods {
  display: flex;
  position: absolute;
  top: 174px;
  bottom: 46px;
  width: 100%;
  overflow: hidden;

  .menu-wrapper {
    flex: 0 0 80px;
    width: 80px;
    background: #f3f5f7;

    .menu-item {
      display: table;
      height: 54px;
      width: 56px;
      padding: 0 12px;
      line-height: 14px;

      &.current {
        position: relative;
        z-index: 10;
        margin-top: -1px;
        background: #fff;
        font-weight: 700;

        .text {
          border-none();
        }
      }

      .icon {
        display: inline-block;
        vertical-align: top;
        width: 12px;
        height: 12px;
        margin-right: 2px;
        background-size: 12px 12px;
        background-repeat: no-repeat;

        &.decrease {
          bg-image('../assets/img/goods/decrease_3');
        }

        &.discount {
          bg-image('../assets/img/goods/discount_3');
        }

        &.guarantee {
          bg-image('../assets/img/goods/guarantee_3');
        }

        &.invoice {
          bg-image('../assets/img/goods/invoice_3');
        }

        &.special {
          bg-image('../assets/img/goods/special_3');
        }
      }

      .text {
        display: table-cell;
        width: 56px;
        vertical-align: middle;
        border-1px(rgba(7, 17, 27, 0.1));
        font-size: 12px;
      }
    }
  }

  .foods-wrapper {
    flex: 1;

    .title {
      padding-left: 14px;
      height: 26px;
      line-height: 26px;
      border-left: 2px solid #d9dde1;
      font-size: 12px;
      color: rgb(147, 153, 159);
      background: #f3f5f7;
    }

    .food-item {
      display: flex;
      margin: 18px;
      padding-bottom: 18px;
      border-1px(rgba(7, 17, 27, 0.1));

      &:last-child {
        border-none();
        margin-bottom: 0;
      }

      .icon {
        flex: 0 0 57px;
        margin-right: 10px;
      }

      .content {
        flex: 1;

        .name {
          margin: 2px 0 8px 0;
          height: 14px;
          line-height: 14px;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }

        .desc, .extra {
          line-height: 10px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }

        .desc {
          line-height: 12px;
          margin-bottom: 8px;
        }

        .extra {
          .count {
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
          right: 0;
          bottom: 12px;
        }
      }
    }
  }
}
</style>