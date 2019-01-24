<template>
    <van-row style="overflow-x: hidden">
        <van-row style="padding-bottom:60px">
            <van-nav-bar title="普通外勤打卡" left-arrow @click-left="$backTo()"/>
                <!-- <van-row>
                    <iframe id="markPage" width="100%" height="250px" frameborder=0 scrolling="no" src=""></iframe>
                    <iframe id="geoPage" width="100%" height="10%" frameborder=0 scrolling="no" style="display: none"
                        src="https://apis.map.qq.com/tools/geolocation?key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp&effect=zoom"></iframe>
                </van-row> -->

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
                        <van-cell  :value="name" @click="openCompanySearch"/>
                        <van-cell  :value="tel" @click="openCompanySearch"/>
                        <van-cell  :value="workorder" @click="openWorkOrderSearch"/>
                        <!-- <van-cell  :value="tel" @click="openTelSearch"/>                 -->
                    </van-cell-group>
                </div>
                <div style="width:80%;margin:auto;margin-top:20px">
                    <van-cell-group>
                        <van-cell :value="type" @click="openType"/>
                    </van-cell-group>
                </div>

                <div style="width:80%;margin:auto;margin-top:20px" v-if="isAssist">
                    <van-cell-group>
                        <van-cell>
                            <van-radio-group v-model="assiststatus">
                                <van-col span="12"><van-radio name="Y">协助外勤</van-radio></van-col>
                                <van-col span="12"><van-radio name="N">非协助外勤</van-radio></van-col>
                            </van-radio-group>
                        </van-cell>
                    </van-cell-group>
                </div>

                <div style="width:80%;margin:auto;margin-top:20px" v-if="isAccount">
                    <van-cell-group>
                        <van-cell :value="accountName" @click="openAccount"/>
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
        <!-- <tel-list></tel-list>
        <customer-list></customer-list> -->
        <work-order-list></work-order-list>
        <type-list :fieldType="fieldType"></type-list>
        <account-list></account-list>
    </van-row>
</template>

<script>
import CompanyList from '../common/companyList'
// import CustomerList from '../common/customerList'
// import TelList from '../common/telList'
import  WorkOrderList from '../common/workOrderList'
import TypeList from '../common/typeList'
import AccountList from './accountList'

import schema from 'async-validator'
import wxLocal from '../common/local.js';


import {yasuo} from '../../common/img_beforeUpload'

