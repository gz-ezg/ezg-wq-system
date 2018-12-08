import Vue from 'vue'
import Router from 'vue-router'

const marketIndex = () => import(/* webpackChunkName: "market" */ '@/components/market/index')
const marketLeave = () => import(/* webpackChunkName: "market" */ '@/components/market/leave')

const commericalIndex = () => import(/* webpackChunkName: "commercial" */ '@/components/commerical/index')
const commericalLeave = () => import(/* webpackChunkName: "commercial" */ '@/components/commerical/leave')

const accountIndex = () => import(/* webpackChunkName: "account" */ '@/components/account/index')
const accountLeave = () => import(/* webpackChunkName: "account" */ '@/components/account/leave')
const accountComfirm = () => import(/* webpackChunkName: "account" */ '@/components/account/comfirm')
const comfirmsuccess = () => import(/* webpackChunkName: "account" */ '@/components/common/success_comfirm')

const planIndex = () => import(/* webpackChunkName: "plan" */ '@/components/plan/index')
const planLeave = () => import(/* webpackChunkName: "plan" */ '@/components/plan/leave')

const otherIndex = () => import(/* webpackChunkName: "other" */ '@/components/other/index')
const otherLeave = () => import(/* webpackChunkName: "other" */ '@/components/other/leave')

import Login from  '@/components/login/login'
import Index from  '@/components/login/index'
import Success from '@/components/common/field_success'

// import Test from '@/components/test/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
		  redirect: 'Login'
  },
  // {
  //   path: '/test',
  //   name: 'Test',
  //   component: Test
  // },
  //  登录首页
  //  登录后跳转页
  {
    path: "/index",
    name: 'Index',
    component: Index
  },
	{
		path: '/login',
		name: 'Login',
		component: Login
	},
  //  市场部部分
  {
		path:'/marketIndex',
		name:'marketIndex',
		component: marketIndex
	},
	{
		path:'/marketLeave',
		name:'marketLeave',
		component: marketLeave
	},
  //  商事部部分
  {
		path:'/commericalIndex',
		name:'commericalIndex',
		component: commericalIndex
	},
	{
		path:'/commericalLeave',
		name:'commericalLeave',
		component: commericalLeave
  },
  //  会计部门
  {
    path:'/accountIndex',
    name:'accountIndex',
    component:accountIndex
  },
  {
    path:'/accountLeave',
    name:'accountLeave',
    component:accountLeave
  },
  {
    path:'/accountComfirm',
    name:'accountComfirm',
    component:accountComfirm
  },
  {
    path:'/comfirmsuccess',
    name:'comfirmsuccess',
    component:comfirmsuccess
  },
  //  企划部门
  {
    path:'/planIndex',
    name:'planIndex',
    component:planIndex
  },
  {
    path:'/planLeave',
    name:'planLeave',
    component:planLeave
  },
  //  其他部门
  {
    path:'/otherIndex',
    name:'otherIndex',
    component:otherIndex
  },
  {
    path:'/otherLeave',
    name:'otherLeave',
    component:otherLeave
  },
  //  结束打卡
	{
		path:'/Success',
		name:'Success',
		component: Success
	}
  ]
})
