<template>
  <div>
    <!-- ✨ 顶部：展示两句诗 -->
    <div class="my-animation-slide-top">
      <twoPoem :isHitokoto="false" />
    </div>

    <!-- ✨ 中间：关于页面和对话框 -->
    <div style="background: var(--background)" class="my-animation-slide-bottom">
      <div class="about-wrap">
        <!-- 🌿 页面标题 -->
        <h1 style="font-size: 40px; font-weight: 500; letter-spacing: 5px;">
          两只毛驴鸣翠柳
        </h1>

        <!-- 📦 对话框容器 -->
        <div class="about-box">
          <h4>与 {{ store.webInfo.webName }} 对话中...</h4>
          <div v-if="sayShow" id="say-container"></div>
        </div>
      </div>

      <!-- 📦 页面底部组件 -->
      <myFooter />
    </div>
  </div>
</template>

<script setup>
// 📦 引入 Vue3 核心API
import { ref, reactive, onMounted, nextTick } from 'vue'
// 📦 引入 Pinia Store
import { useMainStore } from '@/store'
import useCommon from "@/utils/common";

const common = useCommon();
// 📦 动态导入组件
const twoPoem = () => import('@/components/common/twoPoem')
const myFooter = () => import('@/components/common/myFooter')

// 🏪 使用 Pinia Store
const store = useMainStore()

// 🎯 响应式数据定义
const sayShow = ref(false) // 控制对话框是否显示
const sayIndex = ref(0) // 当前对话内容索引

// 📦 对话内容列表
const sayContent = reactive([
  {
    talk: ["Hi, there👋", "这是一个 Vue2 Vue3 与 SpringBoot 结合的产物~"],
    reply: ["然后呢？ 😃", "少废话！ 🙄"]
  },
  {
    talk: [
      "😘",
      "本站平时仅用于交流和学习新知识",
      "如涉及侵权请联系站长删除对应资源，谢谢！！！"
    ],
    reply: ["这个网站有什么用吗？ 😂"]
  },
  {
    talk: [
      "拥有自己的独立网站难道不酷吗🚀",
      "那就摸鱼吧👋",
      "摸鱼大军请在聊天室集合🥝"
    ],
    reply: []
  }
])

// 💬 模拟对话过程
function say() {
  const current = sayContent[sayIndex.value]
  if (!common.isEmpty(current) && !common.isEmpty(current.talk)) {
    current.talk.forEach((value, idx, talkArray) => {
      setTimeout(() => {
        // 💬 添加左侧对话气泡
        const htmlStr = `<div class="say-left my-animation-slide-bottom"><span class="say-item-left">${value}</span></div>`
        const frag = document.createRange().createContextualFragment(htmlStr)
        document.getElementById("say-container").appendChild(frag)

        // 📦 如果是当前 talk 最后一句
        if (talkArray.length === idx + 1) {
          if (!common.isEmpty(current.reply)) {
            setTimeout(() => {
              showReplies(current.reply)
              sayIndex.value += 1 // 进入下一组对话
            }, 500)
          }
        }
      }, idx * 500) // 每句延迟出现
    })
  }
}

function showReplies(replies) {
  const container = document.getElementById("say-container")
  let htmlStr = replies.map(reply =>
    `<span class="say-select">${reply}</span>`
  ).join('')
  htmlStr = `<div class="say-left my-animation-slide-bottom">${htmlStr}</div>`
  const frag = document.createRange().createContextualFragment(htmlStr)
  container.appendChild(frag)

  // 绑定点击事件
  document.querySelectorAll(".say-select").forEach((el, idx) => {
    el.onclick = () => answer(idx, replies[idx])
  })
}


// 📦 处理用户选择
function answer(index, value) {
  // 移除所有 reply 按钮
  document.querySelectorAll(".say-select").forEach(el => el.remove())

  // 添加右侧对话气泡
  const rightHtml = `<div class="say-right my-animation-slide-bottom"><span class="say-item-right">${value}</span></div>`
  const frag = document.createRange().createContextualFragment(rightHtml)
  document.getElementById("say-container").appendChild(frag)

  if (index === 0) {
    setTimeout(() => {
      say()
    }, 500)
  } else {
    const leftHtml = `<div class="say-left my-animation-slide-bottom"><span class="say-item-left">👋 👋 👋</span></div>`
    const frag = document.createRange().createContextualFragment(leftHtml)
    document.getElementById("say-container").appendChild(frag)
  }
}

// 🔥 生命周期：created + mounted 合并
onMounted(() => {
  setTimeout(() => {
    sayShow.value = true // 2秒后显示对话框
    say() // 开始模拟对话
  }, 2000)
})
</script>


<style>
.about-wrap {
  text-align: center;
  width: 95%;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px 80px;
}

.about-box {
  min-height: 450px;
  padding: 5px;
  background-color: var(--maxMaxLightGray);
  border-radius: 10px;
}

.say-item-left {
  padding: 5px 12px;
  border-radius: 1rem;
  color: var(--maxGreyFont);
  background-color: var(--lightGray);
}

.say-item-right {
  padding: 5px 12px;
  border-radius: 1rem;
  color: var(--white);
  background-color: var(--translucent);
}

.say-left {
  display: flex;
  justify-content: left;
  margin: 15px;
}

.say-right {
  display: flex;
  justify-content: right;
  margin: 15px;
}

.say-select {
  cursor: pointer;
  background: var(--black);
  border-radius: 5px;
  padding: 5px 10px;
  margin-right: 12px;
  margin-top: 20px;
  color: var(--white);
  border: 1px solid var(--black);
}

.say-select:hover {
  border: 1px solid var(--themeBackground);
  color: var(--themeBackground);
  box-shadow: 0 0 5px var(--themeBackground);
}
</style>
