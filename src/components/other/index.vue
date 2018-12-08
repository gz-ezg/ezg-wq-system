<template>
    <van-row style="overflow-x: hidden">
        <van-row style="padding-bottom:60px">
            <van-nav-bar title="普通外勤打卡" left-arrow @click-left="$backTo()"/>
                <div style="width:80%;margin:auto;margin-top:20px" @click="get_wx_local">
                    <van-cell-group v-if="localLoading">
                      <center style="padding:10px"><van-loading type="spinner" size="30px" /></center>
                    </van-cell-group>
                    <van-cell-group v-else>
                      <center style="padding-top:18px;display: flex;justify-content:center;align-items:Center;"><van-icon name="aim" style="padding-right:5px;"/> <span>当前定位地址</span></center>
                        <van-cell :value="addr"  style="text-align:center" id="address"/>
                    </van-cell-group>
                </div>
                <div style="width:80%;margin:auto;margin-top:20px">
                    <van-cell-group>
                        <van-cell  :value="company" @click="openCompanySearch" />
                    </van-cell-group>
                </div>
                <div style="width:80%;margin:auto;margin-top:20px">
                    <van-cell-group>
                        <van-cell :value="type" @click="openType"/>
                    </van-cell-group>
                </div>
                <div style="width:80%;margin:auto;margin-top:20px">
                    <center>
                        <van-uploader accept="image/*" :before-read="upload" capture="camera">
                            <van-icon name="photograph" /><span>  点击拍摄照片</span>
                        </van-uploader>
                    </center>
                </div>
                <div style="margin-top:10px">
                    <van-row>
                        <van-col v-for="(item,index) in show_img" :key="index" style="margin-left:3px;margin-right:3px">
                            <img :src="item.src" alt="Ballade" style="width: 100px;height:100px"/>
                        </van-col>
                    </van-row>
                </div>
                <div style="width:80%;margin:auto;margin-top:20px">
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
        </van-row>
        <van-tabbar style="margin-top:30px;">
            <van-button type="primary" bottom-action style="font-size:20px;border-radius:5px" :loading="button_loading" @click="data_check">开始打卡</van-button>
        </van-tabbar>
        <company-list></company-list>
        <work-order-list></work-order-list>
        <type-list :fieldType="fieldType"></type-list>
        <!-- <company-list @update-company="update_company"></company-list>
        <work-order-list @update-wordorder="update_workorder"></work-order-list>
        <type-list :fieldType="fieldType" @update-type="update_type"></type-list> -->
    </van-row>
</template>

<script>
import CompanyList from '../common/companyList'
import WorkOrderList from '../common/workOrderList'
import TypeList from '../common/typeList'
import {yasuo} from '../../common/img_beforeUpload'

import schema from 'async-validator'

import wxLocal from '../common/local.js';

