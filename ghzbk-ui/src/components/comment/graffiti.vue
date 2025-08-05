<template>
  <div>
    <!-- 画布 -->
    <div style="padding: 5px" @mousemove="canvasOutMove($event)" @touchmove="canvasOutMove($event)">
      <div class="graffiti-container">
        <canvas id="canvas" width="766" height="400" @mousedown="canvasDown($event)" @mouseup="canvasUp($event)"
          @mousemove="canvasMove($event)" @touchstart="canvasDown($event)" @touchend="canvasUp($event)"
          @touchmove="canvasMove($event)">
        </canvas>
      </div>
    </div>

    <div style="padding: 10px 0 0 5px;">
      <!-- 颜色 -->
      <div class="graffiti-tools">
        <span class="graffiti-title">画笔颜色</span>
        <div class="myCenter" style="margin-left: 2rem">
          <div v-for="(color, index) in colors" :class="{ activeColor: config.lineColor === color }"
            :style="{ background: color }" @click="setColor(color)" class="graffiti-color" :key="index">
          </div>
        </div>
      </div>

      <!-- 大小 -->
      <div class="graffiti-tools">
        <span class="graffiti-title">画笔大小</span>
        <div class="myCenter" style="margin-left: 2rem">
          <i v-for="(pen, index) in brushSize" :key="index" class="graffiti-size"
            :class="[pen.className, { activeSize: config.lineWidth === pen.lineWidth }]"
            @click="setBrush(pen.lineWidth)">
          </i>
        </div>
      </div>

      <!-- 操作 -->
      <div class="graffiti-tools">
        <span class="graffiti-title">操作</span>
        <div class="myCenter" style="margin-left: 3.7rem">
          <i v-for="(control, index) in controls" :title="control.title" :class="control.className"
            class="graffiti-operate" @click="controlCanvas(control.action)" :key="index">
          </i>
        </div>
      </div>

      <!-- 按钮 -->
      <div class="graffiti-tools" style="justify-content: center">
        <proButton :info="'文字'" @click.native="showComment()" :before="$constant.before_color_1"
          :after="$constant.after_color_1" style="margin-right: 6px">
        </proButton>
        <proButton :info="'提交'" @click.native="getImage()" :before="$constant.before_color_2"
          :after="$constant.after_color_2">
        </proButton>
      </div>
    </div>
  </div>
</template>

<script setup>
// 引入 Vue Composition API
import { ref, reactive, computed, onMounted, nextTick, defineEmits } from 'vue'

import useStore from "@/store"
import useCommon from "@/utils/common";
import constant from "@/utils/constant"

import proButton from '@/components/common/proButton.vue'
import { uploadResource_api, qiNiuResource_api } from "@/api/resource"
import { uploadQiniu_api } from "@/api/upload"


const emit = defineEmits(["showComment", "addGraffitiComment"])

// 初始化工具和 store
const common = useCommon();
const store = useStore();
;

// 画布上下文
const context = ref(null)

// 画布状态
const canvasMoveUse = ref(false)
const preDrawAry = ref([])       // 撤销栈
const nextDrawAry = ref([])      // 重做栈
const middleAry = ref([])        // 中间状态栈

// 配置参数
const config = reactive({
  lineWidth: 5,
  lineColor: "#8154A3",
  shadowBlur: 2
})
const colors = ["#8154A3", "#fef4ac", "#0018ba", "#ffc200", "#f32f15", "#cccccc", "#5ab639"]
const brushSize = [
  { className: "small el-icon-edit", lineWidth: 5 },
  { className: "middle el-icon-edit", lineWidth: 10 },
  { className: "big el-icon-edit", lineWidth: 15 }
]

// 操作控制按钮
const controls = computed(() => [
  {
    title: "上一步",
    action: "prev",
    className: preDrawAry.value.length ? "active el-icon-arrow-left" : "ban el-icon-arrow-left"
  },
  {
    title: "下一步",
    action: "next",
    className: nextDrawAry.value.length ? "active el-icon-arrow-right" : "ban el-icon-arrow-right"
  },
  {
    title: "清除",
    action: "clear",
    className: preDrawAry.value.length || nextDrawAry.value.length ? "active el-icon-refresh" : "ban el-icon-refresh"
  }
])

// 画布初始化
onMounted(() => {
  const canvas = document.querySelector("#canvas")
  context.value = canvas.getContext("2d", { willReadFrequently: true })
  initDraw()
  setCanvasStyle()
})

/**
 * 初始化画布
 * 将空白画布存入 middleAry
 */
const initDraw = () => {
  const preData = context.value.getImageData(0, 0, 1200, 600)
  middleAry.value.push(preData)
}

const showComment = () => {
  clearContext();
  emit("showComment");
}

/**
 * 鼠标按下，开始绘制
 */
const canvasDown = (e) => {
  canvasMoveUse.value = true
  setCanvasStyle()
  context.value.beginPath()
  context.value.moveTo(e.layerX, e.layerY)
  const preData = context.value.getImageData(0, 0, 1200, 600)
  preDrawAry.value.push(preData)
}

/**
 * 鼠标移动，绘制线条
 */
const canvasMove = (e) => {
  if (canvasMoveUse.value) {
    context.value.lineTo(e.layerX, e.layerY)
    context.value.stroke()
  }
}

/**
 * 鼠标松开，结束绘制
 */
