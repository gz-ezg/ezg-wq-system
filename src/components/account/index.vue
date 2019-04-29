<template>
    <van-row style="overflow-x: hidden">
        <van-row style="padding-bottom:2rem">
            <van-nav-bar title="普通外勤打卡" left-arrow @click-left="$backTo()"/>
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
                    />
                </van-cell-group>
          <div class="spz">
            <div>A类外勤：</div>
            <div class="spzz">
              <div v-for="item in fieldTypeList" :key="item.id" @click="choose(item)" v-if="item.id===11351 || item.id===11352 || item.id===11353 || item.id===11354 || item.id===11368 || item.id===11355 || item.id===11356 || item.id===11357 || item.id===11358 || item.id===11359 || item.id===11360">
                <div class="spzzz">{{item.typename}}</div>
              </div>
            </div>
          </div>
          <div class="spz">
            <div>B类外勤：</div>
            <div class="spzz">
              <div v-for="item in fieldTypeList" :key="item.id" @click="choose(item)" v-if="item.id===11361 || item.id===11362 || item.id===11363 || item.id===11364 || item.id===11365 || item.id===11366 || item.id===11367">
                <div class="spzzz">{{item.typename}}</div>
              </div>
            </div>
          </div>
          <div class="spz">
            <div>其他：</div>
            <div class="spzz">
              <div v-for="item in fieldTypeList" :key="item.id" @click="choose(item)" v-if="item.id===11105 || item.id===11102 || item.id===11164">
                <div class="spzzz" :class="{'sb':'showNice'}">{{item.typename}}</div>
              </div>
            </div>
          </div>
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
</template>

<script lang="ts">
import uploadImg from '../common/main-components/uploadImg.vue'
import localInit from '../common/main-components/localInit.vue'
import typeList from '../../components/account/'
import schema from 'async-validator'


import { Component, Vue, Watch, Mixins } from 'vue-property-decorator'
import * as commonApi from '@api/common/index'
import * as clockApi from '@api/clock/index'
import { Toast } from 'vant';

@Component({
    components: {
        uploadImg,
        localInit
    }
})
export default class comfirmIndex extends Vue {
    buttonLoading: boolean = false
    memo = ""

    get company(){
        return this.$store.state.fieldDetail.company
    }
    get fieldType(){
        return this.$store.state.fieldDetail.fieldType
    }
    choose(type){
      this.$store.commit("set_fieldType", type)
    }
    get fieldTypeList(){
      return this.$store.state.fieldDetail.fieldTypeList
    }
    get uploadImg(){
      return this.$store.state.fieldDetail.uploadImg
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
                groupCodes:"account_field_type"
            }
        }
        let { account_field_type } = await commonApi.getDictionary(config)
        this.$store.commit("set_fieldTypeList", account_field_type)
    }

    data_check(){
      let _self = this
      //  表单验证
      var descriptor = {
        // company: { type: "number", required: true, message: "请选择服务企业！"},
        type_typecode: { type: "string", required: true, message: "请选择外勤类型！"},
        img_array: { type: "array", required:true, message: "请选择照片！"},
        // addr: {type: "string", required:true, message: "获取定位失效，请重开窗口！"}
      }
      var validator = new schema(descriptor);
      validator.validate(
        {
        //   company: _self.company.companyid,
          type_typecode: _self.fieldType.typecode,
          img_array: _self.$store.state.fieldDetail.showImg,
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
      formdata.append('address1', this.$store.state.fieldDetail.addr)
      formdata.append('customerid', _self.company.customerid)
      formdata.append('fieldtype', _self.fieldType.typecode)
      formdata.append('clockshows',_self.memo)
      for(let i = 0;i<_self.uploadImg.length;i++){
        formdata.append('file',_self.uploadImg[i],"file_" + new Date() + ".jpg")
      }
      let { status, data} = await clockApi.saveLegworkVisitMsg(formdata)
      if(status){
        console.log(data)
        _self.$toast.loading({
          message: "正在跳转至离开打卡界面...",
          duration: 1000
        })
        this.$store.commit("remove_all")
        setTimeout(()=>{
          this.$router.push({
            name: "accountLeave"
          })
        }, 1000)
      }
    }
}
</script>

<style>
.select{
  color: red
}
#address .van-cell__value--alone{
  text-align: center
}
.spz{
  width: 85%;
  background-color: #fff;
  color: #323233;
  font-size: 0.37333rem;
}
.spzz{
  display: -webkit-flex;
  display: flex;
}
  .spzzz{
    width: 2.6rem;
    margin: 0.1rem 0.1rem 0.1rem 0rem;
    padding: 0.1rem;
    border: 1px solid #dddee1;
    text-align: center;
  }
  .spzzz:hover{
    border-color: #57a3f3;
    background: #57a3f3;
    color: #fff;
  }
</style>
