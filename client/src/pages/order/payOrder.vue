<template>
<div class="payorder-page">
    <Header class="header-warp" @return="headerReturn">支付订单</Header>
    <div v-if="show" class="page-content">
      <div class="content-main">
          <div class="in-order">
              <div class="in-countdown">
              支付剩余时间
              <span class="in-clock" >{{pay_remain_time_str}}</span>
              </div>
              <div class="in-order-fee">
                  <span class="in-order-fee-unit">¥</span>
                  <span class="in-need-final-fee">{{amount}}</span>
              </div>
              <div class="in-total-fee"></div>
              <div class="in-order-title">{{shop.name}}-{{order_id}}</div>
          </div>
        
        <div class="in-pay-method">
          <!-- <van-radio-group :value="radio" @change="dataChange"> -->
          <van-radio-group :value="radio">
                <van-cell-group>
                    <van-cell icon="wechat" title="微信支付" clickable data-name="1"  @click="onClick">
                        <van-radio slot="right-icon" checked-color="#FFD100" name="1" />
                    </van-cell>
                    <van-cell icon="alipay" title="支付宝支付" clickable data-name="2"  @click="onClick">                
                        <van-radio slot="right-icon" checked-color="#FFD100" name="2" />
                    </van-cell>
                </van-cell-group>
            </van-radio-group>
            
        </div>
        <div class="in-btn-line">
            <p class="in-btn-box in-btn-box-fixed  ">
              <van-button color="#FFD100" type="info"  block native-type="button" @click="goPay" >
              确认支付
            </van-button>
            </p>
        </div>
      </div>
    </div>
    <div v-if="!show" class="page-content">
      <Loading />
    </div>
</div>
</template>
<script lang="ts">
import Cookies from "js-cookie";
// @ts-ignore
import { IMAGE_URL } from "@/config";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
// @ts-ignore
import { getArealist } from "@/service";
// @ts-ignore
import { activePrice } from "@/utils";
// @ts-ignore
import orderMixin from "@/pages/mixins/order";
import payFooter from "@/components/Order/payFooter.vue";
import orderRemark from "./orderRemark.vue";
// @ts-ignore
import StorageModel, {
  SHOPINFO,
  SELECTADDRESS,
  TOKEN,
  USERID,
  PAY_REMAIN_TIME,
  PAYTYPE
} from "@/utils/storage";
import { namespace } from "vuex-class";
// @ts-ignore
import {testPay,updateOrder,savePay,findPay,updatePay} from "@/service";

const Storage = new StorageModel();
const ShopModule = namespace("shop");

@Component({
  components: { payFooter, orderRemark },
  mixins: [orderMixin],
  computed: {
    token() {
      return Cookies.get(TOKEN) || null;
    },
    psf() {
      let date = new Date();
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D = date.getDate();
      let end = new Date(`${Y}${M}${D} 22:00:00`);
      return (date.getTime() > end.getTime()
        ? this.shop.shipping_fee[1]
        : this.shop.shipping_fee[0]
      ).toFixed(2);
    },
    calcmoney() {
      if (Object.keys(this.cart).length > 0 && this.cart[this.shop._id]) {
        let arr = Object.values(this.cart[this.shop._id]);
        console.log(arr)
        let price = 0;
        arr.forEach((item: any) => {
          price += item.num * this.calcPrice(item.data);
        });
        let newPrice = activePrice(this.shop.activitie_data, price);
        console.log(newPrice)
        return newPrice.toFixed(2);
      } else {
        return Number(0).toFixed(2);
      }
    }
  },
  created() {
    if (!this.token) {
      // console.log(this.$route.path)
      this.$router.push({ name: "login", query: { path: this.$route.path } });
      return;
    }
    this.init();
  },
  mounted() {
    window.addEventListener('pagehide',()=>{
      //页面刷新也需要保存支付剩余时间
      Storage.set(PAYTYPE, this.payType);
      if (this.pay_remain_time>0) {
        Storage.set(PAY_REMAIN_TIME, this.pay_remain_time)
      }else(
        Storage.remove(PAY_REMAIN_TIME)
      )      
    })    
    // window.addEventListener("beforeunload", function(e) {
    //       console.log("I want to cancel");
    // // Cancel the event
    //     // e.preventDefault();
    //       // Chrome requires returnValue to be set
    //       // e.returnValue = "hello";
    // });
  },

  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
  }
})

export default class PayOrder extends Vue {
  shop = Storage.get(SHOPINFO);
  show = true;
  address = null;
  IMAGE_URL: string = IMAGE_URL;
  radio: string = "";
  amount: number;
  orderType: number;
  order_id: any;
  user_id: any;
  foods:any;
  items: any = {};
  pay_remain_time: number; 
  pay_remain_time_str: string;
  payType: Number; //1.alipay, 2.wechat
  timer: any;
  
  @ShopModule.State(state => state.cart) cart;
  @ShopModule.Mutation("clearCart") clearCart;
  // foodList = [];
  
  // @Prop({
  //   type: Object,
  //   default: {}
  // }) data!: any;

  @Watch('radio')
  radioChange(event){
    console.log("Change支付方式")
  // @ts-ignore
  // this.radio = event.detail
  }

