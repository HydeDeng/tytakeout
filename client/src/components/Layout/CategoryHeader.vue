<template>
    <div class="header-wrap">
        <div class="left" @click="handleClickLeft">
            <van-icon size="20" class="iconfont" name="iconfont iconback_light" />
            <div class="text-content ellipsis">
                <slot />
            </div>           
        </div>
        <div class="header-search" @click.stop="gotoSearch">
            <van-icon size="18" name="search" />
            <span>搜索商品、商家名称</span>
        </div>
    </div>
</template>

<script lang='ts'>
    import { Component, Vue, Prop, Emit } from "vue-property-decorator";

    @Component({
        name: "CategoryHeader"
    })
    export default class CategoryHeader extends Vue {
        @Prop({
            type: Boolean,
            default: true
        })
        readonly left!: boolean;
        @Prop({
            type: Boolean,
            default: true
        })
        readonly right!: boolean;
        gotoSearch(){
            this.$router.push('/search')
        }
        @Emit('return')
        handleClickLeft (e) {}

        @Emit('goto')
        handleClick (e) {}
    }
</script>

<style scoped lang='less'>
    .header-wrap {
        background-color: @thcol;
        padding: 10px 0;
        .left{
            display: flex;
            color: @primary-color;
            justify-content: center;
            align-items: center;
            width: 50px;
            height: 50px;
            text-align: center;      
        }
        .text-content{
            position: absolute;
            right: 155px;
            top: 22px;         
        }   
        .header-search{
            padding: 8px;
            margin: 0 20px;
            background-color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #888;
            span{
                margin-left: 5px;
                font-size: 14px;
            }
        }
        
    }
</style>