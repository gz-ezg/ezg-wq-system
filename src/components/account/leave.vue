<template>
    <van-row style="overflow-x: hidden">
      <!-- <van-notice-bar
      mode="closeable"
      text="提示：离开打卡时外勤状态默认为“命中”,请根据实际情况自行选择！"
    /> -->
        <van-row style="padding-bottom:80px">
            <van-nav-bar title="普通外勤打卡" />
                <!-- <van-row>
                    <iframe id="markPage" width="100%" height="280px" frameborder=0 scrolling="no" src=""></iframe>
                    <iframe id="geoPage" width="100%" height="30%" frameborder=0 scrolling="no" style="display: none"
                        src="https://apis.map.qq.com/tools/geolocation?key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp&effect=zoom"></iframe>
                </van-row> -->
                <div style="width:80%;margin:auto;margin-top:20px" @click="get_wx_local">
                    <van-cell-group v-if="localLoading">
                      <center style="padding:10px"><van-loading type="spinner" size="30px" /></center>
                    </van-cell-group>
                    <van-cell-group v-else>
                      <center style="padding-top:18px;display: flex;justify-content:center;align-items:Center;"><van-icon name="aim" style="padding-right:5px;"/> <span>当前定位地址</span></center>
                        <van-cell :value="addr" style="text-align:center" id="address"/>
                    </van-cell-group>
                </div>
                <van-row>
                    <center style="padding:20px">{{companyname}}</center>
                    <!-- <van-row><van-col span="4" offset="3" style="font-size:10px">工单内容：</van-col><van-row><van-col style="font-size:10px">{{product}}</van-col></van-row></van-row> -->
                    <!-- <van-row style="margin-top:10px"><van-col span="4" offset="3" style="font-size:10px">外勤类型：</van-col><van-col style="font-size:10px">非协助外勤</van-col></van-row> -->
                    <van-row style="margin-top:10px"><van-col span="12" offset="3" >本次外勤时间：</van-col><van-col span="9">{{show_hour}} 小时 {{show_minutes}} 分{{show_seconds}} 秒</van-col></van-row>
                </van-row>
                <!-- <div style="width:80%;margin:auto;margin-top:20px">
                    <van-cell-group>
                        <van-cell  :value="company" @click="openCompanySearch"/>
                        <van-cell  :value="name" @click="openNameSearch"/>
                        <van-cell  :value="tel" @click="openTelSearch"/>
                    </van-cell-group>
                </div> -->
                <div style="width:80%;margin:auto;margin-top:10px">
                    <van-cell-group>
                        <van-cell :value="type" @click="openType"/>
                    </van-cell-group>
                </div>
                <!-- <div style="width:80%;margin:auto;margin-top:10px">
                    <van-cell-group>
                        <van-cell :value="kjproductName" @click="openProduct"/>
                    </van-cell-group>
                </div> -->
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
                <!-- <div style="width:80%;margin:auto;margin-top:20px">
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
                </div> -->
        </van-row>
        <van-tabbar style="margin-top:30px;">
            <van-button type="primary" bottom-action style="font-size:20px;border-radius:5px" @click="data_check" :loading="button_loading">结束打卡</van-button>
        </van-tabbar>
        <type-list :fieldType="fieldType"></type-list>
        <product-list></product-list>
    </van-row>
</template>

<script>

import {yasuo} from '../../common/img_beforeUpload'
import TypeList from '../common/typeList'
import ProductList from '../common/productList'
import schema from 'async-validator'
import wxLocal from '../common/local.js';


