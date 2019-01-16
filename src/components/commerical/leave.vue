<template>
    <van-row style="overflow-x: hidden">
        <van-row style="padding-bottom:80px">
            <van-nav-bar title="普通外勤打卡" />
                <!-- <van-row>
                    <iframe id="markPage" width="100%" height="280px" frameborder=0 scrolling="no" src=""></iframe>
                    <iframe id="geoPage" width="100%" height="30%" frameborder=0 scrolling="no" style="display: none"
                        src="https://apis.map.qq.com/tools/geolocation?key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp&effect=zoom"></iframe>
                </van-row> -->
                <div style="width:80%;margin:auto;margin-top:20px"  @click="get_wx_local">
                    <van-cell-group v-if="localLoading">
                      <center style="padding:10px"><van-loading type="spinner" size="30px" /></center>
                    </van-cell-group>
                    <van-cell-group v-else>
                      <center style="padding-top:18px;display: flex;justify-content:center;align-items:Center;"><van-icon name="aim" style="padding-right:5px;"/> <span>当前定位地址</span></center>
                        <van-cell :value="addr" style="text-align:center" id="address"/>
                    </van-cell-group>
                </div>
                <van-row style="width:80%;margin:auto;margin-top:10px">
                    <center style="padding:20px">{{companyname}}</center>
                    <van-row><van-col span="6" style="font-size:10px">工单内容：</van-col><van-row><van-col span="18" style="font-size:12px">{{product}}</van-col></van-row></van-row>
                    <van-row style="margin-top:10px"><van-col span="6"  style="font-size:10px">外勤类型：</van-col><van-col style="font-size:12px">{{movingStatus}}</van-col></van-row>
                    <van-row style="margin-top:10px"><van-col span="12"  >本次外勤时间：</van-col><van-col span="12">{{show_hour}} 小时 {{show_minutes}} 分{{show_seconds}} 秒</van-col></van-row>
                </van-row>

                <div style="width:80%;margin:auto;margin-top:10px">
                    <van-cell-group>
                        <van-cell :value="type" @click="openType"/>
                    </van-cell-group>
                </div>

                    <!-- 国地税报道结果填写 -->
                    <div style="width:80%;margin:auto;margin-top:20px" v-if="tax_open">
                        <van-cell-group>
                            <van-field v-model="nationalnum" type="text" placeholder="国税账号"/>
                            <van-field v-model="nationalpsw" type="text" placeholder="国税密码"/>
                            <van-cell :value="NationTaxName" @click="openNationTaxType"/>
                        </van-cell-group>
                        <van-cell-group>
                            <van-field v-model="Localnum" type="text" placeholder="地税账号" style="margin-top:5px"/>
                            <van-field v-model="Localpsw" type="text" placeholder="地税密码"/>
                            <van-cell :value="LocalTaxName" @click="openLocalTaxType"/>
                        </van-cell-group>
                    </div>

                    <!-- 社保结果填写 -->
                    <div style="width:80%;margin:auto;margin-top:20px" v-if="socialsecurity_open">
                        <van-cell-group>
                            <van-field v-model="socialsecuritypsw" type="text" placeholder="社保密码"/>
                        </van-cell-group>
                    </div>

                    <!-- 公积金结果填写 -->
                    <div style="width:80%;margin:auto;margin-top:20px" v-if="providentfund_open">
                        <van-cell-group>
                            <van-field v-model="Providentfundnum" type="text" placeholder="公积金账号"/>
                            <van-field v-model="Providentfundpsw" type="text" placeholder="公积金密码"/>
                        </van-cell-group>
                    </div>

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
        <type-list :fieldType="fieldType"></type-list>
        <nation-taxtype></nation-taxtype>
        <local-taxtype></local-taxtype>
    </van-row>
</template>

<script>

import {yasuo} from '../../common/img_beforeUpload'
import TypeList from '../common/typeList'
import NationTaxtype from './nationTaxType'
import LocalTaxtype from './localTaxType'
import schema from 'async-validator'
import wxLocal from '../common/local.js';


