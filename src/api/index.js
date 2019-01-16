import axios from 'axios'
import { Toast } from 'vant';

function commonFail(err){
    console.log("fail")
    console.log(err)
    if(err.status == 200){
        Toast.fail(err.data.msg)
    }else{
        Toast.fail("服务器异常！"+ err.message)
    }

    // return false
}

function AjaxGet(url, config, success, fail=commonFail){
    let baseUrl = 'api/' + url
    return new Promise((resolve, reject)=>{
        axios.get(baseUrl, config).then((res)=>{
            if(res.status == 200 && res.data.msgCode == 40000){
                resolve(res.data.data)
            }else{
                fail(res)
            }
        }).catch((err)=>{
            reject(fail(err))
        })
    })
}

function AjaxPost(url, config, success, fail=commonFail){
    let baseUrl = 'api/' + url
    return new Promise((resolve, reject)=>{
        axios.post(baseUrl, config).then((res)=>{
            if(res.status == 200 && res.data.msgCode == 40000){
                Toast.success(res.data.msg)
                resolve({
                    status: true,
                    data: res.data
                })
            }else{
                Toast.fail(res.data.msg)
                resolve({
                    status: false,
                    data: res.data
                })
            }
        }).catch((err)=>{
            reject(fail(err))
        })
    })
}

function AjaxDic(params){
    let config = {
        params: {
            groupCodes: params
        }
    }
    let baseUrl = 'api/system/tsType/queryTsTypeByGroupCodes'
    return new Promise((resolve, reject)=>{
        axios.get(baseUrl, config).then((res)=>{
            if(res.status == 200 && res.data.msgCode == 40000){
                resolve(res.data.data)
            }else{
                fail(res)
            }
        }).catch((err)=>{
            reject(fail(err))
        })
    })
}

export {AjaxGet, AjaxDic, AjaxPost};