<!--商店评论-->
<template>
<Scroll :style="{height: height}" ref="scroll" :data="[]" class="comment-scroll">
  <div class="comment-page">
    <!--评分部分-->
    <div ref="comment" class="scroll-container">
      <article>
        <div class="comment-score-container">
          <div>
            <span class="comment-score">{{data.rating}}</span>
            <h3>商家评分</h3>
          </div>
          <div>
            <div>
              <span>口味</span>
              <!-- <v-star :score="data.rating_food"></v-star> -->
              <!-- <div class="food-rating"> -->
              <van-rate
                  readonly
                  v-model="data.rating_food"
                  allow-half
                  size="10"
                  gutter="1"
                  void-icon="star"
                  void-color="#eee"
              />
                        <!-- </div> -->
              <span class="food-score">{{data.rating_food}}</span>
            </div>
            <div>
              <span>包装</span>
              <!-- <v-star :score="data.rating_pack"></v-star> -->
              <van-rate
                  readonly
                  v-model="data.rating_pack"
                  allow-half
                  size="10"
                  gutter="1"
                  void-icon="star"
                  void-color="#eee"
              />
              <span class="pack-score">{{data.rating_pack}}</span>
            </div>
          </div>
          <div>
            <span class="delivery-score">{{data.rating_delivery}}</span>
            <h3>配送评分</h3>
          </div>
        </div>
        <!--评分类型部分-->
        <ul class="comment-score-type-info">
          <li class="active">
            <i class="iconfont">&#xe741;</i>店铺评论
          </li>
          <!-- <li class="active">店铺评论</li>           -->
          <!-- <li>有图</li>
          <li><i class="iconfont">&#xe741;</i> 点评(0.0分)</li> -->
        </ul>

        <!-- <ul class="comment-score-type-tip">
          <li v-for="tip in commentData.comment_score_type_infos" :key="tip.comment_score_title">
            {{tip.comment_score_title}} {{tip.total_count}}
          </li>
          <li v-for="tip in commentData.labels" :key="tip.label_id">{{tip.content}} {{tip.label_count}}</li>
        </ul> -->

        <!--评价部分-->
        <article class="comments-container">
          <section v-for="(item, index) in (JSON.parse(JSON.stringify(commentData))).data" :key="index">
            <div class="user-pic-url">
              <img :src="item.avatar">
            </div>
            <div class="comment-main-part">
              <div>
                <span class="user-name">{{item.username}}</span>
                <span class="comment-time">{{timestampToTime(item.comment_time)}}</span>
              </div>
              <div class="order-comment-score">
                <span>评分 
                <!-- <v-star :score="item.rating_food"></v-star> -->
                <van-rate
                  readonly
                  v-model="item.rating_food"
                  allow-half
                  size="10"
                  gutter="1"
                  void-icon="star"
                  void-color="#eee"
              />
                </span>
              </div>
              <p class="comment">{{item.comment_data}}</p>
              <div class="comment-pic">
                <div v-for="(pic,index) in  item.pic_url" @click="show_big_pic_event(pic)" :key="index">
                  <img :src="pic">
                </div>
              </div>
              <div v-if="item.add_comment_list.length>1">
                  <div class="poi-reply-contents-container" v-for="(jtem, jndex) in item.add_comment_list" :key="jndex">
                      <p class="comment_append">{{jtem}}</p>
                  </div>
              </div>
            </div>
          </section>
        </article>
        <!--加载更多-->
        <div class="loading-container" ref="loading">
          <span class="loading" v-show="loading && !noMore">正在努力加载中…</span>
          <span class="no-more" v-show="noMore">已经到底了</span>
        </div>
      </article>
    </div>
    <!--图片大图-->
    <transition>
      <div class="show-big-pic" v-show="show_big_pic" @click="show_big_pic = false;">
        <div>
          <img :src="big_pic_url">
        </div>
      </div>
    </transition>
  </div>
</Scroll>  
</template>

<script lang='ts'>
import { IMAGE_URL } from '@/config'
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Scroll from '@/components/Scroll.vue'
import {getShopComments, getShopInfo} from '@/service'


