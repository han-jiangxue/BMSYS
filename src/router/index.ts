import { type RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from "vue-router"

const Layout = () => import("@/layout/index.vue")

/** 常驻路由 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layout,
    meta: {
      // 默认 false，设置 true 的时候该路由不会在侧边栏出现
      hidden: true
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue")
      }
    ]
  },
  {
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/register",
    component: () => import("@/views/login/register.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard",
        meta: {
          title: "首页",
          elIcon: "House",
          affix: true
        }
      }
    ]
  }
  // {
  //   path: "/link",
  //   component: Layout,
  //   children: [
  //     {
  //       path: "https://xyt-wx.cumt.edu.cn/admin-home",
  //       component: () => {},
  //       name: "Link",
  //       meta: {
  //         title: "外链",
  //         svgIcon: "link"
  //       }
  //     }
  //   ]
  // }
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const asyncRoutes: RouteRecordRaw[] = [
  // user权限
  {
    path: "/add-info",
    component: Layout,
    redirect: "/add-info/index",
    meta: {
      roles: ["user"]
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/user/add-info/index.vue"),
        name: "add-info",
        meta: {
          title: "信息填写",
          roles: ["user"],
          elIcon: "EditPen"
        }
      }
    ]
  },
  {
    path: "/submit-info",
    component: Layout,
    redirect: "/submit-info/index",
    meta: {
      roles: ["user"]
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/user/submit-info/index.vue"),
        name: "submit-info",
        meta: {
          title: "上传填写",
          roles: ["user"],
          elIcon: "Upload"
        }
      }
    ]
  },
  {
    path: "/exam-confirm",
    component: Layout,
    redirect: "/exam-confirm/index",
    meta: {
      roles: ["user"]
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/user/exam-confirm/index.vue"),
        name: "exam-confirm",
        meta: {
          title: "考试确认",
          roles: ["user"],
          elIcon: "FolderChecked"
        }
      }
    ]
  },
  {
    path: "/result-search",
    component: Layout,
    redirect: "/result-search/index",
    meta: {
      roles: ["user"]
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/user/result-search/index.vue"),
        name: "result-search",
        meta: {
          title: "结果查询",
          roles: ["user"],
          elIcon: "Search"
        }
      }
    ]
  },
  // admin权限
  {
    path: "/notice-management",
    component: Layout,
    redirect: "/notice-management/index",
    meta: {
      roles: ["admin", "super"]
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/admin/notice-management/index.vue"),
        name: "notice-management",
        meta: {
          title: "公告管理",
          roles: ["admin", "super"],
          elIcon: "BellFilled"
        }
      }
    ]
  },
  {
    path: "/add-management",
    component: Layout,
    redirect: "/add-management/index",
    meta: {
      roles: ["admin", "super"]
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/admin/add-management/index.vue"),
        name: "add-management",
        meta: {
          title: "填报管理",
          roles: ["admin", "super"],
          elIcon: "EditPen"
        }
      }
    ]
  },
  {
    path: "/exam-management",
    component: Layout,
    redirect: "/exam-management/index",
    meta: {
      roles: ["admin", "super"]
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/admin/exam-management/index.vue"),
        name: "exam-management",
        meta: {
          title: "考试管理",
          roles: ["admin", "super"],
          elIcon: "Document"
        }
      }
    ]
  },
  {
    path: "/score-management",
    component: Layout,
    redirect: "/score-management/index",
    meta: {
      roles: ["admin", "super"]
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/admin/score-management/index.vue"),
        name: "score-management",
        meta: {
          title: "成绩管理",
          roles: ["admin", "super"],
          elIcon: "Edit"
        }
      }
    ]
  },
  {
    path: "/user-management",
    component: Layout,
    redirect: "/user-management/index",
    meta: {
      roles: ["admin", "super"]
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/admin/user-management/index.vue"),
        name: "user-management",
        meta: {
          title: "人员管理",
          roles: ["admin", "super"],
          elIcon: "User"
        }
      }
    ]
  },
  {
    path: "/permission",
    component: Layout,
    redirect: "/permission/page",
    name: "Permission",
    meta: {
      title: "权限管理",
      svgIcon: "lock",
      roles: ["admin", "super"], // 可以在根路由中设置角色
      alwaysShow: true // 将始终显示根菜单
    },
    children: [
      {
        path: "page",
        component: () => import("@/views/permission/page.vue"),
        name: "PagePermission",
        meta: {
          title: "页面权限",
          roles: ["admin"] // 或者在子导航中设置角色
        }
      },
      {
        path: "directive",
        component: () => import("@/views/permission/directive.vue"),
        name: "DirectivePermission",
        meta: {
          title: "指令权限" // 如果未设置角色，则表示：该页面不需要权限，但会继承根路由的角色
        }
      }
    ]
  },
  {
    path: "/hook-demo",
    component: Layout,
    redirect: "/hook-demo/use-fetch-select",
    name: "HookDemo",
    meta: {
      title: "hook 示例",
      elIcon: "Menu",
      roles: ["admin", "super", "user"],
      alwaysShow: true
    },
    children: [
      {
        path: "use-fetch-select",
        component: () => import("@/views/hook-demo/use-fetch-select.vue"),
        name: "UseFetchSelect",
        meta: {
          title: "useFetchSelect"
        }
      },
      {
        path: "use-fullscreen-loading",
        component: () => import("@/views/hook-demo/use-fullscreen-loading.vue"),
        name: "UseFullscreenLoading",
        meta: {
          title: "useFullscreenLoading"
        }
      }
    ]
  },
  {
    path: "/table",
    component: Layout,
    redirect: "/table/element-plus",
    name: "Table",
    meta: {
      title: "表格",
      roles: ["admin", "super", "user"],
      elIcon: "Grid"
    },
    children: [
      {
        path: "element-plus",
        component: () => import("@/views/table/element-plus/index.vue"),
        name: "ElementPlus",
        meta: {
          title: "Element Plus",
          keepAlive: true
        }
      },
      {
        path: "vxe-table",
        component: () => import("@/views/table/vxe-table/index.vue"),
        name: "VxeTable",
        meta: {
          title: "Vxe Table",
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/menu",
    component: Layout,
    redirect: "/menu/menu1",
    name: "Menu",
    meta: {
      title: "多级菜单",
      roles: ["admin", "super", "user"],
      svgIcon: "menu"
    },
    children: [
      {
        path: "menu1",
        component: () => import("@/views/menu/menu1/index.vue"),
        redirect: "/menu/menu1/menu1-1",
        name: "Menu1",
        meta: {
          title: "menu1"
        },
        children: [
          {
            path: "menu1-1",
            component: () => import("@/views/menu/menu1/menu1-1/index.vue"),
            name: "Menu1-1",
            meta: {
              title: "menu1-1"
            }
          },
          {
            path: "menu1-2",
            component: () => import("@/views/menu/menu1/menu1-2/index.vue"),
            redirect: "/menu/menu1/menu1-2/menu1-2-1",
            name: "Menu1-2",
            meta: {
              title: "menu1-2"
            },
            children: [
              {
                path: "menu1-2-1",
                component: () => import("@/views/menu/menu1/menu1-2/menu1-2-1/index.vue"),
                name: "Menu1-2-1",
                meta: {
                  title: "menu1-2-1"
                }
              },
              {
                path: "menu1-2-2",
                component: () => import("@/views/menu/menu1/menu1-2/menu1-2-2/index.vue"),
                name: "Menu1-2-2",
                meta: {
                  title: "menu1-2-2"
                }
              }
            ]
          },
          {
            path: "menu1-3",
            component: () => import("@/views/menu/menu1/menu1-3/index.vue"),
            name: "Menu1-3",
            meta: {
              title: "menu1-3"
            }
          }
        ]
      },
      {
        path: "menu2",
        component: () => import("@/views/menu/menu2/index.vue"),
        name: "Menu2",
        meta: {
          title: "menu2"
        }
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*", // Must put the 'ErrorPage' route at the end, 必须将 'ErrorPage' 路由放在最后
    redirect: "/404",
    name: "ErrorPage",
    meta: {
      hidden: true
    }
  }
]

const router = createRouter({
  history:
    import.meta.env.VITE_ROUTER_HISTORY === "hash"
      ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH)
      : createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
