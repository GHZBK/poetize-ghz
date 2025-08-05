<template>
    <div>
        <svg :style="style">
            <use :xlink:href="props.href + props.name" :fill="fillname"></use>
        </svg>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, computed } from 'vue';

// 定义组件的props
const props = defineProps({
    href: {
        type: String,
        default: '#icon-'
    },
    name: String,
    fillname: {
        type: String,
        default: ''
    },
    width: {
        type: String,
        default: '16px'
    },
    height: {
        type: String,
        default: '16px'
    },
});

// 创建计算属性来返回正确格式的style对象
const style = computed(() => ({
    width: props.width,
    height: props.height
}));

// 注意使用props.fillname来绑定fill属性
</script>

<style lang='scss' scoped></style>
