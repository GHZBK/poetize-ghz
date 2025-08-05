<template>
  <div>
    <myHeader></myHeader>
    <sidebar></sidebar>
    <div class="content-box">
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
// 引入组件src/components/admin\common\myHeader.vue
import myHeader from "@/components/admin/common/myHeader.vue"
import sidebar from "@/components/admin/common/sidebar.vue"

// 引入 Composition API
import { onMounted } from 'vue'
import useStore from "@/store"
import useCommon from "@/utils/common";

const common = useCommon();
const store = useStore();



/**
 * 生命周期钩子 - 组件创建时执行
 * 用于加载全局样式和字体
 */
onMounted(() => {
  const sysConfig = store.sysConfig

  if (!common.isEmpty(sysConfig) && !common.isEmpty(sysConfig['webStaticResourcePrefix'])) {
    const root = document.querySelector(":root")
    const webStaticResourcePrefix = sysConfig['webStaticResourcePrefix']

    root.style.setProperty("--backgroundPicture", `url(${webStaticResourcePrefix}assets/backgroundPicture.png)`)

    const font = new FontFace("DingliezhuHaifont", `url(${webStaticResourcePrefix}assets/fonts/dingliezhuhaifont.ttf)`)
    font.load().then(() => {
      document.fonts.add(font)
    })
  }
})
</script>

<style scoped>
.content-box {
  position: absolute;
  left: 130px;
  right: 0;
  top: 70px;
  bottom: 0;
  transition: left .3s ease-in-out;
}

.content {
  width: auto;
  height: 100%;
  padding: 30px;
  overflow-y: scroll;
}
</style>
