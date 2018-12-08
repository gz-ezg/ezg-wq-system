<template>
  <div style="width:80%;margin:auto;margin-top:20px">
    <center @click="open">
      <!-- <input type="file" name="pic" id="pic" accept="image/*" capture="camera"/> -->
      <van-uploader accept="image/*" :before-read="upload" type="file" >
        <van-icon name="photograph" /><span>  点击拍摄照片</span>
      </van-uploader>

      <div @click="get_img">微信获取照片</div>
    </center>
  </div>
</template>

<script>
import {yasuo} from '../../common/img_beforeUpload'

export default {
  data(){
    return{
      img_array:[],
      show_img:[]
    }
  },
  methods:{
    get_img(){
      wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
          defaultCameraMode: "normal", //表示进入拍照界面的默认模式，目前有normal与batch两种选择，normal表示普通单拍模式，batch表示连拍模式，不传该参数则为normal模式。（注：用户进入拍照界面仍然可自由切换两种模式）
          success: function (res) {
              console.log(res)
              var localIds = res.localIds; // 返回选定照片的本地ID列表，
                      // andriod中localId可以作为img标签的src属性显示图片；
                      // 而在IOS中需通过上面的接口getLocalImgData获取图片base64数据，从而用于img标签的显示
              wx.getLocalImgData({
                localId: localIds[0], // 图片的localID
                success: function (res) {
                    var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
            }
            });
          }
      });
    },
    upload(e){
            // console.log(e)
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
            // console.log(this.img_array)
        },
    wx_init(){
      let _self = this
      let url = "api/system/wechat/company/js_api_ticket"

      let config = {
        params:{
          agentId: "1000028",
          url: location.href.split('#')[0]
        }
      }

      function success(res){
        wx.config({
          beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
          debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: 'wx7666e5cbbd22b505', // 必填，企业微信的corpID
          timestamp: res.data.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.data.data.noncestr, // 必填，生成签名的随机串
          signature: res.data.data.sign,// 必填，签名，见附录1
          jsApiList: ["getLocation","chooseImage","getLocalImgData"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        })
        wx.ready(function(){
            wx.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
                console.log(res)
                alert(res)
                var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                var speed = res.speed; // 速度，以米/每秒计
                var accuracy = res.accuracy; // 位置精度
                let locUrl = 'api/system/wechat/address/location'
                let config = {
                  params:{
                    lat: latitude,
                    lng: longitude
                  }
                }

                function success(res){
                  console.log(res.data)
                }

                _self.$Get(locUrl, config,success)
            }
          });
          // wx.invoke('openDefaultBrowser', {
          //     'url': "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7666e5cbbd22b505&redirect_uri=http%3a%2f%2fcloud.zgcfo.com%2fapi%2flegwork%2fapiWechatCompanyWqAuthLogin&response_type=code&scope=SCOPE&agentid=1000022&state=STATE#wechat_redirect", // 在默认浏览器打开redirect_uri，并附加code参数；也可以直接指定要打开的url，此时不会附带上code参数。
          //   }, function(res){
          //   if(res.err_msg != "openDefaultBrowser:ok"){
          //       //错误处理
          //     }
          //   });
          });
      }
      this.$Get(url,config, success)
    }
  },
  mounted(){
    this.wx_init()
  }
}
</script>
