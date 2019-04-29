<template>
    <van-dialog
        :value="fieldTypeModalStatus"
        :show-confirm-button="false"
        :close-on-click-overlay="true"
        show-cancel-button
        @cancel="close"
        >
        <van-radio-group :value="fieldType.typecode">
            <van-cell-group>
                <van-cell v-for="item in fieldTypeList" :key="item.id" clickable>
                    <van-col span="22"><div>{{item.typename}}</div></van-col>
                    <van-col span="2"><van-radio :name="item.typecode" /></van-col>
                </van-cell>
            </van-cell-group>
        </van-radio-group>

    </van-dialog>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import * as commonApi from '@api/common/index.js'


@Component
export default class typeList extends Vue{
    get fieldTypeModalStatus(){
        return this.$store.state.modalStatus.fieldTypeModalStatus
    }
    get fieldTypeList(){
        return this.$store.state.fieldDetail.fieldTypeList
    }
    get fieldType(){
        return this.$store.state.fieldDetail.fieldType
    }

    choose(type){
        this.$store.commit("set_fieldType", type)
        this.$store.commit("change_fieldType_modal_status")
    }

    close(){
        this.$store.commit("change_fieldType_modal_status")
    }
}
</script>
<style>
  .spz{
    width: 85%;
    padding: 0.26667rem 0rem 0.26667rem 1.2rem;
    background-color: #fff;
    color: #323233;
    font-size: 0.37333rem;
    overflow: hidden;
  }
  .spzz{
    display: -webkit-flex;
    display: flex;
    flex-wrap: wrap;
  }
  .spzzz{
    margin: 0.1rem 0.1rem 0.1rem 0rem;
    padding: 0.1rem;
    border: 1px solid #dddee1;
  }
  .spzzz:hover{
    border-color: #57a3f3;
  }
  .van-dialog {
    font-size: 0.42667rem;
    overflow: hidden;
    -webkit-transition: .3s;
    transition: .3s;
    border-radius: 0.10667rem;
    background-color: #fff;
    -webkit-transform: translate3d(-50%,-50%,0);
    transform: translate3d(-50%,-50%,0);
  }
</style>
