<template>
    <van-dialog
        v-model="workorder_open"
        :show-confirm-button="false"
        :close-on-click-overlay="true"
        >
        <!-- <form action="/">
            <van-search placeholder="请输入公司名称搜索" v-model="searchcompanyid" @click="search"/>
        </form> -->
        <!-- <van-field
            v-model="searchcompanyid"
            placeholder="请输入公司名称搜索"
        /> -->
        <van-radio-group v-model="select_company_id">
            <van-cell-group>
                <van-cell v-for="item in companyList" :key="item.id" clickable @click="choose(item)">
                    <van-col span="22"><div>{{item.product}}</div></van-col>
                    <van-col span="2"><van-radio :name="item.id" /></van-col>
                </van-cell>
            </van-cell-group>
        </van-radio-group>
    </van-dialog>
</template>

<script>
export default {
    data(){
        return {
            searchcompanyid:"",
            workorder_open:false,
            select_company_id:"",
            companyList:""
        }
    },
    methods:{
        search(){
                let _self = this
                let url = `api/legwork/apiCheckWorkorderByCompanyid`
                let formdata = new FormData()
                formdata.append('companyid',_self.searchcompanyid)

                function success(res){
                    console.log(res)
                }

                this.$http.post(url, formdata).then(function(res){
                    if(res.data.msgCode == "40000"){
                        console.log(res)
                        _self.companyList = res.data.data
                        _self.companyList.push({product:"空",id:""})
                    }else{
                        _self.$toast.fail("系统错误！")
                    }
                }).catch(function(err){
                    _self.$toast.fail("网络错误！")
                })

                
        },
        choose(e){
            this.select_company_id = e.id
            this.$bus.emit('update_workorder',e)
            this.workorder_open = false
        },
        getCompanyList(){
            let _self = this
        }
    },
    created(){
        let _self = this
        this.$bus.on('open_workorder_list',(e)=>{
            _self.workorder_open = true
            _self.searchcompanyid = e
            _self.search()
        })
    },
    watch:{
        'searchcompanyid':'search'
    }
}
</script>

<style>
    .van-field__clear, .van-field__icon{
        margin-right:0px
    }
</style>