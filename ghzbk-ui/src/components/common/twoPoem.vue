<template>
  <div class="poem-container myCenter my-animation-hideToShow"
    v-if="!common.isEmpty(guShi.origin) || !common.isEmpty(hitokoto.hitokoto)">
    <!-- 背景图片 -->
    <el-image class="my-el-image poem-image" style="position: absolute;margin-top: -50px" v-once lazy
      :src="store.webInfo.randomCover[Math.floor(Math.random() * store.webInfo.randomCover.length)]" fit="cover">
      <div slot="error" class="image-slot"></div>
    </el-image>
    <div class="poem-wrap">
      <div v-if="isShehui"><span>鬼畜全明星</span></div>
      <div v-else><span>{{ isHitokoto ? hitokoto.from : guShi.origin }}</span></div>
      <p class="poem">{{ isHitokoto ? hitokoto.hitokoto : guShi.content }}</p>
      <p class="info" v-if="!isShehui && (!isHitokoto || (isHitokoto && !common.isEmpty(hitokoto.from_who)))">
        {{ isHitokoto ? hitokoto.from_who : guShi.author }}
      </p>
    </div>
  </div>
</template>
<script setup>
// 引入 Vue Composition API
import { ref, onMounted } from 'vue'
import useCommon from '@/utils/common'
import useStore from "@/store"
import constant from "@/utils/constant"
import { getShehui_api, getGuShi_api, getHitokoto_api } from "@/api/back"

  ;
const common = useCommon()
const store = useStore()

// Props 定义
const props = defineProps({
  isHitokoto: {
    type: Boolean,
    default: true
  },
  isShehui: {
    type: Boolean,
    default: false
  }
})



// 响应式数据
const guShi = ref({
  content: "...",
  origin: "...",
  author: "...",
  category: "..."
})
const hitokoto = ref({
  hitokoto: "...",
  from: "...",
  from_who: "..."
})

/**
 * 请求社会语录 API
 */
const sendShehui = async () => {
  try {
    const res = await getShehui_api()
    if (res && res.data) {
      hitokoto.value.hitokoto = res.data.substring(1, res.data.length - 1)
    }
  } catch (error) {
    console.error('获取社会新闻失败:', error)
  }
}

/**
 * 请求今日诗词 API
 */
const getGuShi = async () => {
  try {
    const res = await getGuShi_api()
    if (res && res.data) {
      guShi.value = res.data // Vue3 用 ref/响应式
    }
  } catch (error) {
    console.error('获取古诗失败:', error)
  }
}

/**
 * 请求一言 API
 */
const getHitokoto = async () => {
  try {
    const res = await getHitokoto_api()
    if (res && res.data) {
      hitokoto.value = res.data // Vue3: hitokoto 是 ref()
    }
  } catch (error) {
    console.error('获取一言失败:', error)
  }
}

// 生命周期：组件创建时加载数据
onMounted(() => {
  if (!props.isShehui) {
    if (props.isHitokoto) {
      getHitokoto()
    } else {
      getGuShi()
    }
  } else {
    hitokoto.value.from = "";
    hitokoto.value.from_who = "";
    sendShehui()
  }
})
</script>

<style scoped>
.poem-container {
  padding: 90px 0 40px;
  position: relative;
}

.poem-wrap {
  border-radius: 10px;
  z-index: 10;
  text-align: center;
  letter-spacing: 4px;
  font-weight: 300;
  width: 100%;
  max-width: 800px;
}

.poem-wrap div span {
  padding: 5px 10px;
  color: var(--white);
  font-size: 2em;
  border-radius: 5px;
}

.poem-wrap p {
  width: 100%;
  max-width: 800px;
  color: var(--white);
}

.poem-wrap p.poem {
  margin: 40px auto;
  font-size: 1.5em;
}

.poem-wrap p.info {
  margin: 20px auto 40px;
  font-size: 1.1em;
}
</style>
