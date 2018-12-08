<template>
    <van-row style="overflow-x: hidden">
        <van-row>
            <div style="height: 150px;margin-top: 7rem">
                <center>
                    <img style="height: 80px" src="./logo.png"/>
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
            <van-row style="width:80%;margin:auto;margin-top:60px">
                <van-button size="large" type="primary" @click="login">登 陆</van-button>
            </van-row>
        </van-row>
    </van-row>
</template>

<script>
import Cookies from 'js-cookie';

export default {
    data(){
        return{
            username:"",
            password:""
        }
    },
    methods:{
        login(){
            let _self = this
            let url = `api/user/login`
            let config = {
                username: _self.username,
                password: _self.password
            }
            this.$http.post(url, config).then(function(res){
                if(res.data.msgCode == "40000"){
                    Cookies.set('user', _self.username);
                    Cookies.set('password', _self.password);
                    localStorage.setItem('realname', res.data.data.user.realname)
                    localStorage.setItem('id', res.data.data.user.id)
                    // _self.getRole(localStorage.getItem("id"))
                    _self.$router.push({
                            // name: 'otherIndex'
                            name: 'Test'
                        });

                }else{
                    _self.$toast.fail(res.data.msg)
                }
            }).catch(function(err){
                _self.$toast.fail("网络异常！")
            })
        },
        //  打卡页面跳转
        toIndex(){
            let _self = this
            let role_array = JSON.parse(localStorage.getItem("role"))
            for(let i = 0;i<role_array.length;i++){
                if(role_array[i] == "ssbgd" || role_array[i] == "servicer"){
                    setTimeout(() => {
                        _self.$router.push({
                            name: 'commericalIndex'
                        });
                    }, 500)
                    break;
                }else if(role_array[i] == "salers"){
                    setTimeout(() => {
                        _self.$router.push({
                            name: 'marketIndex'
                        });
                    }, 500)
                    break;
                }else if(role_array[i] == "kj" || role_array[i] == "kjbgd"){
                    setTimeout(() => {
                        _self.$router.push({
                            name: 'accountIndex'
                        });
                    }, 500)
                    break;
                }else if(role_array[i] == "qhbgd" || role_array[i] == "planner"){
                    setTimeout(() => {
                        _self.$router.push({
                            name: 'planIndex'
                        });
                    }, 500)
                    break;
                }else{
                    setTimeout(() => {
                        _self.$router.push({
                            // name: 'otherIndex'
                            name: 'Test'
                        });
                    }, 500)
                }
            }
        },
        toFinish(){
            let _self = this
            let role_array = JSON.parse(localStorage.getItem("role"))
            for(let i = 0;i<role_array.length;i++){
                if(role_array[i] == "ssbgd" || role_array[i] == "servicer"){
                    setTimeout(() => {
                        _self.$router.push({
                            name: 'commericalLeave'
                        });
                    }, 500)
                    break;
                }else if(role_array[i] == "salers"){
                    setTimeout(() => {
                        _self.$router.push({
                            name: 'marketLeave'
                        });
                    }, 500)
                    break;
                }else if(role_array[i] == "kj" || role_array[i] == "kjbgd"){
                    setTimeout(() => {
                        _self.$router.push({
                            name: 'accountLeave'
                        });
                    }, 500)
                    break;
                }else if(role_array[i] == "qhbgd" || role_array[i] == "planner"){
                    setTimeout(() => {
                        _self.$router.push({
                            name: 'planLeave'
                        });
                    }, 500)
                    break;
                }else{
                    setTimeout(() => {
                        _self.$router.push({
                            name: 'otherLeave'
                        });
                    }, 500)
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
                            }
                        );
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
        getAccountComfirm(){
            let _self = this
            this.$http.post('api/legwork/apiAccountAffirmLegworkMsg').then(function(res){
                if(res.data.msgCode == "40000"){
                    console.log(res)
                }else{
                    _self.$toast.fail("系统错误！")
                }
            }).catch(function(err){
                _self.$toast.fail("网络异常！")
                console.log(err)
            })
        },
        //  获取未完成的打卡任务
        getUnfinshWork(){
            let _self = this
            this.$http.post('/api/legwork/apiQueryUnfinishedPunchCard').then(function(res){
                // console.log(res)
                if(res.data.msgCode == "40000"){
                    console.log(res)
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
                console.log(err)
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

        // loading(){
        //     let _self = this
        //     let str = location.href
        //     let temp = str.split("?")
        //     let temp2 = str.split("&")
        //     let params = temp2[0].split("=")
        //     // console.log(params)
        //     if(params[1] == "null"){
        //         _self.$toast.fail("免登陆失效，请登录！")
        //     }else{
        //         console.log(params[1])
        //         this.autologin(params[1])
        //     }
        // }
    },
    created(){
        // this.autologin()
        this.loading()
        this.getRole(localStorage.getItem("id"))
    }
}
</script>
