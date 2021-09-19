import * as Router from "koa-router";
import { updatePay,savePay,findPay,initPay, payNotice, listenStatus,testPay } from "../../controller/api/pay";
import { validatorUser } from "../../middleware/validator";
const router = new Router();

router.prefix("/api/pay");


/**
 * 支付测试
*/
router.post("/savepay", validatorUser, async (ctx: any, next) => {
  const params = ctx.request.body
  console.log("routes.api.pay.savepay---->")
  console.log(params)
  ctx.body = await savePay(params);
});

/**
 * 支付测试
*/
// router.post("/testpay", validatorUser, async (ctx: any, next) => {
//   console.log("/routes/api/pay.ts-----支付测试---->")
//   ctx.body = await testPay();
// });
router.post("/testpay",validatorUser, async (ctx: any, next) => {
  console.log("/routes/api/pay.ts-----支付测试---->")
  const params = ctx.request.body
  // console.log(ctx.request)
  ctx.body = await testPay(params);
});

/**
 * 准备支付
*/
router.get("/findpay",validatorUser, async (ctx: any, next) => {
  console.log("/routes/api/pay.findpay--->")
  const query = ctx.request.query
  let params:any = JSON.parse(JSON.stringify(query))
  console.log(params) //{ order_id: '5fd1c74b7704f4b44830cf9e' }
  // console.log(ctx.request)
  ctx.body = await findPay(params);
});

/**
 * 更新支付
*/
router.post("/updatepay",validatorUser, async (ctx: any, next) => {
  console.log("/routes/api/pay.updatepay--->")
  const params = ctx.request.body
  console.log(params)
  // console.log(ctx.request)
  ctx.body = await updatePay(params);
});


/**
 * 准备支付
*/
router.post("/init", validatorUser, async (ctx: any, next) => {
  let { id, pay_remain_time, update_time, is_update, pay_time, delivery_time, json } = ctx.request.body;
  let { user_id } = ctx.session.userinfo;
  let params: any= {
    id, user_id, pay_remain_time, update_time, is_update, pay_time, delivery_time, json
  } 
  ctx.body = await initPay(params);
});


/**
 * //支付异步通知
*/
router.post('/notify_url', async (ctx: any, next) => {
  // let notifyUrl = ctx.req.notifyUrl
  ctx.body = await payNotice(ctx.request.body);
});

/**
 * //支付异步通知
*/
router.get('/listen_status', validatorUser, async (ctx: any, next) => {
  let params:any = ctx.request.body
  ctx.body = await listenStatus(params);
});


export default router;
