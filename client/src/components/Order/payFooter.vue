<template>
  <div class="payFooter-page">
    <div></div>
    <div class="pay-btn">
      <div class="left">
        <span class="price">￥{{calcmoney}}</span>
        <span class="origin">已优惠￥{{parseFloat(calcprice - calcmoney).toFixed(2)}}</span>
      </div>
      <div class="right">
        <van-button :loading="loading" size="small" type="primary" @click="testpay">支付</van-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
// @ts-ignore
import { activePrice } from "@/utils";
// @ts-ignore
import { findOrder,saveOrder,testPay } from "@/service";
// @ts-ignore
import StorageModel, { SHOPINFO, TOKEN, USERID ,LATEST_ORDER } from "@/utils/storage";

const ShopModule = namespace("shop");
const Storage = new StorageModel();

@Component({
  computed: {
    calcmoney() {
      if (Object.keys(this.cart).length > 0 && this.cart[this.shop._id]) {
        let arr = Object.values(this.cart[this.shop._id]);
        let price = 0;
        arr.forEach((item: any) => {
          price += item.num * this.calcPrice(item.data);
        });
        let newPrice = activePrice(this.shop.activitie_data, price);
        return newPrice.toFixed(2);
      } else {
        return Number(0).toFixed(2);
      }
    },
    calcprice() {
      if (Object.keys(this.cart).length > 0 && this.cart[this.shop._id]) {
        let arr = Object.values(this.cart[this.shop._id]);
        let price = 0;
        arr.forEach((item: any) => {
          price += item.num * item.data.price;
        });
        return price.toFixed(2);
      } else {
        return Number(0).toFixed(2);
      }
    }
  }
})
export default class PayFooter extends Vue {
  shop = Storage.get(SHOPINFO);
  loading: boolean = false;
  // latestOrder = Storage.get(LATEST_ORDER);
  @ShopModule.State(state => state.cart) cart;
  @ShopModule.Mutation("clearCart") clearCart;

  @Prop(Object) shop_id!: Object;
  @Prop(Array) foods!: any;
  @Prop(String) total_price!: string;
  @Prop(Object) address!: Object;
  @Prop(Object) user_id!: Object;
  @Prop(String) remark!: string;
  @Prop(Number) orderType!: number;
  @Prop(Number) shipping_fee!: number;
  @Prop(Number) pay_remain_time!: number;  
  // @Prop(Number) update_time!: number;
  // @Prop(Boolean) is_update!: boolean;
  // @Prop(Number) pay_time!: number;  
  // @Prop(Number) delivery_time!: number;  

  calcPrice(jtem) {
    return jtem.discount < 10
      ? ((jtem.discount / 10) * jtem.price).toFixed(2)
      : parseFloat(jtem.price).toFixed(2);
  }
  // async testpay() {//这里的订单无论如何都是最新的
  //   this.loading = true;
  //   //先查一下数据库里面有没有这单
  //   console.log("this.latestOrder------->")
  //   console.log(this.latestOrder)
  //   if (this.latestOrder){//如果storage里保存有订单号
  //     let { data } = await findOrder({
  //       order_id:this.latestOrder, 
  //     });
  //     console.log("payfooter.findOrder.data------->")
  //     console.log(data)
  //     if(data._id === this.latestOrder){//如果数据库里面保存有订单和storage里的订单一致，说明这个订单是最新的
  //     console.log("payfooter.findOrder.data._id------->")
  //     console.log(data._id)
  //       this.goConfimPay(this.total_price, this.orderType, data._id, this.user_id, this.foods)
  //     }else{
  //       console.log("payfooter.saveAndGo------>")
  //       this.saveAndGo();
  //     }
  //   }else{//之前没有任何订单，走下面的逻辑
  //   console.log("payfooter.saveAndGo2------->")
  //     this.saveAndGo();      
  //   }
  //   this.loading = false;
  // }
  async testpay() {//这里的订单无论如何都是最新的
    this.loading = true;
    this.saveAndGo();      
    this.loading = false;
  }

  goConfimPay(amount, orderType, order_id, user_id, foods){
    this.$router.push({path: '/payOrder', query: {amount: amount, orderType: orderType, order_id: order_id, user_id: user_id, foods: foods}})
  }
  
  async saveAndGo(){
    let { erron, data, message } = await saveOrder({
      shop_id:this.shop_id, 
      foods:this.foods, 
      total_price:this.total_price, 
      address:this.address, 
      // user_id:this.user_id, 
      remark:this.remark, 
      orderType:this.orderType, 
      shipping_fee:this.shipping_fee, 
      pay_remain_time:this.pay_remain_time, 
      // update_time:this.update_time, 
      // is_update:this.is_update, 
      // pay_time:this.pay_time, 
      // delivery_time:this.delivery_time,
      json: {
        order: this.cart[this.shop._id],
        shop: this.shop
      }
    });
    if (erron === 0) {
      if(data){
        Storage.set(LATEST_ORDER, data._id)
      }else{
        console.log("没有得到order id!")
      }
      this.goConfimPay(this.total_price, this.orderType, data._id, this.user_id, this.foods)
      
      // this.$toast("下单成功");
      // setTimeout(() => {
      //   this.$router.push({ name: "order" });
      // }, 500);
    }
  }

  // async testpay(){
  //   //支付测试
  //   // console.log("支付测试---->")
  //   // console.log(this.data)
  //   // let result = this.testPay();
  //   console.log("支付测试结果---->")
  //   // console.log(result)
  //   // this.$router.push({path: '/payOrder'})
  //     // this.$router.push({path: '/pay'})

  //      let res =  await saveOrder({shop_id: this.shop_id, foods, address_id: this.defineAddress.id})
  //       if (res){
  //         this.$router.push({path: '/payOrder', query: {order_id: res.data.order_id}})
  //       }
  // }
  // // async testPay(){
  // //   return await testPay();
  // // }
}
</script>
<style lang="less" scoped>
.payFooter-page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .pay-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    background-color: #333;
    color: #fff;
    .left {
      padding-left: 15px;
      display: flex;
      align-items: center;
      .price {
        font-size: 18px;
      }
      .origin {
        margin-left: 10px;
        font-size: 12px;
        color: #999;
      }
    }
    .right {
      padding-right: 10px;
      .van-button {
        padding: 0 20px;
      }
    }
  }
}
</style>