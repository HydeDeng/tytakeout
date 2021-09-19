/*!
 * Koa CMS Backstage management
 *
 * Copyright JS suwenhao
 * Released under the ISC license
 * Email swh1057607246@qq.com
 *
 */

import { save, update, list,findOneOrderByObjId } from "../../services/api/order";
import { SuccessModel, ErrorModel } from "../../model/ResModel";
import * as fs from "fs";
import * as path from "path";
import * as uuidv1 from "uuid/v1";
import { getOrderFailInfo, saveOrderFailInfo, getUserOrderFailInfo } from "../../model/ErrorInfo";
import * as Mongoose from 'mongoose'

/**
 *  保存订单
 * @param {object} params 订单数据
 */
export const saveOrder = async (params: any) => {
  // let { remark, json, _id, tel, address, person } = params;
  let {shop_id, foods, total_price, address, user_id, remark, orderType, shipping_fee, pay_remain_time,json}  = params;
  let name = uuidv1() + ".json";
  let root = path.join(__dirname, "../../json/order/");
  fs.writeFileSync(root + name, JSON.stringify(json));
  let savetime = new Date().getTime() + '';
  let data = {
    shop_id, 
    foods, 
    total_price, 
    address, 
    user_id, 
    remark, 
    orderType, 
    shipping_fee, 
    pay_remain_time, 
    dataSrc: name,
    create_time:savetime,
  };
  // console.log(tel, address, person);
  let result = await save(data);
  if (result) {
    return new SuccessModel(result);
  } else {
    return new ErrorModel(saveOrderFailInfo);
  }
};
/**
 *  获取订单列表
 * @param {object} params 数据
 */
export const orderList = async (params: any) => {
  let result: any = await list(params._id);
  if (result) {
    let root = path.join(__dirname, "../../json/order/");
    for (let i = 0; i < result.length; i++) {
      let data = JSON.parse(fs.readFileSync(root + result[i].dataSrc, "utf8"));
      result[i]._doc.orderData = data;
    }
    return new SuccessModel(result);
  } else {
    return new ErrorModel(getUserOrderFailInfo);
  }
};


/**
 * 获取某个订单
 * @param {object} orderId 订单id
 */
export const findOrder = async (params: any) => {
  let {order_id}  = params;
  let data = {
    _id:order_id
  }
  console.log("controller.api.orders.ts--------->findOrder.data")
  console.log(data)
  let result: any = await findOneOrderByObjId(data);
  if (result) {
    return new SuccessModel(result);
  } else {
    return new ErrorModel(getOrderFailInfo);
  }
}

/**
 *  更新订单
 * @param {object} params 订单数据
 */
export const updateOrder = async (params: any) => {
  // let { remark, json, _id, tel, address, person } = params;
  let {order_id, pay_time, pay_remain_time}  = params;
  // let savetime = new Date().getTime() + '';
  let data = {
    order_id,
    pay_time,
    pay_remain_time
  };
  console.log("data==========>")
  console.log(data)
  // console.log(tel, address, person);
  let result = await update(data);
  if (result) {
    return new SuccessModel(result);
  } else {
    return new ErrorModel(saveOrderFailInfo);
  }
};