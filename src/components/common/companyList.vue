<template>
    <van-dialog
        v-model="company_open"
        :show-confirm-button="false"
        :close-on-click-overlay="true"
        >
        <form action="/">
            <van-search placeholder="请输入公司名称搜索" v-model="searchcompanyname" @click="search"/>
        </form>
        <!-- <van-field
            v-model="searchcompanyname"
            placeholder="请输入公司名称搜索"
        /> -->
        <van-radio-group v-model="select_company_id">
            <van-cell-group>
                <van-cell v-for="item in companyList" :key="item.companyid" clickable @click="choose(item)">
                    <van-col span="22"><div>{{item.companyname}}</div></van-col>
                    <van-col span="2"><van-radio :name="item.companyid" /></van-col>
                </van-cell>
            </van-cell-group>
        </van-radio-group>
    </van-dialog>
</template>

<script>
export default {
    data(){
        return {
            searchcompanyname:"",
            company_open:false,
            select_company_id:"",
            companyList:""
        }
    },
    methods:{
        search(){
                let _self = this
                let url = `api/legwork/apiQueryCompanyOrCustomerMsg`
                let config = {
                    params:{
                        companyname: _self.searchcompanyname
                    }
                }

                function success(res){
                    _self.companyList = res.data.data
                }

                this.$Get(url, config, success)
                // this.$http.get(url, config).then(function(res){
                //     if(res.data.msgCode == "40000"){
                //         _self.companyList = res.data.data                   
                //     }else{
                //         _self.$toast.fail('系统错误！')                      
                //     }
                // }).catch(function(err){
                //     _self.$toast.fail('网络错误！')
                // })
        },
        choose(e){
            this.select_company_id = e.companyid
            this.$bus.emit('update_info',e)
            this.company_open = false
        },
        // getCompanyList(){
        //     let _self = this
        // }
    },
    created(){
        let _self = this
        this.$bus.on('open_company_list',(e)=>{
            _self.company_open = true
            _self.search()
        })
    },
    watch:{
        'searchcompanyname':'search'
    }
}
</script>

<style>
    .van-field__clear, .van-field__icon{
        margin-right:0px
    }
</style>