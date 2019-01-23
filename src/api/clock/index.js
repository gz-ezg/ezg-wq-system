import { AjaxGet, AjaxDic, AjaxPost } from '../index'

/**
 * 登录
 * @param {*} config
 * @param {*} success
 * @param {*} fail
 */
function saveLegworkVisitMsg(config){
    let url = 'zuul/legwork/apiSaveLegworkVisitMsg'
    return new Promise((resolve, reject) => {
        resolve(AjaxPost(url,config))
    }).catch((err) => {
        return err
    })
}

function saveLegworkLeaveVisitMsg(config){
  let url = 'zuul/legwork/apiSaveLegworkLeaveVisitMsg'
  return new Promise((resolve, reject) => {
      resolve(AjaxPost(url,config))
  }).catch((err) => {
      return err
  })
}

function queryUnfinishedPunchCard(){
  let url = `legwork/apiQueryUnfinishedPunchCard`
  return new Promise((resolve, reject) => {
      resolve(AjaxPost(url))
  }).catch((err) => {
      return err
  })
}

export {
  saveLegworkVisitMsg,
  saveLegworkLeaveVisitMsg,
  queryUnfinishedPunchCard
}
