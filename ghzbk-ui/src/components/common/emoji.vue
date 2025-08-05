<template>
  <div>
    <transition name="body">
      <div v-show="showEmoji">
        <span class="emoji-item" v-for="(value, key) in emojiListURL" :key="key" @click="addEmoji(key)">
          <img loading="lazy" class="emoji" :src="value" :title="key" width="24px" height="24px" />
        </span>
      </div>
    </transition>
  </div>
</template>

<script setup>
// 引入依赖
import { ref, computed } from 'vue'
import useStore from '@/store'
import useCommon from '@/utils/common'
import useConstant from '@/utils/constant'

const common = useCommon()
const store = useStore()
  ;

// Props
defineProps({
  /**
   * 控制是否显示 Emoji 面板
   */
  showEmoji: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['addEmoji'])

// Emoji 数据
const emojiList = ref(constant.emojiList)

/**
 * 根据 emoji 名称生成 URL 映射
 */
const getEmojiList = (list) => {
  const result = {}
  const baseURL = store.sysConfig.webStaticResourcePrefix + 'emoji/'
  list.forEach((name, index) => {
    const emojiName = `[${name}]`
    result[emojiName] = `${baseURL}q${index + 1}.gif`
  })
  return result
}

// Emoji URL 列表（computed：自动响应 store 变化）
const emojiListURL = computed(() => getEmojiList(emojiList.value))

/**
 * 选择 Emoji 并触发事件
 */
const addEmoji = (key) => {
  emit('addEmoji', key)
}
</script>


<style scoped>
.emoji-item {
  cursor: pointer;
  display: inline-block;
}

.emoji-item:hover {
  transition: all 0.2s;
  border-radius: 0.25rem;
  background: var(--lightGray);
}

.emoji {
  margin: 0.25rem;
  /* 把此元素放置在父元素的中部 */
  vertical-align: middle;
}

.body-enter-active,
.body-leave-active {
  transition: all 0.3s;
}

.body-enter,
.body-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>
