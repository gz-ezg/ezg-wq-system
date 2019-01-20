<template>
    <div>
        <div style="width:80%;margin:auto;margin-top:0.5rem">
            <center>
                <van-uploader accept="image/*" :before-read="upload" capture="camera" style="display:flex;justify-content:center;align-items:center">
                    <van-icon name="photograph" style="font-size:0.5rem;line-height:0.5rem" /><span style="font-size:0.333rem;line-height:0.333rem;padding-left:0.2rem">点击拍摄照片</span>
                </van-uploader>
            </center>
        </div>
        <div style="margin-top:0.333rem">
            <van-row>
                <van-col v-for="(item,index) in showImg" :key="index" style="margin-left:3px;margin-right:3px">
                    <img :src="item.src" alt="Ballade" style="width: 100px;height:100px"/>
                </van-col>
            </van-row>
        </div>
        <div style="width:80%;margin:auto;margin-top:0.6rem">
            <van-cell-group>
                <van-field
                    v-model="clockshows"
                    type="textarea"
                    placeholder="打卡说明（选填）"
                    rows="3"
                    autosize
                />
            </van-cell-group>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import {yasuo} from '../../common/img_beforeUpload'
// import * as commonApi from '@api/common/index'

export default class OtherIndex extends Vue {
    async upload(e){
        let _self = this
        let img = await yasuo(e)
        this.$store.commit("push_upload_img", e)
        let reader = new FileReader()
        reader.readAsDataURL(e)
        let filename = e.name
        reader.onload = function(e){
            var imgMsg = {
                name:filename,
                src:this.result
            }
            _self.$store.commit("push_img", imgMsg)
        }
    }
    get showImg(){
        return this.$store.state.showImg
    }
}
</script>
