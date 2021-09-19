/*!
 * Koa CMS Backstage management
 *
 * Copyright JS suwenhao
 * Released under the ISC license
 * Email swh1057607246@qq.com
 *
 */
import * as Mongoose from "mongoose";

const Schema = Mongoose.Schema;
let OrderSchema = new Schema({
  //old:
  // userId: { type: String }, // 用户_id
  // dataSrc: { type: String, default: "" }, // 订单数据json地址
  // orderType: { type: Number, default: 1 }, // 订单状态 1，未支付，2，待发货，3，待收货，4，待评价，5，已取消
  // tel: { type: String, default: "" }, // 手机号
  // person: { type: String, default: "" }, // 下单用户
  // address: { type: String, default: "" }, // 地址
  // remark: { type: String, default: "" }, // 备注
  // logistics: { type: String, default: "" }, // 物流单号
  // create_time: { type: Number, default: Date.now }, // 创建时间
  // pay_time: { type: Number, default: null }, // 付款时间
  // fahuo_time: { type: Number, default: null }, // 发货时间
  // update_time: { type: Number, default: null }, // 修改时间
  // is_update: { type: Boolean, default: false }, // 是否已经修改过订单，只允许修改一次

  //new:
  shop_id: { type: Schema.Types.ObjectId, isRequired: true}, // 商铺id
  foods:{type: Array, default: [] }, //订单中的菜品
  total_price:{ type: Number}, // 订单总价
  address: { type: Schema.Types.ObjectId, isRequired: true}, // 地址id
  user_id: { type: Schema.Types.ObjectId, isRequired: true}, // 用户id
  remark: { type: String, default: "" }, // 备注
  orderType: { type: Number, default: 1 }, // 订单状态 1，未支付，2，待发货，3，待收货，4，待评价，5，已取消
  shipping_fee:{ type: Number, default: 1 }, // 配送费默认一元
  create_time: { type: Number, default: Date.now }, // 创建时间
  pay_remain_time:{type: Number, default: 900}, //默认900秒
  update_time: { type: Number }, //修改时间
  is_update: { type: Boolean, default: false }, // 是否已经修改过订单，只允许修改一次
  pay_time: { type: Number}, // 付款时间
  delivery_time:  { type: Number},//发货时间
  dataSrc: { type: String, default: "" }, // 订单数据json地址
});

let OrderModel = Mongoose.model("orders", OrderSchema);

export default OrderModel;
