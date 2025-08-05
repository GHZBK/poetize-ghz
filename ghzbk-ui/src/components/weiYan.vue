<template>
  <div>
    <!-- 两句诗 -->
    <div class="my-animation-slide-top">
      <twoPoem :isHitokoto="false"></twoPoem>
    </div>

    <div style="background: var(--background);animation: hideToShow 2.5s">
      <div>
        <treeHole :treeHoleList="treeHoleList"
          :avatar="!common.isEmpty(store.currentUser) ? store.currentUser.avatar : store.webInfo.avatar"
          @launch="launch" @deleteTreeHole="deleteTreeHole">
        </treeHole>
        <proPage :current="pagination.current" :size="pagination.size" :total="pagination.total" :buttonSize="3"
          :color="constant.pageColor" @toPage="toPage">
        </proPage>
      </div>

      <!-- 页脚 -->
      <myFooter :showFooter="showFooter"></myFooter>
    </div>

    <el-dialog title="微言" :visible.sync="weiYanDialogVisible" width="40%" :before-close="handleClose"
      :append-to-body="true" destroy-on-close :close-on-click-modal="false" center>
      <div>
        <div class="myCenter" style="padding-bottom: 20px">
          <el-radio-group v-model="isPublic">
            <el-radio-button :label="true">公开</el-radio-button>
            <el-radio-button :label="false">私密</el-radio-button>
          </el-radio-group>
        </div>
        <commentBox :disableGraffiti="true" @submitComment="submitWeiYan">
        </commentBox>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
// 引入 Vue Composition API
import { ref, reactive, onMounted, nextTick } from 'vue'

import useCommon from "@/utils/common";
import { deleteWeiYan_api, listWeiYan_api, saveWeiYan_api } from "@/api/weiYan"
import constant from "@/utils/constant"
import useStore from "@/store"
  ;
const common = useCommon();
const store = useStore();


// 动态导入组件
const twoPoem = defineAsyncComponent(() => import('@/components/common/twoPoem'))
const myFooter = defineAsyncComponent(() => import('@/components/common/myFooter'))
const treeHole = defineAsyncComponent(() => import('@/components/common/treeHole'))
const proPage = defineAsyncComponent(() => import('@/components/common/proPage'))
const commentBox = defineAsyncComponent(() => import('@/components/comment/commentBox'))



// 响应式数据（等价于 Vue 2 的 data）
const treeHoleList = ref([])           // 树洞列表
const pagination = reactive({          // 分页信息
  current: 1,
  size: 10,
  total: 0
})
const weiYanDialogVisible = ref(false) // 控制评论框显示
const isPublic = ref(true)             // 是否公开微言
const showFooter = ref(false)          // 控制底部显示

/**
 * 获取微言数据列表
 * 调用后端接口加载树洞内容
 */
const getWeiYan = async () => {
  try {
    const res = await listWeiYan_api(pagination)
    showFooter.value = false // 先隐藏 footer，加载后再显示
    if (!common.isEmpty(res.data)) {
      // 格式化内容（换行、表情、图片处理）
      res.data.records.forEach(c => {
        c.content = c.content.replace(/\n{2,}/g, '<div style="height: 12px"></div>');
        c.content = c.content.replace(/\n/g, '<br/>');
        c.content = common.faceReg(c.content);
        c.content = common.pictureReg(c.content);
      })
      treeHoleList.value = res.data.records
      pagination.total = res.data.total
    }
    await nextTick()
    showFooter.value = true
    common.imgShow(".tree-hole-box .pictureReg") // 渲染图片预览
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 分页跳转
 * @param {number} page - 要跳转的页码
 */
const toPage = (page) => {
  pagination.current = page
  window.scrollTo({
    top: 240,
    behavior: "smooth"
  })
  getWeiYan()
}

/**
 * 打开微言发布框
 */
const launch = () => {
  if (common.isEmpty(store.currentUser)) {
    ElMessage.error("请先登录！")
    return
  }
  weiYanDialogVisible.value = true
}

/**
 * 关闭微言发布框
 */
const handleClose = () => {
  weiYanDialogVisible.value = false
}

/**
 * 提交微言内容
 * @param {string} content - 微言内容
 */
const submitWeiYan = async (content) => {
  const weiYan = {
    content,
    isPublic: isPublic.value
  }
  try {
    await saveWeiYan_api(weiYan)
    getWeiYan() // 重新加载树洞
  } catch (error) {
    ElMessage.error(error.message)
  }
  handleClose()
}

/**
 * 删除树洞内容
 * @param {number} id - 树洞 ID
 */
const deleteTreeHole = async (id) => {
  if (common.isEmpty(store.currentUser)) {
    ElMessage.error("请先登录！")
    return
  }
  try {
    await ElMessageBox.confirm('确认删除？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success',
      center: true
    })
    await deleteWeiYan_api({ id: id })
    ElMessage.success("删除成功!")
    pagination.current = 1 // 重置到第一页
    getWeiYan()
  } catch (error) {
    ElMessage.error(error.message)
  }
}

// 生命周期：页面加载时获取数据
onMounted(() => {
  getWeiYan()
})
</script>

<style scoped></style>
