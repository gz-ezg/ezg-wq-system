<template>
    <van-row style="overflow-x: hidden">
        <van-row style="padding-bottom:60px">
            <van-nav-bar title="普通外勤打卡" />
                <div style="width:80%;margin:auto;margin-top:20px" @click="get_wx_local">
                    <van-cell-group v-if="localLoading"  >
                      <center style="padding:10px"><van-loading type="spinner" size="30px" /></center>
                    </van-cell-group>
                    <van-cell-group v-else>
                      <center style="padding-top:18px;display: flex;justify-content:center;align-items:Center;"><van-icon name="aim" style="padding-right:5px;"/> <span>当前定位地址</span></center>
                        <van-cell :value="addr" style="text-align:center" id="address"/>
                    </van-cell-group>
                </div>
                <van-row>
                    <center style="padding:20px">{{companyname}}</center>
                    <van-col span="12" offset="3">本次外勤时间：</van-col><van-col span="9">{{show_hour}} 小时 {{show_minutes}} 分{{show_seconds}} 秒</van-col>
                </van-row>
                <div style="width:80%;margin:auto;margin-top:20px">
                    <van-cell-group>
                        <van-field
                            v-model="remark"
                            type="textarea"
                            placeholder="本次外勤总结（必填）"
                            rows="3"
                            autosize
                        />
                    </van-cell-group>
                </div>
                <div style="width:80%;margin:auto;margin-top:20px">
                    <center>
                        <!-- capture="camera" -->
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
        </van-row>
        <van-tabbar style="margin-top:30px;">
            <van-button type="primary" bottom-action style="font-size:20px;border-radius:5px" @click="data_check" :loading="button_loading">结束打卡</van-button>
        </van-tabbar>
    </van-row>
</template>

<script>

import {yasuo} from '../../common/img_beforeUpload'
import TypeList from '../common/typeList'
import schema from 'async-validator'
import wxLocal from '../common/local.js';

export default {
    mixins: [wxLocal],
    components:{
        TypeList
    },
    data(){
        return{
            button_loading:false,
            startTime:0,
            show_hour:0,
            show_minutes:0,
            show_seconds:0,
            companyname:"",
            //  开始打卡数据
            company:"请输入公司名称",
            name:"请输入客户名称",
            tel:"请输入客户电话",
            type:"选择外勤状态",
            type_typecode:"",
            company_id:"",
            name_id:"",
            img_array:[],
            show_img:[],
            fieldType:"",
            remark:"",
        }
    },
    methods:{
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
        openType(){
            this.$bus.emit('open_type_list',true)
        },
        data_check(){

            let _self = this

            //  表单验证
            var descriptor = {
              remark: { type: "string", required: true, message: "请输入外勤总结！"},
              img_array: { type: "array", required:true, message: "请选择照片！"},
              addr: {type: "string", required:true, message: "获取定位失效，请重开窗口！"}
            }
            var validator = new schema(descriptor);
            validator.validate(
              {
                remark: _self.remark,
                img_array: _self.img_array,
                addr: _self.addr
              }, (errors, fields) => {
                if(errors) {
                  console.log(errors)
                  // console.log(fields)
                  //  这里写一个异常处理函数，弹窗
                    _self.$toast.fail(errors[0].message)
                  return 1;
                }else{
                  _self.getUnfinshWork()
                }
              }
            );
        },
        submit(){
            let _self = this
            let url = `api/legwork/apiSaveLegworkLeaveVisitMsg`
            let formdata = new FormData()
            _self.button_loading = true
            formdata.append('id', localStorage.getItem('field_id'))
            formdata.append('address2', _self.addr)
            formdata.append('remark', _self.remark)
            for(let i = 0;i<_self.img_array.length;i++){
                formdata.append('file',_self.img_array[i],"file_" + Date.parse(new Date()) + ".jpg")
            }
            this.$http.post(url,formdata).then(function(res){
                if(res.data.msgCode == "40000"){
                _self.button_loading = false
                    _self.$router.push({
                        name:'Success'
                    })
                    localStorage.setItem('hour',_self.show_hour)
                    localStorage.setItem('minutes',_self.show_minutes)
                    localStorage.setItem('second',_self.show_seconds)
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
        //  获取外勤类型
        getFieldType(){
            let _self = this
            let url = 'api/system/tsType/queryTsTypeByGroupCodes'
            let config = {
                params:{
                    groupCodes:"market_status"
                }
            }
            this.$http.get(url,config).then(function(res){
                if(res.data.msgCode == "40000"){
                    _self.fieldType = res.data.data.market_status
                }else{
                    _self.$Toast.fail('系统错误！')
                }
            }).catch(function(err){
                _self.$Toast.fail('网络错误！')
            })
        },
        //  定时器
        time_accout(){
            let _self = this
            this.startTime = localStorage.getItem('startTime')
            setInterval(()=>{
                _self.start()
            },1000)
        },
        start(){
            let _self = this
            let time = this.startTime
            let nowTime = new Date()
            let temp = nowTime.getTime() - time
            let days = Math.floor(temp / (24 * 3600 * 1000))
            temp = temp % (24 * 3600 * 1000)
            let hours = Math.floor(temp / (3600 * 1000))
            temp = temp % (3600 * 1000)
            let minutes = Math.floor(temp / (60 * 1000))
            if(minutes<10){
                minutes = "0" + minutes
            }
            temp = temp % (60 * 1000)
            let seconds = Math.round(temp / 1000)
            if(seconds<10){
                seconds = "0" + seconds
            }
            _self.show_hour = hours
            _self.show_minutes = minutes
            _self.show_seconds = seconds
        },
        getUnfinshWork(){
            let _self = this
            this.$http.post('/api/legwork/apiQueryUnfinishedPunchCard').then(function(res){
                if(res.data.msgCode == "40000"){
                    let temp = res.data.data.unfinishedPunchCard.date
                    if(temp.companyname == null){
                        temp.companyname = "空"
                    }
                    localStorage.setItem('companyname',temp.companyname)
                    localStorage.setItem('field_id',temp.id)
                    localStorage.setItem('product',temp.productname)
                    localStorage.setItem('movingStatus',temp.assiststatus)
                    localStorage.setItem('workorderid',temp.workorderid)
                    _self.submit()
                }else{
                    alert(res.data.msg)
                    _self.$toast.fail("系统错误！")
                }
            }).catch(function(err){
                alert(err.data.msg)
                _self.$toast.fail("网络异常！")
            })
        },
    },
    created(){
        let _self = this
        this.companyname = localStorage.getItem('companyname')
    },
    mounted(){
        this.start()
        this.time_accout()
    },
    beforeUpdate(){
        let _self = this
        this.$bus.on('update_type',(e)=>{
            _self.type = e.typename
            _self.type_typecode = e.typecode
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
