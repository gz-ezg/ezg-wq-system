export function wx_get_img(show_img, img_array){
  let _self = this
    wx.chooseImage({
    count: 1, // 默认9
    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
    defaultCameraMode: "normal", //表示进入拍照界面的默认模式，目前有normal与batch两种选择，normal表示普通单拍模式，batch表示连拍模式，不传该参数则为normal模式。（注：用户进入拍照界面仍然可自由切换两种模式）
    success: function (res) {
      // console.log(res)
        var localIds = res.localIds; // 返回选定照片的本地ID列表，
          // andriod中localId可以作为img标签的src属性显示图片；
          // 而在IOS中需通过上面的接口getLocalImgData获取图片base64数据，从而用于img标签的显示
        wx.getLocalImgData({
          localId: localIds[0], // 图片的localID
          success: function (res) {
            var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
            show_img.push(res.localData)
            img_array.push(base64ToBlob(res.localData))
          }
        });
      }
  })
}

function base64ToBlob(urlData) {
  let arr = urlData.split(',');
  let mime = arr[0].match(/:(.*?);/)[1]
  // 去掉url的头，并转化为byte
  let bytes = window.atob(arr[1]);
  // 处理异常,将ascii码小于0的转换为大于0
  let ab = new ArrayBuffer(bytes.length);
  // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
  let ia = new Uint8Array(ab);
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
    }
  return new Blob([ab], {
    type: mime
  });
}

//  待定使用
