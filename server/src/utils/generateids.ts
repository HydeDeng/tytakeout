// import * as Ids from '../db/model/Ids'
import { IdsModel } from '../db/model/index'
// import * as Mongoose from 'mongoose'

//目前只用到了ty_pay_id
const idList = ['ty_pay_id','ty_order_id','ty_food_id','ty_user_id','ty_address_id','ty_category_id','ty_admin_id','ty_comment_id'];

export const getId = async (type_id: string) => {
    if (!idList.includes(type_id)) {
        throw new Error('id类型错误');
        return
      }
      try {
        //返回当前类型id数量*/
        const idData =await IdsModel.findOneAndUpdate({}, {'$inc': {[type_id]: 1}});
        console.log('获取idData');
        if(!idData || Object.keys(idData).length == 0){
          console.log(idData);
          const newData = await IdsModel.create({[type_id]: 1})
          console.log('获取newData');
          console.log(newData);
          return 1;//新建字段
        }
        console.log('再获取idData');
        console.log(idData);
        interface IdData {
            [key: string]: any
        }
        return ++(<IdData>idData)[type_id];
      } catch (err) {
        console.log('获取ID数据失败');
        throw new Error(err)
      }
}