@Component({
    name:"FoodComments",
    components:{
        Scroll
    }
})
  export default class FoodShop extends Vue {
      
        commentData:any = {};
        comment_score_type :any = {0: '全部', 1: '好评', 5: '有图好评'};
        big_pic_url: string = ""; //大图url
        show_big_pic: boolean = false;  //显示大图
        shop_info :any = {};          //商店信息
        noMore: boolean = false;        //没有更多
        loading: boolean = false;
        offset: number = 0;              //跳过几页
        BScrollEvent: object = null;   //better-scroll实例
        shop_id: string = ''; //商店id

        @Prop({
            type: Object,
            default: {}
        }) data!: any; // 传进来的是shop_info

        @Prop(String) height!: string;
        @Watch('data')
        dataChange(){
            // @ts-ignore
            this.$refs.scroll.refresh()
        }

        async getShopComments() {   //获取评论
            let {data} =  await getShopComments({shop_id: this.data._id, offset: this.offset, limit: 5})
            console.log("foodcomments.vue----->comments")
            console.log(data)
            if (!data){
                return;
            }else{
                this.commentData = data;
                console.log("foodcomments.vue----->this.commentData->没转义")
                console.log(this.commentData)
                console.log("foodcomments.vue----->this.commentData")
                // console.log(this.commentData)
                console.log(JSON.parse(JSON.stringify(this.commentData)))
            }
        }

        timestampToTime(timestamp) { //因为后端数据是时间戳 这里需要进行格式化
                var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                var D = date.getDate() + ' ';
                // var h = date.getHours() + ':';
                // var m = date.getMinutes() + ':';
                // var s = date.getSeconds();
                return Y+M+D;
            }

        show_big_pic_event(url) {     //显示大图
            this.big_pic_url = url;
            this.show_big_pic = true;
        }
        match_topic(string) {         //匹配tag
            let re = /(#[^#]*#)(.+)/g
            let match = re.exec(string);
            return !match ? string : `<strong style="color:#576b95; font-weight: normal">${match[1]}</strong>${match[2]}`
        }

        created(){          
        //   let _this = this;
        //   _this.shop_id = _this.$route.query.id;
        //   _this.fetchComment((response) => {
        //     _this.commentData = response.data.data;
        //     _this.$nextTick(() => {       //初始化better-scroll
        //       _this.BScrollEvent = new Scroll(_this.$refs.comment, {click: true, probeType: 2});
        //       //监听scroll事件
        //       _this.listenScroll();
        //     })
        //   })
        //   //根据商店id获取店家信息
        //   getShopComments({shop_id: _this.shop_id})
            this.getShopComments();
            // console.log("foodcomments.vue----->this.commentData")
            // console.log(this.commentData)
        }
//       //监听better-scroll滚动事件  判断是否滑动到底部 加载更多
//       listenScroll() {
//         let _this = this;
//         let commmentDOM = _this.$refs.comment;
//         _this.BScrollEvent.on('scroll', function (obj) {
//           //如果到达底部  请求加载更多数据
//           if (Math.abs(obj.y) + commmentDOM.clientHeight >= commmentDOM.childNodes[0].clientHeight - 30) {
//             if (!_this.loading) {   //避免加载过程中 重复请求
//               _this.loading = true;
//               //请求加载更多
//               _this.fetchComment(function (response) {
//                 if (!response.data.data.length)
//                   _this.noMore = true;
//                 else {
//                   _this.offset++;
//                   _this.commentData = _this.commentData.concat(response.data.data);
//                   _this.$nextTick(() => {
//                     _this.BScrollEvent.refresh();
//                   })
//                 }
//                 _this.loading = false;
//               })
//             }
//           }
//         })
//       }
//   // 监听食品列表滚动
//     @Watch('scrollY')
//     changeScrollY(newY) {
//         const listHeight = this.listHeight
//         // 当滚动到顶部， newY>0
//         if (newY > 0) {
//         this.activeKey = 0
//         return
//         }
//         // 在中间部分滚动
//         for (let i = 0; i < listHeight.length; i++) {
//         let height1 = listHeight[i]
//         let height2 = listHeight[i + 1]
//         if (!height2 || (-newY >= height1 && -newY < height2)) {
//             this.activeKey = i
//             return
//         }
//         }
//         // 当他滚动到底部且-newY 大于最后一个元素的上限
//         this.activeKey = listHeight.length - 2
//     }      
}

</script>

<style lang="less" scoped>
.comment-scroll{
  overflow: hidden;
  .comment-page {
    display: flex;
    flex: 1;
    background: grey;
    overflow: hidden;
    .scroll-container {
      width: 100%;
      overflow: hidden;
    }
    .comment-score-container {
      display: flex;
      align-items: center;
      padding: 0.35rem 0.3rem;
      background: #fff;
      margin: 0.2rem 0;
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      & > div:first-child, & > div:last-child {
        text-align: center;
        span {
          font-size: 2rem;
        }
        .comment-score {
          color: #ffb000;
        }
        .delivery-score {
          color: #999;
        }
        h3 {
          font-size: 0.7rem;
          margin-top: 0.2rem;
        }

      }
      /*口味 和 包装 评分样式*/
      & > div:nth-child(2) {
        flex: 1;
        text-align: justify;
        margin-left: 4.3rem;
        margin-right: 4.3rem;
        & > div:first-child {
            margin-bottom : 8px;
        }
        div {
          span:first-child {
            font-size: 0.8rem;
          }
          span:last-child {
            font-size: 0.9rem;
            color: #ffb000;
          }
        }
      }
    }

    .comment-score-type-info {
      background: #fff;
      display: flex;
      padding: 0.4rem;
      li {
        flex: 1;
        color: #ffb000;
        display: inline-block;
        border-radius: 2px;
        text-align: center;
        border: 1px solid #ffb000;
        line-height: 30px;
        &.active {
          background: #ffd161;
          color: #000;
          font-weight: bold;
          font-size: 0.7rem;
        }
      }
    }

    // .comment-score-type-tip {
    //   background: #fff;
    //   padding: 0 0.4rem;
    //   li {
    //     display: inline-block;
    //     padding: 0 0.1rem;
    //     background: #f4f4f4;
    //     font-size: 0.3rem;
    //     line-height: 55px;
    //     margin: 0 0.1rem 0.1rem 0;
    //   }
    // }

    .comments-container {
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      background: #fff;
      section {
        display: flex;
        padding: 0.53rem 0.1rem 0.1rem;
        .user-pic-url {
            width: 35px;
            height: 35px;
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .comment-main-part {
          flex: 1;
          padding-left: 0.1rem;
          & > div:first-child {
            display: flex;
            justify-content: space-between;
            .user-name {
              font-size: 0.8rem;
              font-weight: 600;
            }
            .comment-time {
              font-size: 0.6rem;
            }

          }
          /*评分*/
          .order-comment-score {
            margin: 0.1rem 0;
            span {
              font-size: 0.7rem;
              color: #999;
            }
          }
          /*评语*/
          .comment {
            font-size: 0.8rem;
            line-height: 40px;
            color: #222;
            font-weight: 500;
          }
          .comment-pic {
            div {
              display: inline-block;
              width: 120px;
              height: 120px;
              margin: 0.1rem 0.2rem 0.1rem 0;
              img {
                width: 100%;
                height: 100%;
              }
            }
          }
          .praise-food-tip-container {
            .praise-food-tip {
              padding: 0 0.1rem;
              border: 1px solid rgb(214, 214, 214);
              border-radius: 3px;
              margin: 0 0.1rem;
            }
            .give-prise {
              .iconfont {
                font-size: 0.3rem;
                font-weight: bold;
              }
            }
            .praise-food-tip {
              font-size: 0.3rem;
            }
          }
        }
      }
      /*追评语*/
      .poi-reply-contents-container {
        margin: 0.28rem 0;
        padding: 0.1rem;
        background: #f8f8f8;
        p {
          font-size: 0.7rem;
          line-height: 30px;
          color: #999;
        }
      }
    }

    .show-big-pic {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #000;
      z-index: 999;
      div {
        width: 100%;
        height: auto;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    /*loading部分*/
    .loading-container {
        .loading {
            /*loading部分*/
            background: #fff;
            text-align: center;
            font-size: 14px;
            height: 26px;
            line-height: 26px;
            .loading:before {
                content: "";
                display: inline-block;
                position: relative;
                left: -11px;
                padding: 0;
                border: 0;
                background: 0;
                width: 2px;
                height: 2px;
                border-radius: 100%;
                box-shadow: 0 -7px 0 0.9px #666, 7px 0 #999, 0 7px #999, -7px 0 #999, -5px -5px 0 0.4px #999, 5px -5px 0 1.1px #666, 5px 5px #999, -5px 5px #999;
                animation: spin 1.5s linear infinite;
                -webkit-animation: spin 1.5s linear infinite;
                top: -4px;
            }
            @keyframes spin {
                from {
                transform: rotate(0deg)
                }
                to {
                transform: rotate(360deg)
                }
            }
        }
        padding-bottom: 1rem;
    }
  }
}  
</style>
