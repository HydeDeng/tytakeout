<template>
  <div class="search-page">
        <Header class="header-warp" @return="headerReturn">搜索
            <SearchHeader placeholder="搜索商品、商家名称" :fun_click="fun_click"></SearchHeader>
        </Header>
        <div class="search-list" v-if="listShow">
            <ul v-if="searchList.length>0">
                <li @click="gotoShop(item._id)" v-for="(item, i) in searchList" :key="i">
                    <div class="left">
                        <h2 v-html="high_light(item.name)">{{item.name}}</h2>
                        <p>{{parseFloat(item.distance.distance) | formatDistance}}km | {{item.distance.order_lead_time}}送达</p>
                    </div>
                    <div class="right">
                        <div class="shop-rating">
                            <van-rate
                                readonly
                                v-model="item.rating"
                                allow-half
                                size="10"
                                gutter="1"
                                void-icon="star"
                                void-color="#eee"
                            />
                        </div>
                        <van-icon size="18" color="green" name="shop-o" />                        
                    </div>
                </li>
                <li @click="gotoSearchResult(keyword)">
                    <div class="left">
                        <h2>{{keyword}}</h2>
                    </div>
                    <div class="right"> 
                        <van-icon size="18" color="gray" name="search" />                        
                    </div>
                </li>
            </ul>
            <ul v-else>
                <li>
                    <Nodata/>
                </li>
            </ul>
        </div>
        <alert-tip :text="alertText" :showTip.sync="showTip"></alert-tip> 
  </div>

</template>

<script lang='ts'>

import Nodata from '@/components/Nodata/index.vue'
import {Component, Vue, Prop} from "vue-property-decorator";
import Header from "../components/Layout/Header.vue";
import SearchHeader from "../components/Search/SearchHeader.vue";
import { searchRestaurantsAndFoods } from '@/service'
import { namespace } from 'vuex-class';

const GlobalModule = namespace('global');
@Component({
    name:"Search",
    components:{
        Header,
        SearchHeader,
        Nodata
    },
    computed: {
        nigth () {
            var date = new Date()
            var currentHours = date.getHours()
            if (currentHours>=20) {
                return true
            } else {
                return false
            }
        }
    },
    filters: {
        formatDistance (value){
        return Math.round((value/1000)*100)/100
        }
    }
})
export default class Search extends Vue{
    keyword: string = ''
    searchList: any = []
    alertText: string = ''
    showTip: boolean = false
    offset: number = 1  // 当前页
    limit: number = 3  // 分页大小
    listShow: boolean = false
    @GlobalModule.State(state => state.location) location;
    
    headerReturn(){
        this.$router.push('/')
    }
    high_light(value){
      return value.replace(this.keyword, `<span style="color:#ffd161;">${this.keyword}</span>`);
    }
    fun_click(val){
        console.log("===serch==value=====");
        console.log(val);
        console.log("===serch==value=====");
        if (!val)
          return;
        this.keyword = val;
        this.searchRestaurantsAndFoods(this.keyword);
    }

    gotoShop (_id) {
        this.$router.push('/shop?_id='+_id)
    }

    gotoSearchResult(keyword){
        this.$router.push('/searchResult?keyword='+ keyword)
    }

    async searchRestaurantsAndFoods (searchkey?:any) {
        try {
            let { offset, limit, location } = this
            let params: any = {
                offset,
                limit,
                startgeohash: location.lat+','+location.lng,
            }
            params.name = searchkey   
            let { data } = await searchRestaurantsAndFoods(params)
            console.log("**********get response data****place2******")
            console.log(data)
            if (data){
              this.searchList = data.data
              console.log("this.searchList")
              console.log(this.searchList)
              this.listShow = true
            }else{
              this.alertText = '找不到该餐馆，换一个试试';
              console.log("找不到该餐馆，换一个试试")
              this.listShow = false
            }
        } catch (ex) {
            console.log(ex)
        }
    }
}


</script>

<!-- <style lang="less" scoped>
.search-page {
    .lists {
        ul {
            li {
                height: 115/75px;
                // width: 115px;
                display: flex;
                align-items: center;
                .avatar {
                    width:80/75px;
                    height:80/75px;
                    margin: 0 0.5*75px;
                    border-radius: 50%;
                    overflow: hidden;
                    img {
                    width: 100%;
                    height: 100%;
                    }
                }
                .name {
                    flex: 1;
                    font-size: 0.4*75px;
                }
                .delivery-time {
                    width: 125/75px;
                    font-size: 0.2*75px;
                }
            }
        }
    }
}
</style> -->

<style scoped lang='less'>
.search-page{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .search-list{
        padding-top:40px;
        flex: 1;
        overflow-y: scroll;
        background-color: #fff;
        ul{
            li{
                border-bottom: 1px solid #eee;
                padding: 11px 15px;
                display: flex;
                justify-content: space-between;
                .left{
                    color: #222;
                    h2{
                        font-size: 15px;
                    }
                    p{
                        font-size: 12px;
                    }
                }
                .right{
                    display: flex;
                    align-items: center;
                }
            }
            .more{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: #aaa;
                h2{
                    font-size: 15px;
                    font-weight: normal;
                    margin-bottom: 5px;
                }
                h3{
                    font-size: 13px;
                    font-weight: normal;
                }
            }
        }
    }
}
</style>