  // @Watch('pay_remain_time')
  // remainTimeChange(){
  //   console.log("watch pay_remain_time")
  //   this.$nextTick(() => {
  //           let dom = document.querySelector('.in-clock')
  //     // @ts-ignore
  //     dom.textContent = this.pay_remain_time;
  //   })
  // }

  formatTime(time: number):any{
    let reuslt: String = "";
    let minute: number = Math.floor(time/60);
    let second: number;
    if (time < 60){//e.g 00:59
      second = time;
    }else if (time%60 === 0){//e.g 10:00
      second = 0;
    }else{//e.g 10:01
      second = time%60;
    }
    if (minute < 10){
      if (second < 10){
        reuslt = "0" + String(minute) + ":" + "0" + String(second);
      }else{
        reuslt = "0" + String(minute) + ":" + String(second);
      }
    }else{
      if (second < 10){
        reuslt = String(minute) + ":" + "0" + String(second);
      }else{
        reuslt = String(minute) + ":" + String(second);
      }
    }
    return reuslt;
  }

  calcRemainTime(){
    let reaminTime = Storage.get(PAY_REMAIN_TIME)
    console.log("=========reaminTime==========")
    console.log(reaminTime)
    if (reaminTime){
      this.pay_remain_time = reaminTime;
    }else {
      this.pay_remain_time = 900; //15分钟
    }
    this.pay_remain_time_str = this.formatTime(this.pay_remain_time)
     this.timer = setInterval(() => {
      this.pay_remain_time = this.pay_remain_time - 1;
      console.log("this.pay_remain_time = ")
      console.log(this.pay_remain_time)
      console.log(this.formatTime(this.pay_remain_time))
      this.$nextTick(() => {
        let dom = document.querySelector('.in-clock')
        // @ts-ignore
        dom.textContent = this.formatTime(this.pay_remain_time);
    })
      if (this.pay_remain_time === 0){
        clearInterval(this.timer)
      }
    }, 1000);
  }

  onClick(event) {
    const { name } = event.currentTarget.dataset;
    // console.log(event.currentTarget.dataset)
    this.radio = name;
    if (this.radio === "1"){//微信
      console.log("欢迎使用微信支付！")
      this.payType = 1;
    }else if(this.radio === "2"){//支付宝
      console.log("支付就用支付宝！")
      this.payType = 2;
    }else{
      console.log("没有这种支付方式")
    }
  }

  headerReturn() {//到了此页面只能返回订单生成页面
    // this.$router.push(`/shop?_id=${this.shop._id}`);
    this.$dialog.confirm({
      title: '用户提示',
      message: '是否退出支付？'
    }).then(() => {
      Storage.set(PAYTYPE, this.payType)
      Storage.remove(PAY_REMAIN_TIME)      
      location.href='/'
    }).catch(() => {});

    // if (this.pay_remain_time>0) {
    //   Storage.set(PAY_REMAIN_TIME, this.pay_remain_time)
    // }else(
    //   //付款超时
    //   Storage.remove(PAY_REMAIN_TIME)
    // )
    // this.$router.push('/pay');
    // this.$router.push({name: 'pay'})
  }
  calcPrice(jtem) {
    // return jtem.discount < 10
    //   ? ((jtem.discount / 10) * jtem.price).toFixed(2)
    //   : parseFloat(jtem.price).toFixed(2);
  }
  init() {
    console.log("payOrder********init********route.query")
    console.log(this.$route.query)
    this.amount = Number(this.$route.query.amount);
    this.orderType = Number(this.$route.query.orderType);
    this.order_id = this.$route.query.order_id;
    this.user_id = this.$route.query.user_id;
    this.foods = this.$route.query.foods;

    this.payType = Storage.get(PAYTYPE);
    if(this.payType === 1){
      this.radio = "1";
    }else if (this.payType === 2){
      this.radio = "2";
    }else{//第一次进来默认选择支付宝支付
      this.payType = 2
      this.radio = "2";
    }

    if (this.timer) {
      clearInterval(this.timer);
      } 
    this.calcRemainTime();
      
  }

  gotoAddressList() {
    this.$router.push("/addrlist/pay");
  }

  async goPay(){
    Storage.set(PAYTYPE, this.payType)
    Storage.remove(PAY_REMAIN_TIME)
    // Storage.set(PAY_REMAIN_TIME, this.pay_remain_time)
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }

