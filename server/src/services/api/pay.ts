
import { PayModel } from '../../db/model/index'
import * as Mongoose from 'mongoose'
/**
 * 查询支付信息
 * @param {string} _id 支付id
 */
export const find = async (payId: string) => {
  let params = {
    payId
  }
  try {
    return await PayModel.find(params);
  } catch (error) {
    return null;
  }
}

/**
 * 查询某条支付信息
 * @param {any} _id 支付id
 */
export const findOnePay = async (_id: any) => {
    if (typeof(_id) === "string"){
        _id = Mongoose.Types.ObjectId(_id)
    }
    let params = {
      _id
    }
    try {
      return await PayModel.findOne(params);
    } catch (error) {
      return null;
    }
  }

/**
 * 通过order_id查询某条支付信息
 * @param {any} order_id order_id
 */
export const findPayByOrderId = async (order_id: any) => {
  if (typeof(order_id) === "string"){
    order_id = Mongoose.Types.ObjectId(order_id)
  }
  let params = {
    order_id
  }
  try {
    return await PayModel.findOne(params);
  } catch (error) {
    return null;
  }
}

/**
 * 更新支付
 * @param {object} params 订单id
 */
export const updatePay = async (data: any) => {
  let {amount,payType,method,order_id,id} = data
  let params: any = {}
  if (id) {
    params.amount = amount
    params.payType = payType
    params.method = method
    params.order_id = order_id
    params.id = id
  }
  try {
    // return await OrderModel.update(params);
    return await PayModel.updateMany({id: params.id}, {$set: {amount: params.amount, payType: params.payType, method: params.method, order_id: params.order_id}})
  } catch (e) {
    return null;
  }
}



/**
 * 保存支付信息
 * @param {object} params 要添加的数据
 */
export const savePay = async (params: any) => {
  try {
    // let {amount, payType, method, order_id, user_id, created_time, id} = params
    // let payType = params.payType === '1' ? '支付宝' : '微信'
    let doc = {
            ...params
        }
    console.log("save pay final doc---->")
    console.log(doc)
    return await PayModel.create(doc);
  } catch (error) {
    console.log(error)
    return null;
  }
}

/**
 * 保存支付信息
 * @param {object} params 要添加的数据
 */
  export const savePay2 =  async (params: any) =>{
    try{
      let payType = params.payType === '1' ? '支付宝' : '微信'
      let doc = {     //存入数据库数据
              // amount: 1,       //这里都是设置1分钱支付
              tradeName: '外卖订单支付',  //商户自定义订单标题
              payType,    //支付渠道
              status: '未支付',
              ...params
          }
      let init_pay = new PayModel(doc);
      return await init_pay.save();
    }catch(error){
      console.log(error)
      return null;
    }

}
// /**
//  * 修改用户地址
//  * @param {object} params 要修改的数据
//  */
// export const update = async (params: any) => {
//   let data = Object.assign({}, params)
//   delete data._id
//   delete data.userId
//   if (data.isDefault) {
//     let res = await MyaddressModel.updateMany({userId: params.userId}, {$set: {isDefault: false}})
//     // console.log(res)
//   }
//   try {
//     return await MyaddressModel.findOneAndUpdate({_id: params._id}, data);
//   } catch (error) {
//     return null;
//   }
// }
// /**
//  * 删除用户地址
//  * @param {object} params 要修改的数据
//  */
// export const remove = async (_id: string) => {
//   try {
//     return await MyaddressModel.deleteOne({_id});
//   } catch (error) {
//     return null;
//   }
// }

// /**
//  * 查询当前省市区列表
//  */
// export const arealist = async () => {
//   let params = {}
//   try {
//     return await AreaModel.find(params);
//   } catch (error) {
//     return null;
//   }
// }