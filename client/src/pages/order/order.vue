<template>
  <div class="order-page">
    <Header class="header-warp" @return="headerReturn">我的订单</Header>
    <div class="page-content">
      <div v-if="!this.token">
       <!--没有登录-->
        <div class="to-login-container">
          <div class="avatar">
            <i class="iconfont icon">&#xe623;</i>
          </div>
          <span class="tip">您还没有登录，请登录后查看订单</span>
            <span class="to-login" @click.stop="goLogin">登录/注册</span>
        </div>
      </div>
      <!--登录后-->
      <div class="no-order" v-else-if="noOrder">
          <span>订单空空如也，快去购物吧！</span>
      </div>
      <div class="order-list" v-else>
        <van-panel v-for="(item, i) in data" :key="i" :title="item.orderData.shop.name">
          <div class="cart-list" @click="gotoDetail(item)">
            <van-card
              v-for="(jtem, j) in item.orderData.order"
              :key="j"
              :num="jtem.num"
              :price="calcPrice(jtem.data)"
              :desc="jtem.data.selectSpec?jtem.data.selectSpec:''"
              :title="jtem.data.name"
              :thumb="IMAGE_URL + jtem.data.image_path"
              :origin-price="jtem.data.price"
            />
          </div>
          <div class="type">
            <span>订单状态：</span>
            <span
              :class="{
              green:item.orderType===4||item.orderType===5,
              orange: item.orderType!==4&&item.orderType!==5,
            }"
            >{{calcOrderType(item.orderType)}}</span>
          </div>
          <div class="moneys">
            <div>
              <span>优惠：</span>
              <span
                class="youh"
              >￥{{parseFloat(totalPrice(item.orderData) - totalMoney(item.orderData)).toFixed(2)}}</span>
            </div>
            <div>
              <span>实付款：</span>
              <span class="money">￥{{totalMoney(item.orderData)}}</span>
            </div>
          </div>
          <div class="btns">
            <van-button v-if="item.orderType===1" type="danger" size="small" @click="cancelOrder">取消订单</van-button>
            <van-button
              v-if="item.orderType===1"
              class="ycolor"
              color="#ffd84d"
              type="info"
              size="small"
              @click="payOrder"
            >支付</van-button>
            <van-button
              v-if="item.orderType===2"
              class="ycolor"
              color="#ffd84d"
              type="info"
              size="small"
            >提醒发货</van-button>
            <van-button
              v-if="item.orderType===3"
              class="ycolor"
              color="#ffd84d"
              type="info"
              size="small"
            >确认收货</van-button>
            <van-button
              v-if="item.orderType===4"
              class="ycolor"
              color="#ffd84d"
              type="info"
              size="small"
            >评价</van-button>
            <van-button
              v-if="item.orderType===5"
              class="ycolor"
              color="#ffd84d"
              type="info"
              size="small"
            >删除订单</van-button>
          </div>
        </van-panel>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Cookies from "js-cookie";
// @ts-ignore
import { IMAGE_URL } from "@/config";
// @ts-ignore
import { activePrice } from "@/utils";
// @ts-ignore
import { orderList, testPay } from "@/service";
import { Component, Vue } from "vue-property-decorator";
// @ts-ignore
import myMixin from "@/pages/mixins/my";
// @ts-ignore
import StorageModel, { TOKEN, USERID, ORDER_DETAIL } from "@/utils/storage";

