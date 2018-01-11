import Vue from 'vue'
import Router from 'vue-router'
import DashboardPage from '@/components/DashboardPage'
import WelcomePage from '@/components/WelcomePage'
import RacePage from '@/components/RacePage'
import LeaderPage from '@/components/LeaderPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: DashboardPage,
      children: [
        {
          path: '',
          name: 'WelcomePage',
          component: WelcomePage
        },
        {
          path: '/racepage',
          name: 'RacePage',
          component: RacePage
        },
        {
          path: 'leaderpage',
          name: 'LeaderPage',
          component: LeaderPage
        }
      ]
    }
  ]
})