    //保存付款时间和 pay_remain_time by order_id
    let orderRes: any = await updateOrder({
      order_id:this.order_id, 
      pay_time:new Date().getTime(), 
      pay_remain_time:this.pay_remain_time
    });
    console.log("orderRes-------------->")
    console.log(orderRes)
      if (orderRes.erron === 0){
            //检查out_trade_no是否存在by order_id
          let {out_trade_no} = await findPay({
            order_id:this.order_id, 
          });
          console.log("out_trade_no-------------->")
          console.log(out_trade_no)
          if (out_trade_no){//更新订单
            this.items = {
              subject: this.foods,
              out_trade_no,
              total_amount: this.amount,
              body: '订单描述在这里'
            }
            //保存pay{ erron, data, message } 
            let payRes: any = await updatePay({
              id:out_trade_no, //这个就是out_trade_no
              amount:this.amount, 
              payType:this.payType, //支付渠道,1=支付宝，2=微信
              // orderType: { type: Number, default: 1 }, // 订单状态 1，未支付，2，待发货，3，待收货，4，待评价，5，已取消
              //status: 未支付，支付成功
              method: "wap", //wap or scan
              order_id: this.order_id,
              // code:200
              // user_id: this.user_id, // 用户id
              // created_time:new Date().getTime(), 
            });
              if (payRes.erron === 0){
                //to-do 这里还需要接受付款成功的回调
                let result = await testPay(this.items)
                console.log("******testPay result******")
                console.log(result)
                //to-do savePay 
                // status: 未支付，支付成功
                // code:200
                // orderType
                if (result){
                  this.clearCart({
                    _id: this.shop._id
                  });  
                }
              }else{
                console.log("付款更新错误！")
              }            
          }else{//创建订单         
            //保存pay{ erron, data, message } 
            let payRes: any = await savePay({
              // id:out_trade_no, //创建订单的时候，由服务器自增创建。out_trade_no
                amount:this.amount, 
                payType:this.payType, //支付渠道,1=支付宝，2=微信
                // orderType: { type: Number, default: 1 }, // 订单状态 1，未支付，2，待发货，3，待收货，4，待评价，5，已取消
                //pay_status: 默认为未支付
                method: "wap", //wap or scan
                order_id: this.order_id,
                // code:200
                user_id: this.user_id, // 用户id
                // created_time:new Date().getTime(), //创建订单的时候，由服务器自增创建。
            });
            console.log("payOrder.payRes------>")
            console.log(payRes)
              if (payRes.erron === 0){
                  this.items = {
                    subject: this.shop.name,
                    out_trade_no:payRes.data.id,
                    total_amount: this.amount,
                    body: '订单描述在这里'
                  }
                  console.log("******testPay this.items******")
                  console.log(this.items)                   
                  //to-do 这里还需要接受付款成功的回调
                  let result = await testPay(this.items)
                  console.log("******testPay result 2******")
                  console.log(result)
                  //to-do savePay 
                  // pay_status: 未支付，支付成功
                  // code:200
                  // orderType
                if (result){
                  this.clearCart({
                    _id: this.shop._id
                  });  
                }                  
              }else{
                  console.log("付款创建错误！")
              }              
          }
      }else{
        console.log("付款时间在order表中保存错误！")
      }
  }
    
}
</script>
<style lang="less" scoped>
.payorder-page {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #f5f5f5;
    margin: 0 auto;
    // width: 7.5rem;
    color: #4a494b;
    font-size: 15px;
    line-height: 2.5;
    // font-family: MTfin, "DINAlternate-Bold", "PingFang SC", "Helvetica Neue", Helvetica, Arial, sans-serif;
  .page-content {
    flex: 1;
    overflow-y: scroll;
    .content-main {
      margin: 10px;
      .in-order{
          padding: 1.32rem 0 1.22rem;
          text-align: center;
          background-color: #fff;
          .in-countdown{
              color: #999;
              font-size: 0.8rem;
              line-height: 2.0;
          }
          .in-order-fee{
              margin-top: .04rem;
              line-height: 0.9;
              font-family: MTfin, "DINAlternate-Bold", "PingFang SC", "Helvetica Neue", Helvetica, Arial, sans-serif;
              font-size: 2.8rem;
              color: #333;
              letter-spacing: -0.44px;
              .in-order-fee-unit{
                  font-size: 1.48rem;
                  margin-right: .08rem;
              }
          }
          .in-total-fee{
              text-decoration: line-through;
              color: #333;
              font-size: .79rem;
          }
          .in-order-title{
              font-size: .79rem;
              color: #999;
              letter-spacing: -0.24px;
          }
      }
      .in-pay-method{
          padding-top: .3rem;
          padding-bottom: .3rem;
          background-color: transparent;
      }
      .in-btn-line{
          height: .1rem;
          margin-top: .3rem;
          background-color: #fff;
          .in-btn-box {
              width: 20.5rem;
              padding: 2.5rem 1.5rem;
              margin: 0;
              // background-color: #fff;
              border-color: rgb(235, 167, 167);
              .van-button{
                color: #222 !important;
                font-size:1.06rem;
                border-radius: 0.48rem;
              }
          }
          .in-btn-box-fixed {
            position: fixed;
            bottom: 0;
            left: 0;
            // .in-confirm-btn {
            //     width: 100%;
            // }
            // .btn-submit {
            //     background-color: #FFD100;
            //     font-weight: bold;
            //     border: none;
            //     color: rgba(0, 0, 0, 0.7);
            //     border-radius: 0.48rem;
            //     font-size: 1.06rem;
            // }
            // .btn{
            //     line-height: 2.92rem;
            //     text-align: center;
            //     vertical-align: middle;
            //     padding: 0 1.4rem;
            //     background-clip: padding-box;
            // }
        }

      }
    }
  }
}
</style>