
const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/IndexPage.vue") }],
  },
  {
    path: "/user",
    component: () => import("layouts/ConnectedLayout.vue"),
    children: [
      { path: "", component: () => import("pages/ConnectedPage.vue") },
    ],
  },
  {
    path: '/login',
    component: () => import('src/pages/LoginPage.vue'),
  },
  {
    path: '/register',
    component: () => import('pages/RegisterPage.vue'),
  },
  {
    path: '/reset-password/send-mail',
    component: () => import('../pages/ResetPasswordPages/SendMailPage.vue'),
  },
  {
    path: "/reset-password/users/:id/:token",
    component: () => import("src/pages/ResetPasswordPages/ResetPasswordPage.vue"),
  },
  {
    path: "/news/:id",
    component: () => import("src/pages/NewsShowPage.vue"),
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];
export default routes
