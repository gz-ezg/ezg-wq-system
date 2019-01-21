<template>
    <van-row style="overflow-x: hidden">
        <van-row style="padding-bottom:2rem">
            <van-nav-bar title="普通外勤打卡" left-arrow @click-left="$backTo()"/>
                <!-- <div style="width:80%;margin:auto;margin-top:2rem" @click="get_wx_local">
                    <van-cell-group v-if="localLoading">
                      <center style="padding:0.25rem"><van-loading type="spinner" size="30px" /></center>
                    </van-cell-group>
                    <van-cell-group v-else>
                      <center style="padding-top:0.5rem;display: flex;justify-content:center;align-items:center;"><van-icon name="aim" style="padding-right:0.1333rem;font-size:0.5rem"/><span style="font-size:0.333rem">当前定位地址</span></center>
                        <van-cell :value="addr"  style="text-align:center" id="address"/>
                    </van-cell-group>
                </div> -->
                <local-init></local-init>
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
                <upload-img></upload-img>
                <div style="width:80%;margin:auto;margin-top:0.6rem">
                    <van-cell-group>
                        <van-field
                            v-model="memo"
                            type="textarea"
                            placeholder="打卡说明（选填）"
                            rows="3"
                            autosize
                        />
                    </van-cell-group>
                </div>
        </van-row>
        <van-tabbar style="margin-top:1rem;">
            <van-button type="primary" bottom-action style="font-size:20px;border-radius:5px" :loading="buttonLoading" @click="data_check">开始打卡</van-button>
        </van-tabbar>
        </van-row>
    </van-row>
</template>

<script lang="ts">
// import {yasuo} from '../../common/img_beforeUpload'
import uploadImg from '../common/main-components/uploadImg.vue'
import localInit from '../common/main-components/localInit.vue'
import schema from 'async-validator'

import wxLocal from '../common/local.js';

import { Component, Vue, Watch, Mixins } from 'vue-property-decorator'
import * as commonApi from '@api/common/index'
import * as clockApi from '@api/clock/index'

@Component({
    // mixins: [wxLocal],
    components: {
        uploadImg,
        localInit
    }
})
export default class OtherIndex extends Vue {
    buttonLoading: boolean = false
    memo = ""

    get company(){
        return this.$store.state.company
    }
    get fieldType(){
        return this.$store.state.fieldType
    }
    open_company_select(id){
        this.$store.commit("change_company_modal_status")
    }

    open_fieldType_select(){
        this.$store.commit("change_fieldType_modal_status")
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

    data_check(){
      let _self = this
      //  表单验证
      var descriptor = {
        company: { type: "number", required: true, message: "请选择服务企业！"},
        type_typecode: { type: "string", required: true, message: "请选择外勤类型！"},
        img_array: { type: "array", required:true, message: "请选择照片！"},
        // addr: {type: "string", required:true, message: "获取定位失效，请重开窗口！"}
      }
      var validator = new schema(descriptor);
      validator.validate(
        {
          company: _self.company.companyid,
          type_typecode: _self.fieldType.typecode,
          img_array: _self.$store.state.showImg,
          // addr: _self.$store.state.filedDetail.addr,
        }, (errors, fields) => {
        if(errors) {
          console.log(errors)
          _self.$toast.fail(errors[0].message)
          return 1;
        }else{
          _self.submit()
        }
      });
    }
    async submit(){
      let _self = this
      this.buttonLoading = true
      let formdata = new FormData()
      formdata.append('companyid', _self.company.companyid)
      formdata.append('address1', "1234")
      formdata.append('customerid', _self.company.customerid)
      formdata.append('fieldtype', _self.fieldType.typecode)
      formdata.append('clockshows',_self.memo)
      let { status, data} = await clockApi.saveLegworkVisitMsg(formdata)
      if(status){
        console.log(data)
      }else{

      }
    }
}

//         submit(){
//             let _self = this
//             let url = `api/zuul/legwork/apiSaveLegworkVisitMsg`
//             _self.buttonLoading = true
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
//                     _self.buttonLoading = false
//                     _self.$router.push({
//                         name:'otherLeave'
//                     })
//                 }else{
//                     alert(res.data.msg)
//                     _self.$toast.fail("系统错误！")
//                     _self.buttonLoading = false
//                 }
//             }).catch(function(err){
//                     alert(err)
//                     _self.$toast.fail("网络异常！")
//                     _self.buttonLoading = false
//             })


//         },
//

//     },
</script>

<style>
.select{
  color: red
}
#address .van-cell__value--alone{
  text-align: center
}
</style>
