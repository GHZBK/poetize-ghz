<template>
  <div>
    <slot name="paper" :content="content"></slot>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

// Props 定义
const props = defineProps({
  /**
   * 要打印的内容
   */
  printerInfo: {
    type: String,
    default: ""
  },
  /**
   * 打印速度（单位：ms）
   */
  duration: {
    type: Number,
    default: 100
  },
  /**
   * 打印延迟（单位：ms）
   */
  delay: {
    type: Number,
    default: 3000
  },
  /**
   * 是否正在工作
   */
  working: {
    type: Boolean,
    default: true
  },
  /**
   * 是否只打印一次
   */
  once: {
    type: Boolean,
    default: false
  }
})

// 响应式状态
const content = ref("")       // 当前显示内容
const cursor = ref(0)         // 当前光标位置
let timer = null              // 定时器
let timeout = null            // 延迟定时器
const print = ref(true)       // 打印方向 true=打印 false=删除

/**
 * 初始化逻辑
 */
onMounted(() => {
  if (props.working) {
    start(work)
  } else {
    content.value = props.printerInfo
  }
})

/**
 * 清理定时器
 */
onBeforeUnmount(() => {
  clearAllTimers()
})

/**
 * 监听 props 变化
 */
watch(() => props.working, toBegin)
watch(() => props.printerInfo, toBegin)
watch(cursor, (val) => {
  content.value = props.printerInfo.slice(0, val)
})

/**
 * 定时启动打印逻辑
 */
function start(workFn) {
  timeout = setTimeout(() => {
    timer = setInterval(() => {
      workFn()
      if (
        cursor.value === 0 ||
        (cursor.value === props.printerInfo.length && !props.once)
      ) {
        clearInterval(timer)
        start(workFn) // 循环打印
      } else if (cursor.value === props.printerInfo.length && props.once) {
        clearInterval(timer) // 打印一次后停止
      }
    }, props.duration)
  }, props.delay)
}

/**
 * 打印逻辑
 */
function work() {
  let cur = cursor.value
  cur += print.value ? 1 : -1

  if (print.value) {
    if (cur > props.printerInfo.length) {
      cur = props.printerInfo.length - 1
      print.value = false // 切换为删除模式
    }
  } else {
    if (cur < 0) {
      cur = 1
      print.value = true // 切换为打印模式
    }
  }

  cursor.value = cur
}

/**
 * 重置打印
 */
function toBegin() {
  clearAllTimers()
  cursor.value = 0
  print.value = true

  if (props.working) {
    start(work)
  } else {
    content.value = props.printerInfo
  }
}

/**
 * 清除所有定时器
 */
function clearAllTimers() {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}
</script>