const Storage = new StorageModel();
@Component({
  mixins: [myMixin],
  computed: {
    token() {
      return Cookies.get(TOKEN) || null;
    }
  },
  created() {
    if (!this.token) {
      return;
    }
    this.init();
  }
})
export default class Order extends Vue {
  data: any = [];
  IMAGE_URL: string = IMAGE_URL;
  noOrder: boolean = false;
  async init() {
    let { erron, data, message } = await orderList(this.data);
    if(this.data.length){
      this.noOrder = false;
    }
    if (erron === 0) {
      this.data = data;
    }
  }
  gotoDetail(item) {
    Storage.set(ORDER_DETAIL, item);
    this.$router.push("/orderDetail");
  }
  goLogin(){
    this.$router.push("/login")
  }
  cancelOrder(){
    //提醒用户->选择yes->把列表里面的这单清空,把数据库相关文件清空
    //
  }
  payOrder(){
    //支付测试
    console.log("支付测试---->")
    console.log(this.data)
    let result = this.testPay(this.data);
    console.log("支付测试结果---->")
    console.log(result)
      // this.$router.push({path: '/pay'})
      //  let res =  await submitOrder({restaurant_id: this.restaurant_id, foods, address_id: this.defineAddress.id})
      //   if (res){
      //     this.$router.push({path: '/pay', query: {order_id: res.data.order_id}})
      //   }
  }
  async testPay(data:any){
    return await testPay(data);
  }
  totalMoney(orderData) {
    let arr: any = Object.values(orderData.order);
    let price = 0;
    Object.keys(arr).forEach((item: any) => {
      let specPrice: any = this.calcPrice(arr[item].data);
      price += arr[item].num * specPrice;
    });
    let newPrice = activePrice(orderData.shop.activitie_data, price);
    return newPrice.toFixed(2);
  }
  totalPrice(orderData) {
    let arr: any = Object.values(orderData.order);
    let price = 0;
    Object.keys(arr).forEach((item: any) => {
      price += arr[item].num * arr[item].data.price;
    });
    return price.toFixed(2);
  }
  calcPrice(jtem) {
    return jtem.discount < 10
      ? ((jtem.discount / 10) * jtem.price).toFixed(2)
      : parseFloat(jtem.price).toFixed(2);
  }
  calcOrderType(orderType) {
    let map = {
      1: "未支付",
      2: "待发货",
      3: "待收货",
      4: "已完成",
      5: "已完成"
    };
    return map[orderType];
  }
}
</script>
<style lang="less" scoped>
.order-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #f5f5f5;
  .page-content {
    flex: 1;
    margin: 10px;
    overflow-y: auto;
    .to-login-container {
      width: 100%;
      position: absolute;
      top: 45%;
      right:0.1%;
      transform: translateY(-50%);
      text-align: center;
      .avatar {
        text-align: center;
        .icon {
          font-size: 2rem;
          color: rgb(214, 214, 214);
        }
      }
      .tip {
        font-size: 0.8rem;
        display: block;
        color: rgb(155, 153, 151);
        margin: 0.5rem 0;
        text-align: center;
      }
      .to-login {
        display: inline-block;
        background:  #ffd161;
        width: 15rem;
        font-size: 0.9rem;
        line-height: 2.5rem;
        border-radius: 0.2rem;
      }
    }

    .no-order {
      width: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      text-align: center;
      transform: translate(-50%, -50%);
      span {
        font-size: 0.9rem;
      }
    }

    .order-list {
      .van-panel {
        margin-bottom: 10px;
      }
      .van-card {
        background-color: #fff;
        .van-card__thumb {
          width: 50px;
          height: 50px;
          .van-image {
            border: 1px solid #ddd;
          }
        }
        .van-card__content {
          min-height: 50px;
        }
      }
      .moneys {
        border-top: 1px solid #ddd;
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        align-items: center;
        padding: 8px;
        > div {
          display: flex;
          align-items: center;
        }
        .youh {
          color: #999;
        }
        .money {
          color: #e82a2a;
          font-size: 14px;
        }
      }
      .type {
        border-top: 1px solid #ddd;
        padding: 8px;
        font-size: 12px;
        .orange {
          color: orange;
          font-size: 14px;
        }
        .green {
          color: green;
          font-size: 14px;
        }
      }
      .btns {
        border-top: 1px solid #ddd;
        display: flex;
        justify-content: flex-end;
        padding: 5px;
        .van-button {
          margin-left: 5px;
        }
        .ycolor {
          color: #222 !important;
        }
      }
    }
  }
}
</style>