export default {
    mixins:[wxLocal],
    components:{
        TypeList,
        NationTaxtype,
        LocalTaxtype
    },
    computed:{
        NationTaxName:function(){
            return this.NationTaxName_array.join(",")
        },
        LocalTaxName:function(){
            return this.LocalTaxName_array.join(",")
        }
    },
    data(){
        return{
            //  展示选择
            tax_open:false,
            socialsecurity_open:false,
            providentfund_open:false,
            //国税类型
            nationalnum:"",
            nationalpsw:"",
            NationTaxtype:"",
            NationTaxName_array:["请选择国税类型"],
            Localnum:"",
            Localpsw:"",
            LocalTaxtype:"",
            LocalTaxName_array:["请选择地税类型"],
            //
            //社保
            socialsecuritypsw:"",
            //公积金
            Providentfundnum:"",
            Providentfundpsw:"",
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
            fieldType:"",
            remark:"",
            addr:"",
            product:"",
            movingStatus:"",
            img_array:[],
            show_img:[],
            workOrder_id:""
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
        openNationTaxType(){
            this.$bus.emit('open_nationTax_list',true)
        },
        openLocalTaxType(){
            this.$bus.emit('open_localTax_list',true)
        },
        openType(){
            this.$bus.emit('open_type_list',true)
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
            // if(this.remark != null && this.remark != "" && this.type != null && this.type != "" && this.type != "选择外勤状态" && this.img_array.length != 0){
            //     if(this.addr != null && this.addr != ""){
            //         // this.submit()
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
            for(let i = 0;i<_self.img_array.length;i++){
                formdata.append('file',_self.img_array[i],"file_" + Date.parse(new Date()) + ".jpg")
            }
            if(_self.tax_open == true){
                formdata.append('nationalnum', _self.nationalnum)
                formdata.append('nationalpsw', _self.nationalpsw)
                if(_self.NationTaxtype[0]!="请选择国税类型"){
                    for(let i = 0;i<_self.NationTaxtype.length;i++){
                        formdata.append(_self.NationTaxtype[i],'Y')
                    }
                }
                formdata.append('Localnum', _self.nationalnum)
                formdata.append('Localpsw', _self.nationalpsw)
                if(_self.LocalTaxtype[0]!="请选择地税类型"){
                    for(let i = 0;i<_self.LocalTaxtype.length;i++){
                        formdata.append(_self.LocalTaxtype[i],'Y')
                    }
                }
            }

            if(_self.socialsecurity_open == true){
                formdata.append('socialsecuritypsw', _self.socialsecuritypsw)
            }

            if(_self.providentfund_open == true){
                formdata.append('Providentfundnum', _self.Providentfundnum)
                formdata.append('Providentfundpsw', _self.Providentfundpsw)
            }

            this.$http.post(url,formdata).then(function(res){
                // console.log(formdata.get('file'))
                // console.log(res)
                if(res.data.msgCode == "40000"){
                _self.button_loading = false
                    // console.log(res)
                    _self.$router.push({
                        name:'Success'
                    })
                    localStorage.setItem('hour',_self.show_hour)
                    localStorage.setItem('minutes',_self.show_minutes)
                    localStorage.setItem('second',_self.show_seconds)
                    if(_self.workOrder_id == null || _self.workOrder_id == ""){
                        _self.$toast.fail('无流转！')
                        console.log("11111")
                    }else{
                        if(_self.type_typecode == "hit"){
                            _self.flowWorkOrder()
                            console.log("22222")
                        }
                        console.log("33333")
                    }
                }else{
                    alert(res.data.msg)
                    _self.button_loading = false
                    _self.$toast.fail('系统错误！')
                }
            }).catch(function(err){
                alert(err)
                _self.button_loading = false
                _self.$toast.fail('网络异常1！')
            })


        },
        //  流转工单
        flowWorkOrder(){
            let _self = this
            let url = `api/order/next`
            let config = {
                workOrderId: _self.workOrder_id,
                backup: _self.remark
            }
            this.$http.post(url,config).then(function(res){
                if(res.data.msgCode == "40000"){
                    _self.$toast.success('流转成功！')
                }else{
                    _self.$toast.fail('流转失败！')
                }
            }).catch(function(err){
                _self.$toast.fail('流转失败！')
            })
        },
        //  获取外勤类型
        getFieldType(){
            let _self = this
            let url = 'api/system/tsType/queryTsTypeByGroupCodes'
            let config = {
                params:{
                    groupCodes:"commercial_status"
                }
            }
            this.$http.get(url,config).then(function(res){
                if(res.data.msgCode == "40000"){
                    _self.fieldType = res.data.data.commercial_status
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
        //         if(loc != "" && loc != null){
        //             // _self.addr = loc.city
        //             _self.addr = loc.addr || loc.city

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
        this.tax_open = false,
        this.socialsecurity_open = false,
        this.providentfund_open = false,
        this.companyname = localStorage.getItem('companyname')
        this.product = localStorage.getItem('product')
        this.workOrder_id = localStorage.getItem('workorderid')
        // this.movingStatus = localStorage.getItem('movingStatus')
        if(localStorage.getItem('movingStatus') == "Y"){
            this.movingStatus = "协助外勤"
        }else{
            this.movingStatus = "非协助外勤"
        }
        if(this.product.match("国地税报道") != null){
            this.tax_open = true
        }
        if(this.product.match("社保开户") != null){
            this.socialsecurity_open = true
        }
        if(this.product.match("公积金开户") != null){
            this.providentfund_open = true
        }
        this.getFieldType()
        // this.getLocalIndex()

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
        }),
        this.$bus.on('update_nationTax_type',(e)=>{
            _self.NationTaxtype = e
            _self.NationTaxName_array = []
            for(let i = 0; i<_self.NationTaxtype.length;i++){
                if(_self.NationTaxtype[i] == "addedvaluetax"){
                    _self.NationTaxName_array.push("增值税")
                }else{
                    _self.NationTaxName_array.push("所得税")
                }
            }
            if(_self.NationTaxtype.length == 0){
                _self.NationTaxName_array.push("请选择国税类型")
            }
        })
        this.$bus.on('update_localTax_type',(e)=>{
            _self.LocalTaxtype = e
            _self.LocalTaxName_array = []
            for(let i = 0; i<_self.LocalTaxtype.length;i++){
                if(_self.LocalTaxtype[i] == "supertax"){
                    _self.LocalTaxName_array.push("附加税")
                }else if(_self.LocalTaxtype[i] == "boxtax"){
                    _self.LocalTaxName_array.push("个税")
                }else if(_self.LocalTaxtype[i] == "Stamptax"){
                    _self.LocalTaxName_array.push("印花税")
                }else{}
            }
            if(_self.LocalTaxtype.length == 0){
                _self.LocalTaxName_array.push("请选择地税类型")
            }
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
