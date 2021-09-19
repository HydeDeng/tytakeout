/*!
 * Koa CMS Backstage management
 *
 * Copyright JS siro
 * Released under the ISC license
 * Email siro@foxmail.com
 *
 */
import * as Mongoose from "mongoose";

const Schema = Mongoose.Schema;
let PaySchema = new Schema({
  //new:
  id: { type: Number},			//id
  amount:{ type: Number}, // 订单总价
  payType: { type: Number}, //支付渠道,1=支付宝，2=微信
  orderType: { type: Number, default:1}, // 订单状态 1，未支付，2，待发货，3，待收货，4，待评价，5，已取消
  method: { type: String, default: "" }, // 支付方式：scan,wap
  order_id: { type: Schema.Types.ObjectId, isRequired: true}, // 订单id
  code:{ type: Number}, //支付状态码 如：200
  user_id: { type: Schema.Types.ObjectId, isRequired: true}, // 用户id
  create_time: { type: Number, default: Date.now }, // 创建时间
  pay_status: { type: Number, default: 1 }, //1.未支付，2.支付成功
});

let PayModel = Mongoose.model("pays", PaySchema);

export default PayModel;
