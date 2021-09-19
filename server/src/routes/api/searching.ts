/*!
 * Koa CMS Backstage management
 *
 *
 * Released under the ISC license
 *
 *
 */
import * as Router from 'koa-router'
import {
  getRestaurantAndFoodsList,
} from '../../controller/api/searching'
const router = new Router();

router.prefix('/api/searching');

// 搜索附近商家和食品
router.get('/restaurants_and_foods', async (ctx: any) => {
  let query = ctx.request.query;
  console.log("*************query*************")
  console.log(query)
  ctx.body = await getRestaurantAndFoodsList(query);
});
export default router