export default {
    mixins:[wxLocal],
    components:{
        CompanyList,
        TypeList,
        WorkOrderList,
        AccountList
    },
    data(){
        return{
            clockshows:"",
            //  协助外勤展示
            isAssist:false,
            isAccount:false,
            accountName:"请选择协助会计",
            accountId:"",
            assiststatus:"N",
            button_loading:false,
            company:"请输入公司名称",
            name:"客户名称",
            tel:"客户电话",
            type:"选择外勤类型",
            workorder:"请选择工单",
            type_typecode:"",
            company_id:"",
            name_id:"",
            workorder_id:"",
            fieldType:"",
            img_array:[],
            show_img:[],
            message:"",
            addr:""
        }
    },
    methods:{
        openAccount(){
            this.$bus.emit('open_account_list',true)
        },
        openCompanySearch(){
            this.$bus.emit('open_company_list',true)
        },
        // openNameSearch(){
        //     this.$bus.emit('open_name_list',true)
        // },
        // openTelSearch(){
        //     this.$bus.emit('open_tel_list',true)
        // },
        openWorkOrderSearch(){
            let _self = this
            if(_self.company_id != null && _self.company_id != ""){
                _self.$bus.emit('open_workorder_list', _self.company_id)
            }else{
                _self.$toast.fail('请选择公司！')
            }
        },
        openType(){
            this.$bus.emit('open_type_list',true)
        },
        data_check(){
            let _self = this
            var descriptor = {
              company: { type: "string", required: true, message: "请选择公司！"},
              workorder: {required:true, message: "请选择工单！"},
              type_typecode: { type: "string", required: true, message: "请选择外勤类型！"},
              img_array: { type: "array", required:true, message: "请选择照片！"},
              addr: {type: "string", required:true, message: "获取定位失效，请重开窗口！"},
            }
            var validator = new schema(descriptor);
            validator.validate(
              {
                company: _self.company,
                type_typecode: _self.type_typecode,
                img_array: _self.img_array,
                addr: _self.addr,
                workorder: _self.workorder
              }, (errors, fields) => {
                if(errors) {
                  console.log(errors)
                  // console.log(fields)
                  //  这里写一个异常处理函数，弹窗
                    _self.$toast.fail(errors[0].message)
                  return 1;
                  // return handleErrors(errors, fields);
                }else{
                  _self.submit()
                }
              }
            );

            // if(this.company != "请输入公司名称" && this.company != "" && this.company != null && this.type != ""  && this.workorder != "" && this.workorder != null && this.img_array != "" && this.img_array != null){
            //     if(_self.addr != null && _self.addr != ""){
            //         _self.submit()
            //     }else{
            //         _self.$toast.fail('请打开定位！')
            //     }
            // }else{
            //     this.$toast.fail("请完善信息！")
            // }
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

            if(_self.workorder_id != "" && _self.workorder_id != null){
              formdata.append('workorderid',_self.workorder_id)
            }
            formdata.append('assiststatus',_self.assiststatus)
            if(_self.accountId != "" && _self.accountId != null){
                formdata.append("accountid",_self.accountId)
            }
            if(_self.workorder == "空"){
                formdata.append('productname',"")
            }else{
                formdata.append('productname',_self.workorder)
            }
            for(let i = 0;i<_self.img_array.length;i++){
                formdata.append('file',_self.img_array[i],"file_" + Date.parse(new Date()) + ".jpg")
            }

            this.$http.post(url,formdata).then(function(res){
                console.log(res)
                // console.log(formdata.get('file'))
                if(res.data.msgCode == "40000"){
                    // localStorage.setItem('companyid',_self.company_id)
                    localStorage.setItem('companyname',_self.company)
                    localStorage.setItem('field_id',res.data.data.legworkId)
                    localStorage.setItem('product',_self.workorder)
                    //  计时器开始
                    let start_time = new Date()
                    localStorage.setItem('startTime',start_time.getTime())
                    localStorage.setItem('movingStatus',res.data.data.assiststatus)
                    localStorage.setItem('workorderid',_self.workorder_id)
                    _self.button_loading = false
                    // console.log(res)
                    _self.$router.push({
                        name:'commericalLeave'
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
                    groupCodes:"commercial_field_type"
                }
            }
            this.$http.get(url,config).then(function(res){
                if(res.data.msgCode == "40000"){
                    _self.fieldType = res.data.data.commercial_field_type
                }else{
                    _self.$toast.fail('系统错误！')
                }
            }).catch(function(err){
                _self.$toast.fail('网络错误！')
            })
        },
        // getLocalIndex(){
        //     let loc;
        //     let isMapInit = false;
        //     let _self = this
        //     //监听定位组件的message事件
        //     window.addEventListener('message', function(event) {
        //         loc = event.data; // 接收位置信息
        //         // console.log('location', loc);
        //         // _self.addr = loc.addr
        //         if(loc != ""&& loc != null){
        //             // _self.addr = loc.city
        //             // _self.addr = loc.addr
        //             _self.addr = loc.addr || loc.city
        //             // alert(_self.addr)


        //             console.log(_self.addr)
        //         }
        //         // alert(_self.addr)
        //         if(loc  && loc.module == 'geolocation') { //定位成功,防止其他应用也会向该页面post信息，需判断module是否为'geolocation'
        //             let markUrl = 'https://apis.map.qq.com/tools/poimarker' +
        //             '?marker=coord:' + loc.lat + ',' + loc.lng +
        //             ';title:我的位置;addr:' + (loc.addr || loc.city) +
        //             '&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp';
        //             //给位置展示组件赋值
        //             document.getElementById('markPage').src = markUrl;
        //         } else { //定位组件在定位失败后，也会触发message, event.data为null
        //             console.log('定位失败');
        //         }

        //         /* 另一个使用方式
        //         if (!isMapInit && !loc) { //首次定位成功，创建地图
        //             isMapInit = true;
        //             createMap(event.data);
        //         } else if (event.data) { //地图已经创建，再收到新的位置信息后更新地图中心点
        //             updateMapCenter(event.data);
        //         }
        //         */
        //     }, false);
        //     //为防止定位组件在message事件监听前已经触发定位成功事件，在此处显示请求一次位置信息
        //     document.getElementById("geoPage").contentWindow.postMessage('getLocation', '*');

        //     //设置6s超时，防止定位组件长时间获取位置信息未响应
        //     setTimeout(function() {
        //         if(!loc) {
        //             //主动与前端定位组件通信（可选），获取粗糙的IP定位结果
        //         document.getElementById("geoPage").contentWindow.postMessage('getLocation.robust', '*');
        //         }
        //     }, 6000); //6s为推荐值，业务调用方可根据自己的需求设置改时间，不建议太短
        // },
        isOpen(){
            let _self = this
            if(_self.workorder == "空"){
                _self.isAssist = true
            }else{
                _self.isAssist = false
                _self.isAccount = false
                _self.accountName = "请选择协助会计"
                _self.accountId = ""
                _self.assiststatus = "N"
            }
        },
        isOpenAccount(){
            let _self = this
            if(_self.assiststatus == "Y"){
                _self.isAccount = true
            }else{
                _self.isAccount = false
                _self.accountName = "请选择协助会计"
                _self.accountId = ""
            }
        }
    },
    created(){
        this.getFieldType()
        // this.getLocalIndex()
        let _self = this
    },
    beforeUpdate(){
        let _self = this

        this.$bus.on('update_info',(e)=>{
            _self.company = e.companyname
            _self.name = e.name
            _self.tel = e.tel
            _self.company_id = e.companyid
            _self.name_id = e.customerid
            _self.workorder = "请选择工单"
            _self.workorder_id = ""
            if(e.companyid == ""){
                _self.workorder = "空"
                // _self.workorder_id = "50101"
            }
        })

        this.$bus.on('update_type',(e)=>{
            // console.log('11111')
            _self.type = e.typename
            _self.type_typecode = e.typecode
            // console.log(e)
        })

        this.$bus.on('update_workorder',(e)=>{
            _self.workorder = e.product
            _self.workorder_id = e.id
        })

        this.$bus.on('update_account',(e)=>{
            _self.accountName = e.realname
            _self.accountId = e.id
         })
    },
    watch:{
        'workorder':'isOpen',
        'assiststatus':'isOpenAccount'
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
