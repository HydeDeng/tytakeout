/*!
 * Koa CMS Backstage management
 *
 * Copyright JS suwenhao
 * Released under the ISC license
 * Email swh1057607246@qq.com
 *
 */
import * as Router from "koa-router";
import { saveOrder, updateOrder, orderList,findOrder } from "../../controller/api/order";
import { validatorUser } from "../../middleware/validator";
const router = new Router();

router.prefix("/api/order");

// 保存订单
router.post("/save", validatorUser, async (ctx: any, next) => {
  let { shop_id, foods, total_price, address, remark, orderType, shipping_fee, pay_remain_time, json } = ctx.request.body;
  let { user_id } = ctx.session.userinfo;
  ctx.body = await saveOrder({
    shop_id, 
    foods, 
    total_price, 
    address, 
    user_id, 
    remark, 
    orderType, 
    shipping_fee, 
    pay_remain_time, 
    // update_time, 
    // is_update, 
    // pay_time, 
    // delivery_time,
    json,
  });
});

// 获取订单列表
router.get("/list", validatorUser, async (ctx: any, next) => {
  let { _id } = ctx.session.userinfo;
  ctx.body = await orderList({ _id });
});

// 更新订单
router.post("/update", validatorUser, async (ctx: any, next) => {
  let data = ctx.request.body;
  // let { user_id } = ctx.session.userinfo;
  ctx.body = await updateOrder(data);
});

// 获取指定订单
router.get("/find", validatorUser, async (ctx: any, next) => {
  const query = ctx.request.query;
  let str:any = JSON.stringify(query);
  str = JSON.parse(str) 
  console.log("routes.api.orders.ts--------->find.str")
  console.log(str) //{ order_id: '5fd190353717f40ace69ab96' }
  // let { user_id } = ctx.session.userinfo;
  ctx.body = await findOrder(str);
});

export default router;
