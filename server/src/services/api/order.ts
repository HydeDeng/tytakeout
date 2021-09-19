/*!
 * Koa CMS Backstage management
 *
 * Copyright JS suwenhao
 * Released under the ISC license
 * Email swh1057607246@qq.com
 *
 */
import { OrderModel } from '../../db/model/index'
import * as Mongoose from 'mongoose'

/**
 * 保存订单信息
 * @param {object} params 订单数据
 */
export const save = async (params?: any) => {
  try {
    return await OrderModel.create(params);
  } catch (e) {
    return null;
  }
}
/**
 * 获取用户订单列表
 * @param {object} userId 用户id
 */
export const list = async (userId?: any) => {
  let params: any = {}
  if (userId) {
    params.userId = userId
  }
  try {
    return await OrderModel.find(params);
  } catch (e) {
    return null;
  }
}

/**
 * 获取某个订单
 * @param {object} orderId 订单id
 */
export const findOneOrderByObjId = async (orderId?: any) => {
  let params: any = {}
  if (orderId) {
    if (typeof orderId === 'string'){
        orderId = Mongoose.Types.ObjectId(orderId)
  }
    params._id = orderId
  }
  try {
    return await OrderModel.findOne(params);
  } catch (e) {
    return null;
  }
}

/**
 * 更新某个订单
 * @param {object} orderId 订单id
 */
export const update = async (data?: any) => {
  let params: any = {}
  if (data.order_id) {
    if (typeof data.order_id === 'string'){
      data.order_id = Mongoose.Types.ObjectId(data.order_id)
    }
    params._id = data.order_id
    params.pay_time = data.pay_time
    params.pay_remain_time = data.pay_remain_time
  }
  try {
    // return await OrderModel.update(params);
    return await OrderModel.updateMany({_id: params._id}, {$set: {pay_time: params.pay_time, pay_remain_time: params.pay_remain_time}})
  } catch (e) {
    return null;
  }
}