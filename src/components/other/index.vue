<template>
    <van-row style="overflow-x: hidden">
        <van-row style="padding-bottom:2rem">
            <van-nav-bar title="普通外勤打卡" left-arrow @click-left="$backTo()"/>
                <div style="width:80%;margin:auto;margin-top:2rem" @click="get_wx_local">
                    <van-cell-group v-if="localLoading">
                      <center style="padding:0.25rem"><van-loading type="spinner" size="30px" /></center>
                    </van-cell-group>
                    <van-cell-group v-else>
                      <center style="padding-top:0.5rem;display: flex;justify-content:center;align-items:center;"><van-icon name="aim" style="padding-right:0.1333rem;font-size:0.5rem"/><span style="font-size:0.333rem">当前定位地址</span></center>
                        <van-cell :value="addr"  style="text-align:center" id="address"/>
                    </van-cell-group>
                </div>
                <van-cell-group style="width:80%;margin:auto;margin-top:1rem">
                    <van-field
                        :value="company.companyname"
                        required
                        clearable
                        readonly
                        placeholder="请选择服务企业"
                        @click.native="open_company_select(company)"
                    />
                    <van-field
                        :value="fieldType.typename"
                        required
                        clearable
                        readonly
                        placeholder="请选择外勤类型"
                        @click.native="open_fieldType_select(company)"
                    />
                </van-cell-group>
                
                <!-- <div style="width:80%;margin:auto;margin-top:0.5rem">
                    <center>
                        <van-uploader accept="image/*" :before-read="upload" capture="camera" style="display:flex;justify-content:center;align-items:center">
                            <van-icon name="photograph" style="font-size:0.5rem;line-height:0.5rem" /><span style="font-size:0.333rem;line-height:0.333rem;padding-left:0.2rem">点击拍摄照片</span>
                        </van-uploader>
                    </center>
                </div>
                <div style="margin-top:0.333rem">
                    <van-row>
                        <van-col v-for="(item,index) in show_img" :key="index" style="margin-left:3px;margin-right:3px">
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
                </div> -->
                <upload-img></upload-img>
        </van-row>
        <van-tabbar style="margin-top:1rem;">
            <van-button type="primary" bottom-action style="font-size:20px;border-radius:5px" :loading="button_loading" @click="data_check">开始打卡</van-button>
        </van-tabbar>
        </van-row>
    </van-row>
</template>

<script lang="ts">
import {yasuo} from '../../common/img_beforeUpload'
import uploadImg from '../common/uploadImg.vue'
// import schema from 'async-validator'

import wxLocal from '../common/local.js';

import { Component, Vue, Watch } from 'vue-property-decorator'
import * as commonApi from '@api/common/index'

@Component({
    mixins: [wxLocal],
    components: {
        uploadImg
    }
})
export default class OtherIndex extends Vue {
    show_img = []
    img_array=[]

    get company(){
        return this.$store.state.company
    }
    get fieldType(){
        return this.$store.state.fieldType
    }
    /**
     * 选择企业
     * id为当前选中id
     */
    open_company_select(id){
        this.$store.commit("change_company_modal_status")
    }

    open_fieldType_select(){
        this.$store.commit("change_fieldType_modal_status")
    }

