<template>
  <div class="myFooter-wrap" v-show="showFooter">
    <div class="myFooter">
      <div class="footer-title">{{ store.webInfo.footer }}</div>
      <div class="icp">本网站由 <a href="https://n5s.cn" target="_blank">GHZBK</a> 强力支持 <a href="http://beian.miit.gov.cn/"
          target="_blank">{{ store.sysConfig.beian }}</a></div>
    </div>
  </div>
</template>

<script setup>
import { useMainStore } from "@/store";

const store = useMainStore()
// Props 定义
defineProps({
  /**
   * 控制是否显示页脚
   * 默认值：true
   */
  showFooter: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.myFooter-wrap {
  user-select: none;
  animation: hideToShow 2s;
}

.myFooter {
  border-radius: 1.5rem 1.5rem 0 0;
  background: var(--gradientBG);
  text-align: center;
  color: var(--white);
  background-size: 300% 300%;
  animation: gradientBG 10s ease infinite;
}

.footer-title {
  padding-top: 10px;
  font-size: 16px;
}

.icp,
.icp a {
  color: var(--maxGreyFont);
  font-size: 13px;
}

.icp {
  padding-top: 10px;
  padding-bottom: 10px;
}

.icp a {
  text-decoration: none;
  transition: all 0.3s;
}

.icp a:hover {
  color: var(--themeBackground);
}
</style>