export default {
    mixins:[wxLocal],
    components:{
        TypeList,
        ProductList
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
            type:"有效",
            type_typecode:"valid",
            company_id:"",
            name_id:"",
            fieldType:"",
            remark:"",
            addr:"",
            product:"",
            kjproducttype:"",
            img_array:[],
            show_img:[],
            kjproductName:"请选择服务产品"
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
        openProduct(){
            this.$bus.emit('',true)
        },
        data_check(){
            let _self = this

            //  表单验证
            var descriptor = {
              type_typecode: { type: "string", required: true, message: "请选择外勤状态！"},
              remark: { type: "string", required: true, message: "请输入外勤总结！"},
              img_array: { type: "array", required:true, message: "请选择照片！"},
              addr: {type: "string", required:true, message: "获取定位失效，请重开窗口！"}
            }
            var validator = new schema(descriptor);
            validator.validate(
              {
                remark: _self.remark,
                type_typecode: _self.type_typecode,
                img_array: _self.img_array,
                addr: _self.addr
              }, (errors, fields) => {
                if(errors) {
                  console.log(errors)
                  // console.log(fields)
                  //  这里写一个异常处理函数，弹窗
                    _self.$toast.fail(errors[0].message)
                  return 1;
                  // return handleErrors(errors, fields);
                }else{
                  _self.getUnfinshWork()
                }
              }
            );


            // if( this.type_typecode != null && this.type_typecode != "" && this.remark != null && this.remark != "" && this.type != "选择外勤状态" && this.img_array.length != 0){
            //     if(this.addr != null && this.addr != ""){
            //         this.getUnfinshWork()
            //     }else{
            //         this.$toast.fail('请打开定位！')
            //     }
            // }else{
            //     this.$toast.fail("请完善信息！")
            // }
        },
        submit(){

            let _self = this
            let url = `api/legwork/apiSaveLegworkLeaveVisitMsg`
            let formdata = new FormData()
            _self.button_loading = true
            // console.log(_self.img_array)
            formdata.append('id', localStorage.getItem('field_id'))
            formdata.append('address2', _self.addr)
            formdata.append('remark', _self.remark)
            formdata.append('resulttype', _self.type_typecode)
            formdata.append('kjproducttype',"")
            for(let i = 0;i<_self.img_array.length;i++){
                formdata.append('file',_self.img_array[i],"file_" + Date.parse(new Date()) + ".jpg")
            }
            this.$http.post(url,formdata).then(function(res){
                // console.log(formdata.get('file'))
                console.log(res)
                if(res.data.msgCode == "40000"){
                _self.button_loading = false
                    console.log(res)
                    _self.$router.push({
                        name:'Success'
                    })
                    localStorage.setItem('hour',_self.show_hour)
                    localStorage.setItem('minutes',_self.show_minutes)
                    localStorage.setItem('second',_self.show_seconds)
                }else{
                    _self.button_loading = false
                    alert(res.data.msg)
                    // _self.$toast.fail('系统错误！')
                }
            }).catch(function(err){
                alert(err)
                _self.button_loading = false
                _self.$toast.fail(err.data.msg)
                // _self.$toast.fail('网络异常！')
            })


        },
        //  获取外勤类型
        getFieldType(){
            let _self = this
            let url = 'api/system/tsType/queryTsTypeByGroupCodes'
            let config = {
                params:{
                    groupCodes:"account_status"
                }
            }
            this.$http.get(url,config).then(function(res){
                if(res.data.msgCode == "40000"){
                    _self.fieldType = res.data.data.account_status
                }else{
                    _self.$toast.fail(new Date() + ":(!40000)" +res.data.msg)
                    // _self.$toast.fail('系统错误！')
                }
            }).catch(function(err){
                _self.$toast.fail(err.data.msg)
                // _self.$toast.fail('网络错误！')
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
        //         if(loc != "" && loc != null){
        //             // _self.addr = loc.city
        //             _self.addr = loc.addr || loc.city

        //             // _self.addr = loc.addr

        //             // console.log(_self.addr)
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
        //  定时器
        time_accout(){
            let _self = this
            this.startTime = localStorage.getItem('startTime')
            // setImmediate(()=>{
            //     _self.start()
            // })
            _self.start()
            let time1 = setInterval(()=>{
                _self.start()
            }, 1000)
            _self.$once('hook:beforeDestroy', () => {
                clearInterval(time1);
            })
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
            console.log(hours)
            console.log(minutes)
            console.log(seconds)
            _self.show_hour = hours
            _self.show_minutes = minutes
            _self.show_seconds = seconds
        },
        getUnfinshWork(){
            let _self = this
            this.$http.post('/api/legwork/apiQueryUnfinishedPunchCard').then(function(res){
                // console.log(res)
                if(res.data.msgCode == "40000"){
                    console.log(res)
                    let temp = res.data.data.unfinishedPunchCard.date
                    // let time = temp.clocktime.replace(/\-/g, "/")
                    // let date = new Date(time)
                    if(temp.companyname == null){
                        temp.companyname = "空"
                    }
                    localStorage.setItem('companyname',temp.companyname)
                    localStorage.setItem('field_id',temp.id)
                    localStorage.setItem('product',temp.productname)
                    localStorage.setItem('movingStatus',temp.assiststatus)
                    localStorage.setItem('workorderid',temp.workorderid)
                    _self.submit()
                    // let temp_time = date.getTime()
                    // localStorage.setItem('startTime',temp_time)
                }else{
                    _self.$toast.fail("系统错误！")
                }
            }).catch(function(err){
                _self.$toast.fail("网络异常！")
                console.log(err)
            })
        },

    },
    created(){
        let _self = this
        this.companyname = localStorage.getItem('companyname')
        this.product = localStorage.getItem('product')
        this.getFieldType()
        // this.getLocalIndex()
    },
    mounted(){
        this.time_accout()
    },
    beforeUpdate(){
        let _self = this
        this.$bus.on('update_type',(e)=>{
            _self.type = e.typename
            _self.type_typecode = e.typecode
        })
        this.$bus.on('update_product',(e)=>{
            _self.kjproductName = e.typename
            _self.kjproducttype = e.typecode
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
