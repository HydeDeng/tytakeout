import { CommentsModel } from '../../db/model/index'
import * as Mongoose from 'mongoose'

/**
 * 添加评论
 * @param {object} params
 */
export const add = async (params: any) => {
  try {
    return await CommentsModel.create(params)
  } catch (e) {
    return null
  }
}

/**
 * 修改评论
 * @param {string} _id
 * @param {object} params
 */
export const update = async (_id: any, params: any) => {
  try {
    return await CommentsModel.findOneAndUpdate({ _id }, params);
  } catch (e) {
    return null
  }
}
/**
 * 删除店铺评论
 * @param {array} shop_id comment id
 */
export const removeMore = async (shop_id: any) => {
  shop_id = Mongoose.Types.ObjectId(shop_id)
  try {
    return await CommentsModel.deleteMany({ shop_id });
  } catch (e) {
    return null;
  }
}
/**
 * 删除单独评论
 * @param {array} _id 评论id
 */
export const remove = async (_id: any) => {
  _id = Mongoose.Types.ObjectId(_id)
  try {
    return await CommentsModel.deleteMany({ _id });
  } catch (e) {
    return null;
  }
}
/**
 * 获取评论列表
 * @param {object} params 分页数据
 */
export const list = async (params: any) => {
  console.log("services/api/comments.ts---------->params")
  console.log(params)
  params.offset = params.offset - 1
  let {query} = params
  // let query = {
  //   shop_id
  // }
  // query = params.query
  // query.shop_id = params.query.shop_id;
  console.log("services/api/comments.ts---------->query")
  console.log(query)
  let {shop_id} = query
  let skip = params.limit * params.offset
  try {
    let data = await CommentsModel.find({shop_id}).limit(params.limit * 1).skip(skip).sort({create_time: -1})
    let count = await CommentsModel.countDocuments(query)
    return {
      data,
      count
    }
  } catch (e) {
    return null;
  }
}
/**
 * 根据餐馆获取列表
 * @param {string} shop_id 餐馆id
 */
export const shopQueryComments = async (shop_id?: any) => {
    shop_id = Mongoose.Types.ObjectId(shop_id)
    let params: any = {}
    if (shop_id) {
      params.shop_id = shop_id
    }
    try {
      return await CommentsModel.find(params)
    } catch (e) {
      return null;
    }
  }
// export const shopQueryComments = async (shop_id?: string) => {
//   let params: any = {}
//   if (shop_id) {
//     params.shop_id = shop_id
//   }
//   try {
//     return await CommentsModel.find(params)
//   } catch (e) {
//     return null;
//   }
// }

/**
 * 根据ID获取详情
 * @param {string} _id 食品id
 */
export const queryComment = async (_id?: any) => {
  let params: any = {
    _id
  }
  try {
    return await CommentsModel.findOne(params)
  } catch (e) {
    return null;
  }
}
