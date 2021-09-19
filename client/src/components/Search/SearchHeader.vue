<template>
    <div class="header-search-box">
        <div class="header-search">
            <van-icon size="18" name="search"/>
            <input type="text" autofocus="autofocus" v-model.trim="search_val" :placeholder="placeholder" ref="inputs">
            <!-- <span>搜索商品、商家名称</span> -->
        </div>
    </div>
</template>


<script lang='ts'>
//     <template>
//   <div class="search-container">
//     <div class="search-input">
//       <i class="iconfont">&#xe7d1;</i>
//       <input type="text" autofocus="autofocus" v-model.trim="search_val" :placeholder="placeholder">
//     </div>
//     <span class="btn-search" v-bind:class="{ active: btnActive }">搜索</span>
//   </div>
// </template>
    import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";

    @Component({
        name: "SearchHeader"
    })
    export default class SearchHeader extends Vue {
        
        search_val: string = ""
        
        @Prop({type: Function})
        fun_click: Function;
        @Prop({type: Boolean,default: false,})
        readonly fixed!:boolean;
        @Prop({type: String,default: "搜一搜"})
        placeholder: String;

        // gotoSearch(){
        //     this.$router.push('/search')
        // }

        // @Watch('search_val',{immediate:true})
        @Watch('search_val')
        onSearchValueChange(data){
            console.log("searchHeader data start")
            console.log(data)
            console.log("searchHeader data end")
            if (data !== "") {
            //   this.btnActive = true;
            this.fun_click(data);
            }
            else {
            //   this.btnActive = false;
            }
        }

        @Emit('goto')
        handleClick (e) {
        }

        mounted():void{ //因为 mounted 阶段 dom 并未渲染完毕,所以需要$nextTick
        this.$nextTick(() => {
            // this.$refs.inputs.focus() //通过 $refs 获取dom 并绑定 focus 方法
            //上面那句报错的原因是 vscode会根据声明文件自动进行类型推断的，这里没法知道focus的类型
            (this.$refs.inputs as any).focus()
        })
}

    }

</script>

<style scoped lang='less'>
  .header-search-box {
      background-color: @thcol;
      padding: 10px 0;
      position: fixed;
      width: 100%;
    //   top: 0;
      left: 0;
      z-index: 10;
      .header-search{
          padding: 8px;
          margin: 0 20px;
          background-color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #888;
          input {
            margin-left: 5px;
            width: 85%;
            height: 100%;
            border: none;
            text-indent: 20px;
            outline: none;
            background: rgba(237, 237, 237, 0.1);
            line-height: normal;
            &::-webkit-input-placeholder {
            font-size: 14px;
            }
        }
      }
      
  }
</style>