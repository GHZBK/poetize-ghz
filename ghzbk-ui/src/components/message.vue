<template>
  <div>
    <div>
      <el-image style="animation: header-effect 2s" class="background-image" v-once lazy
        :src="store.webInfo.randomCover[Math.floor(Math.random() * store.webInfo.randomCover.length)]" fit="cover">
        <div slot="error" class="image-slot background-image-error"></div>
      </el-image>
      <!-- 输入框 -->
      <div class="message-in" style="text-align: center">
        <h2 class="message-title">树洞</h2>
        <div>
          <input class="message-input" type="text" style="outline: none;width: 70%" placeholder="留下点什么啦~"
            v-model="messageContent" @click="show = true" maxlength="60" />
          <button v-show="show" style="margin-left: 12px;cursor: pointer;width: 20%" @click="submitMessage"
            class="message-input">发射
          </button>
        </div>
      </div>
      <!-- 弹幕 -->
      <div class="barrage-container">
        <vue-baberrage :barrageList="barrageList" :loop="true"></vue-baberrage>
      </div>
    </div>
    <div class="comment-wrap">
      <div class="comment-content">
        <comment :source="constant.source" :type="'message'" :userId="constant.userId"></comment>
      </div>
      <myFooter></myFooter>
    </div>
  </div>
</template>

<script setup>
// 引入 Vue Composition API
import { ref, reactive, onMounted, computed } from 'vue'
import useCommon from "@/utils/common";
import constant from "@/utils/constant"

import useStore from '@/store'

import { saveTreeHole_api } from "@/api/webInfo"


const common = useCommon();
;
const store = useStore();

// 动态导入组件
const comment = defineAsyncComponent(() => import('./comment/comment'))
const myFooter = defineAsyncComponent(() => import('./common/myFooter'))



// 定义响应式数据
const show = ref(false)               // 控制是否显示输入框
const messageContent = ref("")        // 用户输入的树洞内容
const barrageList = reactive([])      // 弹幕列表（树洞消息）

// 背景样式：从 Pinia 的 webInfo 中获取背景图
const background = computed(() => {
  return {
    background: `url(${store.webInfo.backgroundImage}) center center / cover no-repeat`
  }
})





/**
 * 获取树洞数据
 * 从后端接口拉取树洞消息并初始化 barrageList
 */
const getTreeHole = async () => {
  try {
    const res = await get('/webInfo/listTreeHole')
    if (!common.isEmpty(res.data)) {
      res.data.forEach(m => {
        barrageList.push({
          id: m.id,
          avatar: m.avatar,
          msg: m.message,
          time: Math.floor(Math.random() * 5 + 10)
        });
      });
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 提交树洞留言
 */
const submitMessage = async () => {
  if (messageContent.value.trim() === "") {
    ElMessage.warning("你还没写呢~")
    return
  }

  const treeHole = {
    message: messageContent.value.trim()
  }

  // 如果用户已登录且有头像，附加头像
  if (!common.isEmpty(store.currentUser) && !common.isEmpty(store.currentUser.avatar)) {
    treeHole.avatar = store.currentUser.avatar;
  }


  try {
    const res = await saveTreeHole_api(treeHole)
    if (!common.isEmpty(res.data)) {
      barrageList.push({
        id: res.data.id,
        avatar: res.data.avatar,
        msg: res.data.message,
        time: Math.floor(Math.random() * 5 + 10)
      });
    }
  } catch (error) {
    ElMessage.error(error.message)
  }

  // 重置输入框状态
  messageContent.value = ""
  show.value = false
}

// 生命周期：页面挂载后拉取树洞数据
onMounted(() => {
  getTreeHole()
})
</script>

<style scoped>
.message-in {
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  color: var(--white);
  animation: hideToShow 2.5s;
  width: 360px;
  z-index: 10;
}

.message-title {
  user-select: none;
  text-align: center;
}

.message-input {
  border-radius: 1.2rem;
  border: var(--white) 1px solid;
  color: var(--white);
  background: var(--transparent);
  padding: 10px 10px;
}

.message-input::-webkit-input-placeholder {
  color: var(--white);
}

.barrage-container {
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(100% - 50px);
  width: 100%;
  user-select: none;
  overflow: hidden;
}

.comment-wrap {
  background: var(--background);
  position: absolute;
  top: 100vh;
  width: 100%;
}

.comment-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}
</style>