const canvasUp = () => {
  const preData = context.value.getImageData(0, 0, 1200, 600)
  if (!nextDrawAry.value.length) {
    middleAry.value.push(preData)
  } else {
    middleAry.value = preDrawAry.value.concat([preData])
    nextDrawAry.value = []
  }
  canvasMoveUse.value = false
  context.value.beginPath()
}

/**
 * 鼠标移出画布，取消绘制
 */
const canvasOutMove = (e) => {
  if (e.target !== document.querySelector("#canvas")) {
    canvasMoveUse.value = false
  }
}

/**
 * 设置画笔样式
 */
const setCanvasStyle = () => {
  context.value.lineWidth = config.lineWidth
  context.value.shadowBlur = config.shadowBlur
  context.value.shadowColor = config.lineColor
  context.value.strokeStyle = config.lineColor
}

/**
 * 设置颜色
 */
const setColor = (color) => {
  config.lineColor = color
}

/**
 * 设置笔刷大小
 */
const setBrush = (size) => {
  config.lineWidth = size
}

/**
 * 撤销、重做、清空
 */
const controlCanvas = (action) => {
  switch (action) {
    case "prev":
      if (preDrawAry.value.length) {
        const popData = preDrawAry.value.pop()
        nextDrawAry.value.push(middleAry.value[preDrawAry.value.length + 1])
        context.value.putImageData(popData, 0, 0)
      }
      break
    case "next":
      if (nextDrawAry.value.length) {
        const popData = nextDrawAry.value.pop()
        preDrawAry.value.push(middleAry.value[middleAry.value.length - nextDrawAry.value.length - 2])
        context.value.putImageData(popData, 0, 0)
      }
      break
    case "clear":
      clearContext()
      middleAry.value = [middleAry.value[0]]
      break
  }
}

/**
 * 清空画布
 */
const clearContext = () => {
  context.value.clearRect(0, 0, context.value.canvas.width, context.value.canvas.height)
  preDrawAry.value = []
  nextDrawAry.value = []
}

/**
 * 保存涂鸦图片（上传到本地或七牛云）
 */
const getImage = async () => {
  if (common.isEmpty(userStore.currentUser)) return ElMessage.error('请先登录！')
  if (!preDrawAry.value.length) return ElMessage.warning('你还没画呢~')

  const canvas = document.querySelector('#canvas')
  const blob = dataURLToBlob(canvas.toDataURL('image/png'))

  const key = `graffiti/${userStore.currentUser.username.replace(/[^a-zA-Z]/g, '')}${userStore.currentUser.id}${Date.now()}${Math.floor(Math.random() * 1000)}.png`
  const storeType = localStorage.getItem('defaultStoreType')

  const fd = new FormData()
  Object.entries({
    file: blob,
    key,
    relativePath: key,
    type: 'graffiti',
    storeType
  }).forEach(([k, v]) => fd.append(k, v))

  storeType === 'local'
    ? saveLocal(fd)
    : storeType === 'qiniu'
      ? saveQiniu(fd)
      : ElMessage.error(`不支持的存储类型: ${storeType}`)
}


/**
 * base64转Blob
 */
const dataURLToBlob = (dataURL) => {
  const arr = dataURL.split(",")
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) u8arr[n] = bstr.charCodeAt(n)
  return new Blob([u8arr], { type: mime })
}

/**
 * 保存到本地服务器
 */
const saveLocal = async (fd) => {
  try {
    const res = await uploadResource_api(fd)
    if (common.isEmpty(res.data)) {
      clearContext();
      let url = res.data;
      let img = "[你画我猜," + url + "]";
      emit("addGraffitiComment", img);
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 保存到七牛云
 */
const saveQiniu = async (fd) => {
  try {
    const tokenRes = await qiNiuResource_api({ key: fd.get("key") })
    if (!common.isEmpty(tokenRes.data)) {
      fd.append("token", tokenRes.data)
      const uploadRes = await uploadQiniu_api(store.sysConfig.qiniuUrl, fd)
      if (!isEmpty(uploadRes.key)) {
        clearContext()
        const url = `${store.sysConfig['qiniu.downloadUrl']}${uploadRes.key}`
        common.saveResource("graffiti", url, fd.get("file").size, fd.get("file").type, null, "qiniu")
        let img = "[你画我猜," + url + "]";
        emit("addGraffitiComment", img);
      }
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}


</script>

<style scoped>
.graffiti-container {
  overflow: hidden;
  border: 2px var(--lightGray) solid;
  border-radius: 4px;
}

.graffiti-tools {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.graffiti-title {
  font-size: 14px;
}

.graffiti-color {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  float: left;
  margin-right: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.graffiti-color:hover {
  width: 1.3rem;
  height: 1.3rem;
}

.activeColor {
  width: 1.3rem;
  height: 1.3rem;
}

.graffiti-size {
  cursor: pointer;
  margin-right: 20px;
}

.graffiti-size.small {
  font-size: 14px;
}

.graffiti-size.middle {
  font-size: 16px;
}

.graffiti-size.big {
  font-size: 18px;
}

.activeSize {
  background-color: var(--themeBackground);
  color: var(--white);
  border-radius: 50%;
  padding: 2px;
}

.graffiti-operate {
  margin-right: 20px;
  cursor: pointer;
  font-size: 18px;
}

.graffiti-operate.ban {
  cursor: not-allowed
}
</style>
