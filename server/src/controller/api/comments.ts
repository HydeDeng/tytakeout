/*!
 * Koa CMS Backstage management
 *
 * Copyright Siro
 * Released under the ISC license
 * Email siro@foxmail.com
 *
 */

import { add, update, remove, list, queryComment } from '../../services/api/comments'
import { queryShop } from '../../services/sys/shop'
// import { addMany, queryMoreIdSpec, removeMany } from '../../services/sys/spec'
// import { queryCate } from '../../services/sys/foodcate'
// @ts-ignore
import { SuccessModel, ErrorModel } from '../../model/ResModel'
import {
  addCommentFailInfo,
  commentsListFailInfo,
  editCommentFailInfo,
  removeCommentFailInfo,
  queryCommentInfoFailInfo
} from '../../model/ErrorInfo'
// import { formatSpecs } from '../../utils/format'
import * as Mongoose from 'mongoose'

/**
 *  添加评论
 * @param {object} params 评论对象
 */
export const Addcomment = async (params: any) => {
  let {
    user_id,
    avatar,
    comment_data,
    order_id,
    pic_url,
    add_comment_list,
    comment_time,
    shop_id,
    rating_food,
    rating_delivery,
    rating_pack,
    rating,
    username,
    realName,
  } = params
  let data: any = {
    user_id,
    avatar,
    comment_data,
    order_id,
    pic_url,
    add_comment_list,
    comment_time,
    shop_id,
    rating_food,
    rating_delivery,
    rating_pack,
    rating,
    username,
    realName,
  }
  const result = await add(data)
  if (result) {
    try {
    //   let newSpecs = formatSpecs(params, result._id)
    //   let specsRes: any = await addMany(newSpecs)
    //   // console.log(specsRes)
    //   let specifications = specsRes.map((item: any) => {
    //     return item._id
    //   })
    //   let updateRes = await update(result._id, {
    //     specifications
    //   })
    //   return new SuccessModel(updateRes)
        return new SuccessModel(result)
    } catch (error) {
        return new ErrorModel(addCommentFailInfo)
    }
  } else {
    return new ErrorModel(addCommentFailInfo)
  }
};
/**
 *  修改评论
 * @param {object} params 评论对象
 */
export const Editcomment = async (params: any) => {
  let {
    user_id,
    avatar,
    comment_data,
    order_id,
    pic_url,
    add_comment_list,
    comment_time,
    shop_id,
    rating_food,
    rating_delivery,
    rating_pack,
    rating,
    username,
    realName,
  } = params
  let data: any = {
    user_id,
    avatar,
    comment_data,
    order_id,
    pic_url,
    add_comment_list,
    comment_time,
    shop_id,
    rating_food,
    rating_delivery,
    rating_pack,
    rating,
    username,
    realName,
  }
  const result = await update({_id: params._id}, data)
  if (result) {
    return new SuccessModel(result)
    // 删除当前食品下的所有规格
    // let res = await removeMany(params._id)
    // console.log(params._id, res)
    // if (res) {
    //   // 新建规格
    //   let newSpecs = formatSpecs(params, result._id)
    //   let specsRes: any = await addMany(newSpecs)
    //   // console.log(specsRes)
    //   let specifications = specsRes.map((item: any) => {
    //     return item._id
    //   })
    //   await update(result._id, {
    //     specifications
    //   })
    //   return new SuccessModel(result)
    // } else {
    //   return new ErrorModel(editCommentFailInfo)
    // }
  } else {
    return new ErrorModel(editCommentFailInfo)
  }
};
/**
 *  删除评论
 * @param {string} _id 评论id
 */
export const Deletecomment = async (_id: string) => {
//   // 删除当前食品下的所有规格
//   let res = await removeMany(_id)
  const result = await remove(_id)
  if (result) {
    return new SuccessModel(result)
  } else {
    return new ErrorModel(removeCommentFailInfo)
  }
};
/**
 *  获取评论列表
 * @param {object} query
 */
export const getCommentsList = async (query: any) => {
  console.log("controller/api/comments.ts---------->query")
  console.log(query)
  let params:any = {}
  params.query = query
  const result: any = await list(params)
  if (result) {
      console.log("controller/api/comments.ts---------->result")
      console.log(result)
    for (let i = 0; i < result.data.length; i++) {
      try {
        let shop_id: string= Mongoose.Types.ObjectId(result.data[i].shop_id).toString();
        // console.log("****shop_id****")
        // console.log(shop_id)
        let shopRes = await queryShop(shop_id)
        // let shopRes = await queryShop(result.data[i].shop_id)
        // console.log(shopRes)
        result.data[i]._doc.shopInfo = shopRes
      } catch (error) {
        result.data[i]._doc.shopInfo = null
      }
    //   try {
    //     let foodCateRes = await queryCate(result.data[i].foodcate_id)
    //     result.data[i]._doc.cateInfo = foodCateRes
    //   } catch (error) {
    //     result.data[i]._doc.cateInfo = null
    //   }
    }
    return new SuccessModel({
      offset: query.offset * 1 + 1,
      limit: query.limit * 1,
      total: result.count,
      data: result.data
    })
  } else {
    return new ErrorModel(commentsListFailInfo)
  }
};
/**
 *  获取个人评论详情
 * @param {object} query
 */
export const getCommentInfo = async (query: any) => {
  try {
    let { _id } = query
    let result: any = await queryComment({_id});
    if (result) {
    //   console.log(result)
    //   let specifications = result.specifications
    //   let specs = await queryMoreIdSpec(specifications)
    //   result._doc.specs = specs
      return new SuccessModel(result)
    }
    else {
      return new ErrorModel(queryCommentInfoFailInfo)
    }
  } catch (error) {
    console.log(error)
  }
}