import { AjaxGet, AjaxDic, AjaxPost } from '../index'

/**
 * 登录
 * @param {*} config 
 * @param {*} success 
 * @param {*} fail 
 */
function userLogin(config, success, fail){
    let url = 'user/login'
    return new Promise((resolve, reject) => {
        resolve(AjaxPost(url, config, success, fail))
    }).catch((err) => {
        return err
    })
}

/**
 * 获取用户角色
 * @param {*} id 
 * @param {*} config 
 * @param {*} success 
 * @param {*} fail 
 */
function checkUserRoleByUserId(id, config, success, fail){
    let url = 'user/checkUserRoleByUserId?userId=' + id
    return new Promise((resolve, reject) => {
        resolve(AjaxGet(url, config, success, fail))
    }).catch((err) => {
        return err
    })
}

/**
 * 获取外勤状态
 * @param {*} config 
 * @param {*} success 
 * @param {*} fail 
 */
function checkLoginUserlegworkPunchcardStatus(config, success, fail){
    let url = `legwork/apiCheckLoginUserlegworkPunchcardStatus`
    return new Promise((resolve, reject) => {
        resolve(AjaxPost(url, config, success, fail))
    }).catch((err) => {
        return err
    })
}

/**
 * 获取未完成的任务详情
 * @param {*} config 
 * @param {*} success 
 * @param {*} fail 
 */
function queryUnfinishedPunchCard(config, success, fail){
    let url = `legwork/apiQueryUnfinishedPunchCard`
    return new Promise((resolve, reject) => {
        resolve(AjaxPost(url, config, success, fail))
    }).catch((err) => {
        return err
    })
}

export {
    userLogin,
    checkUserRoleByUserId,
    checkLoginUserlegworkPunchcardStatus,
    queryUnfinishedPunchCard
}