export default {
    mixins:[wxLocal],
    components:{
        CompanyList,
        TypeList,
        WorkOrderList
    },
    data(){
        return{
            clockshows:"",
            button_loading:false,
            company:"请输入公司名称",
            name:"请输入客户名称",
            tel:"请输入客户电话",
            type:"选择外勤类型",
            type_typecode:"",
            company_id:"",
            name_id:"",
            workorder_id:"",
            fieldType:"",
            img_array:[],
            show_img:[],
            message:"",
            addr:"暂无"
        }
    },
    methods:{
        openCompanySearch(){
            this.$bus.emit('open_company_list',true)
        },
        openType(){
            this.$bus.emit('open_type_list',true)
        },
        data_check(){
            let _self = this
            //  表单验证
            var descriptor = {
              company: { type: "string", required: true, message: "请输入外勤总结！"},
              type_typecode: { type: "string", required: true, message: "请选择外勤类型！"},
              img_array: { type: "array", required:true, message: "请选择照片！"},
              addr: {type: "string", required:true, message: "获取定位失效，请重开窗口！"}
            }
            var validator = new schema(descriptor);
            validator.validate(
              {
                company: _self.company,
                type_typecode: _self.type_typecode,
                img_array: _self.img_array,
                addr: _self.addr
              }, (errors, fields) => {
                if(errors) {
                  console.log(errors)
                  //  这里写一个异常处理函数，弹窗
                    _self.$toast.fail(errors[0].message)
                  return 1;
                }else{
                  _self.submit()
                }
              }
            );
        },
        submit(){
            let _self = this
            let url = `api/zuul/legwork/apiSaveLegworkVisitMsg`
            _self.button_loading = true
            let formdata = new FormData()
            formdata.append('companyid', _self.company_id)
            formdata.append('address1', _self.addr)
            formdata.append('customerid', _self.name_id)
            formdata.append('fieldtype', _self.type_typecode)
            formdata.append('clockshows',_self.clockshows)

            for(let i = 0;i<_self.img_array.length;i++){
                formdata.append('file',_self.img_array[i],"file_" + Date.parse(new Date()) + ".jpg")
            }

            this.$http.post(url,formdata).then(function(res){
                if(res.data.msgCode == "40000"){
                    localStorage.setItem('companyname',_self.company)
                    localStorage.setItem('field_id',res.data.data.legworkId)
                    localStorage.setItem('product',_self.workorder)
                    //  计时器开始
                    let start_time = new Date()
                    localStorage.setItem('startTime',start_time.getTime())
                    _self.button_loading = false
                    _self.$router.push({
                        name:'otherLeave'
                    })
                }else{
                    alert(res.data.msg)
                    _self.$toast.fail("系统错误！")
                    _self.button_loading = false
                }
            }).catch(function(err){
                    alert(err)
                    _self.$toast.fail("网络异常！")
                    _self.button_loading = false
            })


        },
        upload(e){
            let _self = this
            let img = yasuo(e,_self.img_array)
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
        },
        //  获取外勤类型
        getFieldType(){
            let _self = this
            let url = 'api/system/tsType/queryTsTypeByGroupCodes'
            let config = {
                params:{
                    groupCodes:"other_field_type"
                }
            }
            this.$http.get(url,config).then(function(res){
                if(res.data.msgCode == "40000"){
                    _self.fieldType = res.data.data.other_field_type
                }else{
                    _self.$toast.fail('系统错误！')
                }
            }).catch(function(err){
                _self.$toast.fail('网络错误！')
            })
        },
        // wx_init(){
        //   let _self = this
        //   let url = "api/system/wechat/company/js_api_ticket"

        //   let config = {
        //     params:{
        //       agentId: "1000028",
        //       url: location.href.split('#')[0]
        //     }
        //   }

        //   return new Promise((resolve, reject)=>{
        //       function success(res){
        //         wx.config({
        //         beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
        //         debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        //         appId: 'wx7666e5cbbd22b505', // 必填，企业微信的corpID
        //         timestamp: res.data.data.timestamp, // 必填，生成签名的时间戳
        //         nonceStr: res.data.data.noncestr, // 必填，生成签名的随机串
        //         signature: res.data.data.sign,// 必填，签名，见附录1
        //         jsApiList: ["getLocation"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        //         })
        //         resolve()
        //     }
        //     this.$Get(url,config, success)
        //   })
        // },
      //   get_wx_local(){
      //     let _self = this
      //     wx.ready(function(){
      //         wx.getLocation({
      //             type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
      //             success: function (res) {
      //                 _self.get_real_address(res)
      //             }
      //         });
      //     });
      // },
      // get_real_address(res){
      //   let _self = this
      //   var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
      //   var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
      //   var speed = res.speed; // 速度，以米/每秒计
      //   var accuracy = res.accuracy; // 位置精度

      //   let locUrl = 'api/system/wechat/address/location'
      //   let config = {
      //     params:{
      //       lat: latitude,
      //       lng: longitude
      //     }
      //   }

      //   function success(res){
      //    console.log(res.data.data)
      //    let temp = JSON.parse(res.data.data)
      //    console.log(temp)
      //    _self.addr = temp.result.address
      //   }

      //  _self.$Get(locUrl, config,success)
      // },
        update_company(e){

        },
        update_workorder(e){

        },
        update_type(e){

        }
    },
    created(){
        this.getFieldType()
        let _self = this
    },
    mounted(){
        let _self = this
        // this.wx_init().then(()=>{
        //     _self.get_wx_local()
        // }).catch(()=>{
        //     _self.$toast.fail("获取地址失败！请退出重试！")
        // })
    },
    beforeUpdate(){
        let _self = this

        this.$bus.on('update_info',(e)=>{
            _self.company = e.companyname
            _self.name = e.name
            _self.tel = e.tel
            _self.company_id = e.companyid
            _self.name_id = e.customerid
        })

        this.$bus.on('update_type',(e)=>{
            _self.type = e.typename
            _self.type_typecode = e.typecode
        })

        this.$bus.on('update_workorder',(e)=>{
            _self.workorder = e.product
            _self.workorder_id = e.id
        })
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
</style>
