/*!
 * Koa CMS Backstage management
 *
 * Copyright JS suwenhao
 * Released under the ISC license
 * Email swh1057607246@qq.com
 *
 */

import { restaurantsAndFoodlist } from '../../services/sys/shopandfood'
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
 * 获取餐馆和食品列表
 * @param {object} query
 */
export const getRestaurantAndFoodsList = async (query: any) => {
  const { offset, limit, startgeohash, promotion, category, name} = query
  let params: any = {
    offset,
    limit,
  }
  if (promotion) {
    params.query = {
      promotion: {$elemMatch: {$eq: promotion}}
    }
  }
  if (category) {
    //餐馆的种类有大类和小类，如 快餐/盖浇饭
    params.query = {"category": Number(category)}
  }
 
  if (name){
    //餐馆和食品都包括了“name”
    params.query = {"name": `${name}`} 
    // console.log("******params*name*****");
    // console.log(params);
  }

  const reslist: any = await restaurantsAndFoodlist(params)
  // console.log("******这里是restaurantsAndFoodlist---relist头******");
  // console.log(reslist);
  // console.log("******这里是restaurantsAndFoodlist---relist尾******");
  
  if (reslist) {
    try {
      for (let i = 0; i < reslist.data.length; i++) {
        let activitie_data = await queryMoreIdActivitie(reslist.data[i].aid_list)
        // console.log("activitie_data---start---")
        // console.log(activitie_data)
        // console.log("activitie_data---end---")
        reslist.data[i].activitie_data = activitie_data
        let category_data = await queryMoreIdCategorie(reslist.data[i].category)
        reslist.data[i].category_data = category_data
        let trait_data = await queryMoreValTrait(reslist.data[i].trait)
        reslist.data[i].trait_data = trait_data
        let endgeohash = reslist.data[i].address.geohash
        let distance = await queryDistance(startgeohash, endgeohash)
        if (!distance) {
          distance = [ { distance: 2528, order_lead_time: '29分钟' } ]
        }
        reslist.data[i].distance = distance[0]
        reslist.data[i].distanceValue = distance[0].distance
        // console.log("reslist.data[i]---s---"+i)
        // console.log(reslist.data[i])
        // console.log("reslist.data[i]---e---"+i)
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
