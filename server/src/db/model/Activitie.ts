import * as Mongoose from 'mongoose'

const Schema = Mongoose.Schema

let activitieSchema = new Schema({
  title: String, // 活动标题
  name: String, // 活动名称
  detail: String, // 活动详情
  val: String,
  icon_color: String,
  offer: { type: Boolean, default: false},
  offer_data: String,
  create_time: { type: Number, default: Date.now }, // 创建时间
});

let activitieModel = Mongoose.model('activities', activitieSchema);

export default activitieModel