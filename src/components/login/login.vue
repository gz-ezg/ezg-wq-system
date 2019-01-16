<template>
    <van-row style="overflow-x: hidden">
        <van-row>
            <div style="height: 4rem;margin-top:4rem">
                <center>
                    <img style="height: 2.5rem" src="./logo.png"/>
                </center>
            </div>
            <div style="width:80%;margin:auto">
                <van-cell-group>
                        <van-field
                            v-model="username"
                            label="用户名"
                            placeholder="请输入用户名"
                        />
                        <van-field
                            v-model="password"
                            type="password"
                            label="密码"
                            placeholder="请输入密码"
                        />
                </van-cell-group>
            </div>
            <van-row style="width:80%;margin:auto;margin-top:2rem">
                <van-button size="large" type="primary" @click="login">登 陆</van-button>
            </van-row>
        </van-row>
    </van-row>
</template>

<script>
import Cookies from 'js-cookie';
import * as loginApi from '@api/login/index'

export default {
    data(){
        return{
            username:"",
            password:"",
            roleMapIndex: new Map([
                ["salers", "marketIndex"],
                ["kj", "accountIndex"],
                ["kjbgd", "accountIndex"],
                ["jzkj","accountIndex"],
                ["servicer", "commericalIndex"],
                ["ssbgd", "commericalIndex"],
                ["planner", "planIndex"],
                ["qhbgd", "planIndex"],
            ]),
            roleMapLeave: new Map([
                ["salers", "marketLeave"],
                ["kj", "accountLeave"],
                ["kjbgd", "accountLeave"],
                ["jzkj","accountLeave"],
                ["servicer", "commericalLeave"],
                ["ssbgd", "commericalLeave"],
                ["planner", "planLeave"],
                ["qhbgd", "planLeave"],
            ])
        }
    },
    computed:{
        roleArray(){
            return this.$store.state.roleArray
        }
    },
    methods:{
        async login(){
            let config = {
                username: this.username,
                password: this.password
            }
            try {
                let { status, data } = await loginApi.userLogin(config)
                if(status){
                    Cookies.set('user', this.username);
                    Cookies.set('password', this.password);
                    this.$store.dispatch('set_realName', data.data.user.realname)
                    this.$store.dispatch('set_id', data.data.user.id)
                    let roleArray = await loginApi.checkUserRoleByUserId(data.data.user.id)
                    this.$store.dispatch('set_roleArray', roleArray)
                    this.check_unfinish()
                }
            } catch (error) {
                console.log(error)
            }
        },
        async check_unfinish(){
            try {
                let {status, data} = await loginApi.checkLoginUserlegworkPunchcardStatus()
                console.log(data)
                if(status){
                    if(data.data == "unfinished"){
                        let {status:detailStatus, data:detail} = await loginApi.queryUnfinishedPunchCard()
                        if(detailStatus){
                            this.$store.dispatch("set_field_detail", detail.data.unfinishedPunchCard.date)
                            this.to_leave()
                        }
                    }else if(data.data == "affirm"){
                        setTimeout(() => {
                            this.$router.push({
                                name: 'accountComfirm'
                            });
                        }, 500)
                    }else{
                        this.to_index()
                    }
                }
            } catch (error) {
                console.log(error)
            }
        },
        to_index(){
            this.roleArray.every((item, index)=>{
                if(this.roleMapIndex.get(item.rolecode)){
                    setTimeout(()=>{
                        this.$router.push({
                            name: this.roleMapIndex.get(item.rolecode)
                        })
                    },300)
                    return false;
                }else{
                    if(index == this.roleArray.length - 1){
                        setTimeout(()=>{
                            this.$router.push({
                                name: "otherIndex"
                            })
                        },300)
                    }else{
                        return true;
                    }
                }
            })
        },
        to_leave(){
            this.roleArray.every((item, index)=>{
                if(this.roleMapLeave.get(item.rolecode)){
                    setTimeout(()=>{
                        this.$router.push({
                            name: this.roleMapLeave.get(item.rolecode)
                        })
                    },300)
                    return false;
                }else{
                    if(index == this.roleArray.length - 1){
                        setTimeout(()=>{
                            this.$router.push({
                                name: "otherIndex"
                            })
                        },300)
                    }else{
                        return true;
                    }
                }
            })
        },
        //  打卡页面跳转
        toIndex(){
            let _self = this
            let role_array = JSON.parse(localStorage.getItem("role"))

            let roleMap = new Map([
                ["salers", "marketIndex"],
                ["kj", "accountIndex"],
                ["kjbgd", "accountIndex"],
                ["jzkj","accountIndex"],
                ["servicer", "commericalIndex"],
                ["ssbgd", "commericalIndex"],
                ["planner", "planIndex"],
                ["qhbgd", "planIndex"],
            ])

            for(let i = 0;i<role_array.length;i++){
                if(roleMap.get(role_array[i])){
                    setTimeout(()=>{
                        _self.$router.push({
                            name: roleMap.get(role_array[i])
                        })
                    },300)
                    break;
                }else if (i == role_array.length - 1){
                    setTimeout(()=>{
                        _self.$router.push({
                            name: "otherIndex"
                        })
                    },300)
                }
            }
        },
        //  跳转离开打卡页面
        toFinish(){
            let _self = this
            let role_array = JSON.parse(localStorage.getItem("role"))

            let roleMap = new Map([
                ["salers", "marketLeave"],
                ["kj", "accountLeave"],
                ["kjbgd", "accountLeave"],
                ["jzkj","accountLeave"],
                ["servicer", "commericalLeave"],
                ["ssbgd", "commericalLeave"],
                ["planner", "planLeave"],
                ["qhbgd", "planLeave"],
            ])

            for(let i = 0;i<role_array.length;i++){
                if(roleMap.get(role_array[i])){
                    setTimeout(()=>{
                        _self.$router.push({
                            name: roleMap.get(role_array[i])
                        })
                    })
                    break;
                }else if (i== role_array.length - 1){
                    setTimeout(()=>{
                        _self.$router.push({
                            name: "otherLeave"
                        })
                    },300)
                }
            }
        },
        // 获取当前用户角色
        getRole(e){
            let _self = this
            this.$http.get('/api/user/checkUserRoleByUserId?userId='+ e).then(function(res){
                if(res.data.msgCode == "40000"){
                    let temp = []
                    for(let i = 0;i<res.data.data.length;i++){
                        temp.push(res.data.data[i].rolecode)
                    }
                    let str = JSON.stringify(temp)
                    localStorage.setItem('role',str)
                    _self.unfinshCheck()
                }else{
                    _self.$toast.fail("系统错误！")
                }
            }).catch(function(err){
                _self.$toast.fail("网络异常！")
            })
        },
        // 检测是否有未完成打开任务
        unfinshCheck(){
            let _self = this
            this.$http.post('/api/legwork/apiCheckLoginUserlegworkPunchcardStatus').then(function(res){
                if(res.data.msgCode == "40000"){
                    if(res.data.data == "unfinished"){
                        _self.getUnfinshWork()
                        _self.$toast.fail("当前还有未结束的打卡！")
                        _self.toFinish()
                    }else if(res.data.data == "affirm"){
                        _self.$toast.fail("还有未确认的协助外勤信息!")
                        setTimeout(() => {
                            _self.$router.push({
                                name: 'accountComfirm'
                            });
                        }, 500)
                    }else{
                        _self.$toast.success('登录成功！')
                        _self.toIndex()
                    }
                }else{
                    _self.$toast.fail("系统错误！")
                }
            }).catch(function(err){
                _self.$toast.fail("网络异常！")
            })

        },
        //  获取未完成的打卡任务
        getUnfinshWork(){
            let _self = this
            this.$http.post('/api/legwork/apiQueryUnfinishedPunchCard').then(function(res){
                // console.log(res)
                if(res.data.msgCode == "40000"){
                    let temp = res.data.data.unfinishedPunchCard.date
                    let time = temp.clocktime.replace(/\-/g, "/")
                    let date = new Date(time)
                    if(temp.companyname == null){
                        temp.companyname = "空"
                    }
                    localStorage.setItem('companyname',temp.companyname)
                    localStorage.setItem('field_id',temp.id)
                    localStorage.setItem('product',temp.productname)
                    localStorage.setItem('movingStatus',temp.assiststatus)
                    localStorage.setItem('workorderid',temp.workorderid)
                    let temp_time = date.getTime()
                    localStorage.setItem('startTime',temp_time)
                }else{
                    _self.$toast.fail("系统错误！")
                }
            }).catch(function(err){
                _self.$toast.fail("网络异常！")
            })
        },

        autologin(code){
            let _self = this
            let url = `api/legwork/apiLoginByWechatCode`
            let formdata = new FormData()
            formdata.append("agentId","1000022")
            formdata.append("code",code)

            this.$http.post(url,formdata).then(function(res){
                if(res.data.msgCode == 40000){
                    localStorage.setItem('realname', res.data.data.user.realname)
                    localStorage.setItem('id', res.data.data.user.id)
                    _self.getRole(localStorage.getItem("id"))
                }else{
                    _self.$toast.fail("免登陆失败！请登陆！")
                }
            }).catch(function(err){
                _self.$toast.fail("免登陆失效，请登录！")
            })
        },

        loading(){
            let _self = this
            let str = location.href
            let temp = str.split("?")
            let temp2 = str.split("&")
            let params = temp2[0].split("=")
            if(params[1] == "null"){
                _self.$toast.fail("免登陆失效，请登录！")
            }else{
                this.autologin(params[1])
            }
        },
    },
    created(){
        this.loading()
    },
    mounted(){
    //   if(Date.now()<1541474969029 + 3600000*24){
    //     this.$dialog.alert({
    //       message: `针对各位同事反应的地图问题，我们做了紧急排查，决定更换位置信息的获取方式！</br>
    //                 现在点击上方的位置信息单元，可以重新获取位置信息！</br>
    //                 如果在使用过程中依旧存在问题，请及时联系！</br>
    //                 <h2 color="red"><center>温馨提示：</center></h2>如果打开应用后依旧显示旧版地图，请点击右上角“...”处，选择刷新页面即可！
    //                 `
    //     });
    //   }
    }

}
</script>