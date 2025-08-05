<template>
  <div>
    <div class="travel-container">
      <!-- 封面 -->
      <div class="travel-header my-animation-slide-top">
        <!-- 背景图片 -->
        <video class="index-video" autoplay="autoplay" muted="muted" loop="loop"
          :src="store.sysConfig['webStaticResourcePrefix'] + 'assets/backgroundVideo.mp4'">
        </video>
        <div style="position: absolute;left: 20px;top: 20px">
          <!-- 标题 -->
          <div style="margin: 10px">
            <div>
              旅拍集
            </div>
            <div style="font-size: 36px;font-weight: bold;line-height: 1.5;margin-top: 20px">
              这里是我的旅拍哦
            </div>
          </div>
        </div>
        <div style="position: absolute;left: 20px;bottom: 40px;margin: 10px">
          每一张照片都是一次美好的记忆。
        </div>
      </div>

      <div class="travel-content my-animation-slide-bottom">
        <!-- 标签 -->
        <div class="photo-title-warp" v-if="!common.isEmpty(photoTitleList)">
          <div v-for="(item, index) in photoTitleList" :key="index"
            :class="{ isActive: photoPagination.classify === item.classify }" @click="changePhotoTitle(item.classify)">
            <proTag :info="item.classify + ' ' + item.count"
              :color="constant.before_color_list[Math.floor(Math.random() * 6)]" style="margin: 12px">
            </proTag>
          </div>
        </div>

        <div class="photo-title">
          {{ photoPagination.classify }}
        </div>

        <photo :resourcePathList="photoList"></photo>
        <div class="pagination-wrap">
          <div @click="pagePhotos()" class="pagination" v-if="photoPagination.total !== photoList.length">
            下一页
          </div>
          <div v-else style="user-select: none">
            ~~到底啦~~
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <div style="background: var(--favoriteBg)">
      <myFooter></myFooter>
    </div>
  </div>
</template>

<script setup>
// 引入 Vue Composition API
import { ref, reactive, onMounted } from 'vue'

import useCommon from "@/utils/common";
import constant from "@/utils/constant"

  ;
const common = useCommon();

// 动态导入子组件
const myFooter = defineAsyncComponent(() => import('@/components/common/myFooter'))
const photo = defineAsyncComponent(() => import('@/components/common/photo'))
const proTag = defineAsyncComponent(() => import('@/components/common/proTag'))



// 响应式数据（等价于 Vue 2 的 data）
const photoPagination = reactive({
  current: 1,
  size: 10,
  total: 0,
  resourceType: "lovePhoto",
  classify: ""          // 当前分类
})
const photoTitleList = ref([]) // 照片分类标题列表
const photoList = ref([])      // 照片列表

/**
 * 获取所有照片分类标题
 * 调用后端接口获取列表
 */
const getPhotoTitles = async () => {
  try {
    const res = await getListAdminLovePhoto_api()
    if (!common.isEmpty(res.data)) {
      photoTitleList.value = res.data
      // 初始化分页信息为第一个分类
      Object.assign(photoPagination, {
        current: 1,
        size: 10,
        total: 0,
        resourceType: "lovePhoto",
        classify: photoTitleList.value[0].classify
      })
      // 加载第一批照片
      changePhoto()
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 切换照片分类
 * @param {string} classify 新的分类名
 */
const changePhotoTitle = (classify) => {
  if (classify !== photoPagination.classify) {
    Object.assign(photoPagination, {
      current: 1,
      size: 10,
      total: 0,
      resourceType: "lovePhoto",
      classify
    })
    photoList.value = [] // 清空当前照片列表
    changePhoto()
  }
}

/**
 * 分页加载更多照片
 */
const pagePhotos = () => {
  photoPagination.current += 1
  changePhoto()
}

/**
 * 获取照片列表
 * 调用后端接口按分页加载数据
 */
const changePhoto = async () => {
  try {
    const res = await listResourcePath_api(photoPagination)
    if (!common.isEmpty(res.data)) {
      photoList.value.push(...res.data.records)
      photoPagination.total = res.data.total
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

// 生命周期：组件挂载时加载照片分类和照片
onMounted(() => {
  getPhotoTitles()
})
</script>

<style scoped>
.travel-container {
  padding: 25px;
  background: var(--favoriteBg);
}

.travel-header {
  margin: 60px auto 30px;
  height: 300px;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  max-width: 1200px;
  color: var(--white);
  user-select: none;
}

.index-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: var(--lightGreen);
}

.travel-content {
  margin: 0 auto;
  max-width: 1200px;
}

.photo-title-warp {
  max-width: 1150px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
}

.isActive {
  animation: scale 2.5s ease-in-out infinite;
}

.photo-title {
  text-align: center;
  font-size: 30px;
  font-weight: 700;
  line-height: 80px;
  letter-spacing: 2px;
}

.pagination-wrap {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.pagination {
  padding: 13px 15px;
  border: 1px solid var(--lightGray);
  border-radius: 3rem;
  color: var(--greyFont);
  width: 100px;
  user-select: none;
  cursor: pointer;
  text-align: center;
}

@media screen and (max-width: 1150px) {
  .photo-title-warp {
    max-width: 780px;
  }
}
</style>
