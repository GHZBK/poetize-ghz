<template>
  <div>
    <!-- 加载动画 -->
    <transition name="loader">
      <div v-show="loaderVisible">
        <slot name="loader"></slot>
      </div>
    </transition>
    <!-- 内容 -->
    <transition name="body">
      <div v-show="bodyVisible">
        <slot name="body"></slot>
      </div>
    </transition>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue' // 必须引入 setup API

// 定义 props
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

// 定义响应式数据
const loaderVisible = ref(props.loading); // 是否显示加载动画
const bodyVisible = ref(!props.loading);  // 是否显示主体内容

// 监听 loading 的变化
watch(
  () => props.loading,
  (loading) => {
    loaderVisible.value = loading; // 更新 loader 可见性
    // 延迟 300ms 切换 body 可见性
    setTimeout(() => {
      bodyVisible.value = !loading;
    }, 300);
  }
);
</script>

<style scoped>
/*
    v-enter：定义进入过渡的开始状态
    v-enter-active：定义进入过渡生效时的状态
    v-enter-to：2.1.8 版及以上定义进入过渡的结束状态
    v-leave：定义离开过渡的开始状态
    v-leave-active：定义离开过渡生效时的状态
    v-leave-to：2.1.8 版及以上定义离开过渡的结束状态
  */

.loader-enter-active,
.loader-leave-active,
.body-enter-active,
.body-leave-active {
  transition: all 0.5s;
}

.loader-enter,
.loader-leave-to {
  opacity: 0;
}

.body-enter,
.body-leave-to {
  opacity: 0;
  transform: scale(0.5) translateY(50%);
}
</style>
