import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld';
import Business from '@/view/business/business';
import Home from '@/view/home/home';
import Login from '@/view/login/Login';
import planMain from '@/view/business/planMain';

Vue.use(Router)

const router = new Router({
//export default new Router({
    routes: [{
        path: '/',
        redirect: '/login'
    }, {
        path: '/business',
        name: 'Business',
        component: Business
    }, {
        path: '/home',
        name: 'Home',
        component: Home
    }, {
        path: '/login',
        name: 'Login',
        component: Login
        }, {
            path: '/planMain',
            name: 'planMain',
            component:planMain
        },{
            path:'/planDetail',
            name:'planDetail',
            component:()=>import('@/view/business/planDetail')
        }]
});

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
      next();
    } else {
      let token = localStorage.getItem('Authorization');
   
      if (token === 'null' || token === '') {
        next('/login');
      } else {
        next();
      }
    }
  });
   
  export default router;
