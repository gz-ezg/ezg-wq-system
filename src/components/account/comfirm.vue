<template>
    <van-row style="overflow-x: hidden">
        <van-row style="padding-bottom:80px">
            <van-nav-bar title="商事协助外勤" />
                <!-- <van-row>
                    <iframe id="markPage" width="100%" height="280px" frameborder=0 scrolling="no" src=""></iframe>
                    <iframe id="geoPage" width="100%" height="30%" frameborder=0 scrolling="no" style="display: none"
                        src="https://apis.map.qq.com/tools/geolocation?key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp&effect=zoom"></iframe>
                </van-row> -->
                <div style="width:80%;margin:auto;margin-top:80px">
                    <van-cell-group>
                        <van-cell>
                            <center style="padding:10px;font-size:16px">{{companyname}}</center>
                        </van-cell>
                        <!-- <van-row><van-col span="4" offset="3" style="font-size:10px">工单内容：</van-col><van-row><van-col style="font-size:10px">{{product}}</van-col></van-row></van-row> -->
                        <van-cell>
                            <van-row style="margin-top:10px"><van-col span="12">外勤类型：</van-col><van-col>协助外勤</van-col></van-row>
                        </van-cell>
                        <van-cell>
                            <van-row style="margin-top:10px"><van-col span="12">本次外勤时间：</van-col><van-col span="9">{{fieldlength}}</van-col></van-row>
                        </van-cell>
                        <van-cell>
                            <van-row style="margin-top:10px"><van-col span="12">外勤人员：</van-col><van-col span="9">{{realname}}</van-col></van-row>
                        </van-cell>
                    </van-cell-group>
                </div>
                <div style="width:80%;margin:auto;margin-top:20px">
                    <van-cell-group>
                        <van-cell>
                            <van-radio-group v-model="status">
                                <van-col span="12"><van-radio name="invalid">无效</van-radio></van-col>
                                <van-col span="12"><van-radio name="hit">命中</van-radio></van-col>
                            </van-radio-group>
                        </van-cell>
                    </van-cell-group>
                </div>
        </van-row>
        <van-tabbar style="margin-top:30px;">
            <van-button type="primary" bottom-action style="font-size:20px;border-radius:5px" @click="submit" :loading="button_loading">确定</van-button>
        </van-tabbar>
    </van-row>
</template>

<script>

import {yasuo} from '../../common/img_beforeUpload'
import TypeList from '../common/typeList'
import ProductList from '../common/productList'

export default {
    data(){
        return{
            status:"hit",
            button_loading:false,
            id:"",
            companyname:"",
            fieldlength:"",
            assiststatus:"",
            realname:""

        }
    },
    methods:{
        submit(){
            let _self = this
            let url = `api/legwork/apiSaveAccountAffirmLegworkMsg`
            let formdata = new FormData()
            _self.button_loading = true
            // console.log(_self.img_array)
            formdata.append('id', _self.id)
            formdata.append('kjaffirmstatus',_self.status)

            this.$http.post(url,formdata).then(function(res){
                if(res.data.msgCode == "40000"){
                _self.button_loading = false
                    _self.$router.push({
                        name:'comfirmsuccess'
                    })
                }else{
                    alert(res.data.msg)
                    _self.button_loading = false
                    _self.$toast.fail('系统错误！')
                }
            }).catch(function(err){
                alert(err)
                _self.button_loading = false
                _self.$toast.fail('网络异常！')
            })


        },

        getAccountComfirm(){
            let _self = this
            this.$http.post('api/legwork/apiAccountAffirmLegworkMsg').then(function(res){
                if(res.data.msgCode == "40000"){
                    let temp = res.data.data.unfinishedPunchCard.date
                    _self.id = temp.id
                    _self.companyname = temp.companyname
                    _self.fieldlength = temp.fieldlength
                    _self.assiststatus = temp.assiststatus
                    _self.realname = temp.realname
                }else{
                    alert(res.data.msg)
                    _self.$toast.fail("系统错误！")
                }
            }).catch(function(err){
                alert(err)
                _self.$toast.fail("网络异常！")
            })
        },

    },
    created(){
        this.getAccountComfirm()
    }
}
</script>

<style>

</style>
