import Axios from "axios";
import { rejects } from "assert";

//  获取access_token
let url = "https://qyapi.weixin.qq.com/cgi-bin/gettoken"

let config = {
    params: {
        corpid: "wx7666e5cbbd22b505",
        corpsecret: "Wd2manWdGA0iXCsfJEvPWvfMifPIp9fERw6iEqz5IP8"
    }
}

let access_token

Axios.get(url, config).then(function(res){
        console.log(res.data)
        if(res.data.errcode === 0){
            this.access_token = res.data.access_token
        }else{
            console.log(res.data.errmsg)
        }
    }).catch(function(err){
        console.log(err)
    })

//  获取企业的jsapi_ticket

let url2 = "https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket"

let ticket

let config2 = {
    params: {
        access_token: this.access_token
    }
}
Axios.get(url2, config2).then(function(res){
    if(res.data.errcode === 0){
        this.ticket = res.data.ticket
    }
})

let noncestr = "Wm3WZYTPz0wzccnW"
let timestamp = Date.now()/1000
let url = "http://mp.weixin.qq.com?"
//  需要再redis中缓存access_token和ticket

let string = "jsapi_ticket="+this.ticket+"&noncestr="+this.noncestr+"&timestamp="+this.timestamp+"&url="+this.url

sha1(string)

// 签名用的noncestr和timestamp必须与wx.config中的nonceStr和timestamp相同。
// 签名用的url必须是调用JS接口页面的完整URL。
// 出于安全考虑，开发者必须在服务器端实现签名的逻辑。
