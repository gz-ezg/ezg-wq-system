<template>
    <van-dialog
        v-model="type_open"
        :show-confirm-button="true"
        :close-on-click-overlay="false"
        @confirm="save"
        >
        <van-checkbox-group v-model="select_type_id">
            <van-cell-group>
                <van-cell v-for="item in nation_Tax_Type" :key="item.id" :title="item.typename" @click="choose(item)" @change="choose" >
                    <van-checkbox :name="item.typecode" />
                </van-cell>
            </van-cell-group>
        </van-checkbox-group>
        <!-- <van-checkbox-group v-model="result">
            <van-cell-group>
                <van-cell v-for="item in list" :title="`复选框 ${item}`" :key="item">
                <van-checkbox :name="item" />
                </van-cell>
            </van-cell-group>
        </van-checkbox-group> -->
        <!-- <van-button type="primary" @click="save" bottom-action>关闭</van-button> -->
    </van-dialog>
</template>

<script>
export default {
    // props:['fieldType'],
    data(){
        return {
            searchcompanyname:"",
            type_open:false,
            select_type_id:[],
            nation_Tax_Type:[
                {
                    id:1,
                    typecode:"addedvaluetax",
                    typename:"增值税"
                },
                {
                    id:2,
                    typecode:"Incometax",
                    typename:"所得税"
                }
            ]
            // companyList:""
        }
    },
    methods:{
        //  点击全行选中
        choose(e){
            // console.log(e)
            
            // console.log(e)
            // this.$bus.emit('update_nationTax_type',e)
            // this.type_open = false
        },
        save(){
            let _self = this
            this.type_open = false
            this.$bus.emit('update_nationTax_type', _self.select_type_id)
            this.$bus.off('update_nationTax_type')
        }
    },
    created(){
        let _self = this
        this.$bus.on('open_nationTax_list',(e)=>{
            _self.type_open = true
        })
    },
    // watch:{
    //     'searchcompanyname':'search'
    // }
}
</script>

