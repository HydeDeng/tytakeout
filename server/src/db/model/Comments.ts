/*!
 * Koa CMS Backstage management
 *
 * Copyright Siro
 * Released under the ISC license
 * Email siro@foxmail.com
 *
 */
import * as Mongoose from 'mongoose'

const Schema = Mongoose.Schema

let commentsSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, isRequired: true}, // 用户id
    // user_id: { type: Schema.Types.Mixed, isRequired: true}, // 用户id
    avatar:{ type: String, default: "" }, // 描述
    comment_data:{type: String, default: "" }, //评论内容
    order_id:{ type: Schema.Types.ObjectId, isRequired: true}, //订单id
    pic_url:{type: Array, default: [] }, //评论图片
    add_comment_list:{type: Array, default: [] },  //追加评论内容列表
    comment_time: { type: Number, default: Date.now }, // 创建时间
    shop_id:{ type: Schema.Types.ObjectId, isRequired: true}, // 餐馆id
    // shop_id: { type: Schema.Types.Mixed, isRequired: true}, // 餐馆id
    rating_food:{type: Number, default: 5.0}, // 食品评价
    rating_delivery:{type: Number, default: 5.0}, //快递评价
    rating_pack:{type: Number, default: 5.0}, //包装评价
    rating:{type: Number, default: 5.0}, //商铺评价
    username:{ type: String, default: "" }, // 用户注册名
    realName:{ type: String, default: "" }, // 用户昵称
});

let CommentsModel = Mongoose.model('comments', commentsSchema);

export default CommentsModel