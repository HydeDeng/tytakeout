import * as Mongoose from 'mongoose'
Mongoose.set('useFindAndModify', false)

//自己生成的自增id
const idsSchema = new Mongoose.Schema({
    ty_restaurant_id: {type: Number, default: 1},      //餐馆id
    ty_food_id: {type: Number, default: 1},            //食物id
    ty_order_id: {type: Number, default: 1},           //订单id
    ty_user_id: {type: Number, default: 1},            //用户id
    ty_address_id: {type: Number, default: 1},         //地址id
    ty_category_id: {type: Number, default: 1},        //分类id
    ty_admin_id: {type: Number, default: 1},           //管理员id
    ty_pay_id:{type: Number, default: 1},              //支付id
    ty_comment_id:{type: Number, default: 1}         //评价id
});

const Ids = Mongoose.model('Ids', idsSchema);

export default Ids