<template>
    <van-dialog
        v-model="type_open"
        :show-confirm-button="false"
        :close-on-click-overlay="true"
        >
        <van-radio-group v-model="select_type_id">
            <van-cell-group>
                <van-cell v-for="item in fieldType" :key="item.id" clickable @click="choose(item)">
                    <van-col span="22"><div>{{item.typename}}</div></van-col>
                    <van-col span="2"><van-radio :name="item.typecode" /></van-col>
                </van-cell>
            </van-cell-group>
        </van-radio-group>
    </van-dialog>
</template>

<script>
export default {
    props:['fieldType'],
    data(){
        return {
            searchcompanyname:"",
            type_open:false,
            select_type_id:"",
            // companyList:""
        }
    },
    methods:{
        choose(e){
            this.select_type_id = e.typecode
            // console.log(e)
            this.$bus.emit('update_type',e)
            this.type_open = false
        },
    },
    created(){
        let _self = this
        this.$bus.on('open_type_list',(e)=>{
            _self.type_open = true
        })
    },
    // watch:{
    //     'searchcompanyname':'search'
    // }
}
</script>

