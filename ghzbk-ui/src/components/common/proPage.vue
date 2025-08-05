<template>
  <div v-if="total > size" class="myCenter">
    <ul class="page-content">
      <li class="page-item" v-if="current !== 1" @click="toPage(-1)">👈</li>

      <template v-if="current === 1">
        <li class="page-item" v-for="index of realButtonSize" :key="index" :style="getButtonStyle(index === 1)"
          @click="toPage(index)">
          {{ index }}
        </li>
      </template>

      <template v-else-if="current === totalSize">
        <li class="page-item" v-for="index of realButtonSize" :key="index"
          :style="getButtonStyle(index === realButtonSize)" @click="toPage(current - (realButtonSize - index))">
          {{ current - (realButtonSize - index) }}
        </li>
      </template>

      <template v-else>
        <li class="page-item" v-for="index of realButtonSize" :key="index"
          :style="getButtonStyle(Math.ceil(realButtonSize / 2) === index)"
          @click="toPage(current - (Math.ceil(realButtonSize / 2) - index))">
          {{ current - (Math.ceil(realButtonSize / 2) - index) }}
        </li>
      </template>

      <li class="page-item" v-if="current !== totalSize" @click="toPage(-2)">👉</li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  current: { type: Number, default: 1 },
  size: { type: Number, default: 10 },
  total: { type: Number, default: 0 },
  buttonSize: { type: Number, default: 3 },
  color: { type: String, default: '' }
})

// Emits
const emit = defineEmits(['toPage'])

// 计算总页数和按钮数量
const totalSize = computed(() => Math.ceil(props.total / props.size))
const realButtonSize = computed(() =>
  props.buttonSize < totalSize.value ? props.buttonSize : totalSize.value
)

// 翻页
const toPage = (flag) => {
  const page = flag === -1 ? props.current - 1 : flag === -2 ? props.current + 1 : flag
  emit('toPage', page)
}

// 按钮样式
const getButtonStyle = (isActive) => ({
  background: isActive ? props.color : '',
  color: isActive ? 'var(--white)' : ''
})
</script>


<style scoped>
.page-content {
  display: flex;
  padding: 0;
  margin: 15px 0;
}

.page-item {
  margin: 0 10px;
  list-style: none;
  border: 1px solid var(--lightGray);
  width: 40px;
  height: 40px;
  line-height: 38px;
  text-align: center;
  border-radius: 50%;
  color: var(--black);
  font-size: 14px;
  cursor: pointer;
}

.page-item:hover {
  border: 1px solid var(--themeBackground);
  box-shadow: 0 0 5px var(--themeBackground);
}
</style>
