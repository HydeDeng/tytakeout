/*!
 * Koa CMS Backstage management
 *
 * Copyright Siro
 * Released under the ISC license
 * Email siro@foxmail.com
 *
 */
import * as Router from 'koa-router'
import {
  Addcomment,
  Editcomment,
  Deletecomment,
  getCommentsList,
  getCommentInfo,
} from '../../controller/api/comments'
import { reqPermission } from '../../middleware/reqPermission'
const router = new Router();

router.prefix('/api/comments');

// 添加评论， 修改评论， 删除评论，获取店铺评论列表
router.post('/add', async (ctx: any) => {
  const body = ctx.request.body;
  ctx.body = await Addcomment(body);
});
// 修改评论
router.post('/update', reqPermission(), async (ctx: any) => {
  const body = ctx.request.body;
  ctx.body = await Editcomment(body);
});
// 删除评论
router.post('/delete', reqPermission(), async (ctx: any) => {
  const { _id } = ctx.request.body;
  ctx.body = await Deletecomment(_id);
});
// 获取店铺评论列表
router.get('/list', async (ctx: any) => {
  console.log("**********ctx.request**comment*list**********")
  console.log(ctx.request)
  const query = ctx.request.query;
  let str:any = JSON.stringify(query); //输出--query: [Object: null prototype] { abc: '123' } https://blog.csdn.net/weixin_44710964/article/details/103552999
  str = JSON.parse(str)  //输出--str: { abc: '123' }
  console.log("**********query**comment*list**********")
  console.log(str)
  ctx.body = await getCommentsList(str);
});

// 获取评论详情
router.get('/info', async (ctx: any) => {
    console.log("**********我到这里了**********");
    const query = ctx.request.query;
    ctx.body = await getCommentInfo(query);
  });

export default router