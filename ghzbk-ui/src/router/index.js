import { createRouter, createWebHistory } from "vue-router";

// 路由规则
const routes = [
  {
    path: "/",
    component: () => import("../components/home.vue"),
    children: [
      {
        path: "",
        name: "index",
        component: () => import("../components/index.vue"),
      },
      {
        path: "sort",
        name: "sort",
        component: () => import("../components/sort.vue"),
      },
      {
        path: "article/:id",
        name: "article",
        component: () => import("../components/article.vue"),
      },
      {
        path: "weiYan",
        name: "weiYan",
        component: () => import("../components/weiYan.vue"),
      },
      {
        path: "love",
        name: "love",
        component: () => import("../components/love.vue"),
      },
      {
        path: "favorite",
        name: "favorite",
        component: () => import("../components/favorite.vue"),
      },
      {
        path: "travel",
        name: "travel",
        component: () => import("../components/travel.vue"),
      },
      {
        path: "message",
        name: "message",
        component: () => import("../components/message.vue"),
      },
      {
        path: "about",
        name: "about",
        component: () => import("../components/about.vue"),
      },
      {
        path: "user",
        name: "user",
        component: () => import("../components/user.vue"),
      },
      {
        path: "letter",
        name: "letter",
        component: () => import("../components/letter.vue"),
      },
    ],
  },
  {
    path: "/admin",
    redirect: "/welcome",
    meta: { requiresAuth: true },
    component: () => import("../components/admin/admin.vue"),
    children: [
      {
        path: "/welcome",
        name: "welcome",
        component: () => import("../components/admin/welcome.vue"),
      },
      {
        path: "/main",
        name: "main",
        component: () => import("../components/admin/main.vue"),
      },
      {
        path: "/webEdit",
        name: "webEdit",
        component: () => import("../components/admin/webEdit.vue"),
      },
      {
        path: "/userList",
        name: "userList",
        component: () => import("../components/admin/userList.vue"),
      },
      {
        path: "/postList",
        name: "postList",
        component: () => import("../components/admin/postList.vue"),
      },
      {
        path: "/postEdit",
        name: "postEdit",
        component: () => import("../components/admin/postEdit.vue"),
      },
      {
        path: "/sortList",
        name: "sortList",
        component: () => import("../components/admin/sortList.vue"),
      },
      {
        path: "/configList",
        name: "configList",
        component: () => import("../components/admin/configList.vue"),
      },
      {
        path: "/commentList",
        name: "commentList",
        component: () => import("../components/admin/commentList.vue"),
      },
      {
        path: "/treeHoleList",
        name: "treeHoleList",
        component: () => import("../components/admin/treeHoleList.vue"),
      },
      {
        path: "/resourceList",
        name: "resourceList",
        component: () => import("../components/admin/resourceList.vue"),
      },
      {
        path: "/loveList",
        name: "loveList",
        component: () => import("../components/admin/loveList.vue"),
      },
      {
        path: "/resourcePathList",
        name: "resourcePathList",
        component: () => import("../components/admin/resourcePathList.vue"),
      },
    ],
  },
  {
    path: "/verify",
    name: "verify",
    component: () => import("../components/admin/verify.vue"),
  },
];

// 创建 router 实例
const router = createRouter({
  history: createWebHistory(), // Vue3 使用 createWebHistory 替代 mode: 'history'
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!Boolean(localStorage.getItem("adminToken"))) {
      next({
        path: "/verify",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
