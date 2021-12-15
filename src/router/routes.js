
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/PlanningPage.vue') },
      { path: 'test', component: () => import('pages/Test.vue') },
      { path: 'meals', component: () => import('pages/Meals.vue') },
      { path: 'categories', component: () => import('pages/Categories.vue') },
      { path: 'meal-types', component: () => import('pages/MealTypes.vue') },
      { path: 'timetables', component: () => import('pages/MealHours.vue') },
    ]
  },



  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
