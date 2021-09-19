/*!
 * Koa CMS Backstage management
 *
 * Copyright JS suwenhao
 * Released under the ISC license
 * Email swh1057607246@qq.com
 *
 */
import { ShopModel } from '../../db/model/index'
import * as Mongoose from 'mongoose'

/**
 * 根据关键字查询餐馆和食品
 * @param {string} params 
 */
export const restaurantsAndFoodlist = async (params: any) => {
    if (!params) {
      return await ShopModel.find();
    }
    params.offset = params.offset - 1
    let query = {
      name: ""
    }
    if (params.query) {
      query = params.query
    }
    let sort = { create_time: -1 }
    if (params.sort) {
      sort = params.sort
    }
    params.limit = params.limit * 1
    // console.log(params)
    let skip = params.limit * params.offset
    try {
      // console.log("======dataquery======")
      // console.log(query)
      let queryRestaurantsAndFood = {
        name: query.name,
        from: "foods", 
        localField: "_id", 
        foreignField: "shop_id", 
        as: "foods_doc", 
        // newDocName:"foods_doc.name"
      }
      console.log(queryRestaurantsAndFood)
      let data = await getRestaurantsAndFoodlistByNameFromMongo(queryRestaurantsAndFood)
        
        // console.log("+*******+data+start*******+")
        // console.log(data)
        // console.log("+*******+data+end*******+")
        // console.log("+*******+data[0].foods_doc+*******+")
        // console.log(data[0].foods_doc)      

    //   let data = await ShopModel.find(query).limit(params.limit).skip(skip).sort(sort)
    let count = await ShopModel.countDocuments(query)
      return {
        data,
        count
      }
    } catch (e) {
      console.log(e)
      return null;
    }
  }

// let setKeyAndVal = (key: string, value:any) => {
//         return {key : value}
// }

export const getRestaurantsAndFoodlistByNameFromMongo = async (query: any) => {
    // const { from, localField, foreignField, as, name, newDocName} = query
    const { from, localField, foreignField, as, name} = query
    // let foreignFieldObject = Mongoose.Types.ObjectId(foreignField.toHexString)
    return await ShopModel.aggregate([
        { 
            $lookup: {
            from: from,
            localField:localField,
            foreignField: foreignField,
            as: as
            } 
        },
      { $match:  {"$or": [{name:{$regex:name}}, {"foods_doc.name":{$regex:name}}]} }
      // { $match:  {"$or": [{name:{$regex:name}}, setKeyAndVal(newDocName, {$regex:name})]} }
    ]);
  }