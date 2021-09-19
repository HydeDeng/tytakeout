/*!
 * Koa CMS Backstage management
 *
 * Copyright JS suwenhao
 * Released under the ISC license
 * Email swh1057607246@qq.com
 *
 */

import { list, queryShop } from '../../services/sys/shop'
import {
  queryMoreIdActivitie
} from '../../services/sys/activitie'
import { queryMoreIdCategorie } from '../../services/api/categorie'
import { queryMoreValTrait } from '../../services/api/trait'
import { queryDistance } from '../../services/api/city'
import { shopQueryFood } from '../../services/sys/food'
import { queryMoreIdSpec } from '../../services/sys/spec'
import { queryCate } from '../../services/sys/foodcate'
import { SuccessModel, ErrorModel } from '../../model/ResModel'
import { 
  queryRestaurantListFailInfo
 } from '../../model/ErrorInfo'
/**
 *  获取餐馆列表
 * @param {object} query
 */
export const getRestaurantList = async (query: any) => {
  const { offset, limit, startgeohash, promotion, category} = query
  let params: any = {
    offset,
    limit,
  }
  // let paramsQuery:any = params;
  if (promotion) {
    params.query = {
      promotion: {$elemMatch: {$eq: promotion}}
    }
  }
  if (category) {
    //餐馆的种类有大类和小类，如 快餐/盖浇饭
    // params.query = {
    //   category: {$elemMatch: {$eq: category}}
    // }
    // promotion: {$elemMatch: {$eq: promotion}}
    params.query = {"category": Number(category)}
  }
  // console.log("******params**3****");
  // console.log(params);

  const reslist: any = await list(params)
  // console.log("******这里是relist头******");
  // console.log(reslist);
  // console.log("******这里是relist尾******");
  if (reslist) {
    try {
      for (let i = 0; i < reslist.data.length; i++) {
        let activitie_data = await queryMoreIdActivitie(reslist.data[i].aid_list)
        // console.log("*****reslist.data[i]._doc*****s")
        // console.log(reslist.data[i]._doc)
        // console.log("*****reslist.data[i]._doc*****e")
        reslist.data[i]._doc.activitie_data = activitie_data
        let category_data = await queryMoreIdCategorie(reslist.data[i].category)
        reslist.data[i]._doc.category_data = category_data
        let trait_data = await queryMoreValTrait(reslist.data[i].trait)
        reslist.data[i]._doc.trait_data = trait_data
        let endgeohash = reslist.data[i].address.geohash
        let distance = await queryDistance(startgeohash, endgeohash)
        if (!distance) {
          distance = [ { distance: 2528, order_lead_time: '29分钟' } ]
        }
        reslist.data[i]._doc.distance = distance[0]
        reslist.data[i]._doc.distanceValue = distance[0].distance
        // console.log("*****reslist.data[i]**shopping***s")
        // console.log(reslist.data[i])
        // console.log("*****reslist.data[i]**shopping***e")
      }
      let data = Object.assign([], reslist.data)
      return new SuccessModel({
        offset: query.offset * 1,
        limit: query.limit * 1,
        total: reslist.count,
        data
      })
    } catch (error) {
      console.log(error)
      return new ErrorModel(queryRestaurantListFailInfo)
    }
  } else {
    return new ErrorModel(queryRestaurantListFailInfo)
  }
};
/**
 *  获取餐馆详情
 * @param {object} query
 */
export const getShopInfo = async (query: any) => {
  let { _id, startgeohash} = query
  let result: any = await queryShop(_id)
  if (result) {
    try {
      let activitie_data = await queryMoreIdActivitie(result.aid_list)
      let category_data = await queryMoreIdCategorie(result.category)
      result._doc.category_data = category_data
      let trait_data = await queryMoreValTrait(result.trait)
      result._doc.trait_data = trait_data
      result._doc.activitie_data = activitie_data
      let endgeohash = result.address.geohash
      let distance = await queryDistance(startgeohash, endgeohash)
      // console.log(distance)
      if (!distance) {
        distance = [ { distance: 2528, order_lead_time: '29分钟' } ]
      }
      result._doc.distance = distance[0]
      result._doc.distanceValue = distance[0].distance
      let foodRes: any = await shopQueryFood(_id)
      for(let i=0; i< foodRes.length;i++) {
        let specifications = foodRes[i].specifications
        let specs = await queryMoreIdSpec(specifications)
        foodRes[i]._doc.specs = specs
        let foodCateRes = await queryCate(foodRes[i].foodcate_id)
        foodRes[i]._doc.cateInfo = foodCateRes
      }
      // console.log(foodRes)
      result._doc.foods = foodRes

    } catch (error) {}
    return new SuccessModel(result)
  } else {
    return new SuccessModel(null)
  }
}