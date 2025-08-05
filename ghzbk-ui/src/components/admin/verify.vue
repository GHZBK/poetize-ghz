<template>
  <div class="myCenter verify-container">
    <div class="verify-content">
      <div>
        <el-avatar :size="50" :src="store.webInfo.avatar"></el-avatar>
      </div>
      <div>
        <el-input v-model="account">
          <template slot="prepend">账号</template>
        </el-input>
      </div>
      <div>
        <el-input v-model="password" type="password">
          <template slot="prepend">密码</template>
        </el-input>
      </div>
      <div>
        <proButton :info="'提交'" @click.native="login()" :before="constant.before_color_2"
          :after="constant.after_color_2">
        </proButton>
      </div>
    </div>
  </div>
</template>

<script setup>
// 引入 Vue Composition API
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useStore from "@/store"
import useCommon from "@/utils/common";
import { ElMessage } from 'element-plus'
import constant from "@/utils/constant"
import { login_api } from "@/api/user"
const proButton = () => import("@/components/common/proButton.vue")

// 初始化 Router、Route、Pinia Store 和工具方法
const router = useRouter()
const route = useRoute()
const common = useCommon();
const store = useStore();
;


// 响应式数据
const redirect = ref(route.query.redirect || "/")
const account = ref("")
const password = ref("")

/**
 * 登录方法
 */
const login = async () => {
  // 检查账号和密码是否为空
  if (common.isEmpty(account.value) || common.isEmpty(password.value)) {
    ElMessage.error("请输入账号或密码！")
    return
  }

  // 组装登录请求数据
  const user = {
    account: account.value.trim(),
    password: common.encrypt(password.value.trim()),
    isAdmin: true
  }

  try {
    // 调用接口登录
    const res = await login_api(user, true, false)
    if (!common.isEmpty(res.data)) {
      // 保存 token 和管理员信息
      localStorage.setItem("adminToken", res.data.accessToken)
      store.loadCurrentAdmin(res.data)

      // 清空输入框
      account.value = ""
      password.value = ""

      // 跳转到重定向页面
      router.push({ path: redirect.value })
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}
</script>


<style scoped>
.verify-container {
  height: 100vh;
  background: var(--backgroundPicture) center center / cover repeat;
}

.verify-content {
  background: var(--maxWhiteMask);
  padding: 30px 40px 5px;
  position: relative;
}

.verify-content>div:first-child {
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  top: -25px;
}

.verify-content>div:not(:first-child) {
  margin: 25px 0;
}

.verify-content>div:last-child>div {
  margin: 0 auto;
}
</style>