    upload(e){
        let _self = this
        let img = yasuo(e)
        let reader = new FileReader()
        reader.readAsDataURL(e)
        let filename = e.name
        reader.onload = function(e){
            var imgMsg = {
                name:filename,
                src:this.result
            }
            _self.show_img.push(imgMsg)
        }
    }
    async created(){
        let config = {
            params: {
                groupCodes:"other_field_type"
            }
        }
        let { other_field_type } = await commonApi.getDictionary(config)
        this.$store.commit("set_fieldTypeList", other_field_type)
    }
}
// export default {
//     mixins:[wxLocal],
//     components:{
//         CompanyList,
//         TypeList,
//         WorkOrderList
//     },
//     data(){
//         return{
//             clockshows:"",
//             button_loading:false,
//             company:"请输入公司名称",
//             name:"请输入客户名称",
//             tel:"请输入客户电话",
//             type:"选择外勤类型",
//             type_typecode:"",
//             company_id:"",
//             name_id:"",
//             workorder_id:"",
//             fieldType:"",
//             img_array:[],
//             show_img:[],
//             message:"",
//             addr:"暂无"
//         }
//     },
//     methods:{
//         openCompanySearch(){
//             this.$bus.emit('open_company_list',true)
//         },
//         openType(){
//             this.$bus.emit('open_type_list',true)
//         },
//         data_check(){
//             let _self = this
//             //  表单验证
//             var descriptor = {
//               company: { type: "string", required: true, message: "请输入外勤总结！"},
//               type_typecode: { type: "string", required: true, message: "请选择外勤类型！"},
//               img_array: { type: "array", required:true, message: "请选择照片！"},
//               addr: {type: "string", required:true, message: "获取定位失效，请重开窗口！"}
//             }
//             var validator = new schema(descriptor);
//             validator.validate(
//               {
//                 company: _self.company,
//                 type_typecode: _self.type_typecode,
//                 img_array: _self.img_array,
//                 addr: _self.addr
//               }, (errors, fields) => {
//                 if(errors) {
//                   console.log(errors)
//                   //  这里写一个异常处理函数，弹窗
//                     _self.$toast.fail(errors[0].message)
//                   return 1;
//                 }else{
//                   _self.submit()
//                 }
//               }
//             );
//         },
//         submit(){
//             let _self = this
//             let url = `api/zuul/legwork/apiSaveLegworkVisitMsg`
//             _self.button_loading = true
//             let formdata = new FormData()
//             formdata.append('companyid', _self.company_id)
//             formdata.append('address1', _self.addr)
//             formdata.append('customerid', _self.name_id)
//             formdata.append('fieldtype', _self.type_typecode)
//             formdata.append('clockshows',_self.clockshows)

//             for(let i = 0;i<_self.img_array.length;i++){
//                 formdata.append('file',_self.img_array[i],"file_" + Date.parse(new Date()) + ".jpg")
//             }

//             this.$http.post(url,formdata).then(function(res){
//                 if(res.data.msgCode == "40000"){
//                     localStorage.setItem('companyname',_self.company)
//                     localStorage.setItem('field_id',res.data.data.legworkId)
//                     localStorage.setItem('product',_self.workorder)
//                     //  计时器开始
//                     let start_time = new Date()
//                     localStorage.setItem('startTime',start_time.getTime())
//                     _self.button_loading = false
//                     _self.$router.push({
//                         name:'otherLeave'
//                     })
//                 }else{
//                     alert(res.data.msg)
//                     _self.$toast.fail("系统错误！")
//                     _self.button_loading = false
//                 }
//             }).catch(function(err){
//                     alert(err)
//                     _self.$toast.fail("网络异常！")
//                     _self.button_loading = false
//             })


//         },
//         upload(e){
//             let _self = this
//             let img = yasuo(e,_self.img_array)
//             let reader = new FileReader()
//             reader.readAsDataURL(e)
//             let filename = e.name
//             reader.onload = function(e){
//                 var imgMsg = {
//                     name:filename,
//                     src:this.result
//                 }
//                 _self.show_img.push(imgMsg)
//             }
//         },
//         //  获取外勤类型
//         getFieldType(){
//             let _self = this
//             let url = 'api/system/tsType/queryTsTypeByGroupCodes'
//             let config = {
//                 params:{
//                     groupCodes:"other_field_type"
//                 }
//             }
//             this.$http.get(url,config).then(function(res){
//                 if(res.data.msgCode == "40000"){
//                     _self.fieldType = res.data.data.other_field_type
//                 }else{
//                     _self.$toast.fail('系统错误！')
//                 }
//             }).catch(function(err){
//                 _self.$toast.fail('网络错误！')
//             })
//         },
//         update_company(e){

//         },
//         update_workorder(e){

//         },
//         update_type(e){

//         }
//     },
//     created(){
//         this.getFieldType()
//         let _self = this
//     },
//     mounted(){
//         let _self = this
//         // this.wx_init().then(()=>{
//         //     _self.get_wx_local()
//         // }).catch(()=>{
//         //     _self.$toast.fail("获取地址失败！请退出重试！")
//         // })
//     },
//     beforeUpdate(){
//         let _self = this

//         this.$bus.on('update_info',(e)=>{
//             _self.company = e.companyname
//             _self.name = e.name
//             _self.tel = e.tel
//             _self.company_id = e.companyid
//             _self.name_id = e.customerid
//         })

//         this.$bus.on('update_type',(e)=>{
//             _self.type = e.typename
//             _self.type_typecode = e.typecode
//         })

//         this.$bus.on('update_workorder',(e)=>{
//             _self.workorder = e.product
//             _self.workorder_id = e.id
//         })
//     }
// }
</script>

<style>
.select{
  color: red
}
#address .van-cell__value--alone{
  text-align: center
}
</style>
