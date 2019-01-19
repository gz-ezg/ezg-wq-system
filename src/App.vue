<template>
  <div id="app" @touchstart="start" @touchend="end">
    <!-- <van-notice-bar
      mode="closeable"
      text="本次更新内容：离开打卡时必须上传图片！"
    /> -->
    <router-view/>
    <company-list></company-list>
    <customer-list></customer-list>
    <type-list></type-list>
  </div>
</template>

<script lang="ts">
import VConsole from 'vconsole/dist/vconsole.min.js'
import companyList from '@/components/common/companyList.vue'
import customerList from '@/components/common/customerList.vue'
import TypeList from '@/components/common/typeList.vue'
export default {
  name: 'App',
  components: {
    companyList,
    customerList,
    TypeList
  },
  created(){
    // if(this.time){
      // let vConsole = new VConsole()
    // }
  },
  data(){
    return {
      time: 0
    }
  },
  methods: {
    //  预埋控制台，处理输出日志
    start(){
      let _self = this
      clearInterval(this.Loop)
      this.Loop = setTimeout(function(){
        new VConsole()
      },5000)
    },
    end(){
      clearInterval(this.Loop)
    }
  }
}
</script>

<style>
#app {
  font-family: '-apple-system', "Helvetica Neue", "Roboto", "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #1a5086;
}
</style>
