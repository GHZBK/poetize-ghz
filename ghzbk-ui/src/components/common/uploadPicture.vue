<template>
  <div>
    <el-upload class="upload-demo" ref="uploadRef" multiple drag :action="store.sysConfig.qiniuUrl"
      :on-change="handleChange" :before-upload="beforeUpload" :on-success="handleSuccess" :on-error="handleError"
      :on-remove="handleRemove" :http-request="customUpload" :list-type="listType" :accept="accept" :limit="maxNumber"
      :auto-upload="false">
      <div class="el-upload__text">
        <svg viewBox="0 0 1024 1024" width="40" height="40">
          <!-- SVG 略 -->
        </svg>
        <div>拖拽上传 / 点击上传</div>
      </div>
      <template v-if="listType === 'picture'">
        <div class="el-upload__tip">一次最多上传 {{ maxNumber }} 张图片，每张最大 {{ maxSize }}M！</div>
      </template>
      <template v-else>
        <div class="el-upload__tip">一次最多上传 {{ maxNumber }} 个文件，每个最大 {{ maxSize }}M！</div>
      </template>
    </el-upload>

    <div style="text-align: center; margin-top: 20px">
      <el-button type="success" style="font-size: 12px" @click="submitUpload">
        上传
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import useCommon from '@/utils/common'
import useStore from "@/store"
import request from '@/utils/request'

const common = useCommon()
const store = useStore()


// Props
const props = defineProps({
  isAdmin: { type: Boolean, default: false },
  prefix: { type: String, default: '' },
  listType: { type: String, default: 'picture' },
  storeType: { type: String, default: localStorage.getItem('defaultStoreType') },
  accept: { type: String, default: 'image/*' },
  maxSize: { type: Number, default: 5 },
  maxNumber: { type: Number, default: 5 }
})



// Refs
const uploadRef = ref()

// 上传按钮
const submitUpload = () => {
  uploadRef.value.submit()
}

// 自定义上传
const customUpload = async (options) => {
  let suffix = ''
  if (options.file.name.lastIndexOf('.') !== -1) {
    suffix = options.file.name.substring(options.file.name.lastIndexOf('.'))
  }

  const username = props.isAdmin
    ? userStore.currentAdmin.username
    : userStore.currentUser.username

  const userId = props.isAdmin
    ? userStore.currentAdmin.id
    : userStore.currentUser.id

  const key = `${props.prefix}/${username.replace(/[^a-zA-Z]/g, '')}${userId}${Date.now()}${Math.floor(Math.random() * 1000)}${suffix}`

  if (props.storeType === 'local') {
    const fd = new FormData()
    fd.append('file', options.file)
    fd.append('originalName', options.file.name)
    fd.append('key', key)
    fd.append('relativePath', key)
    fd.append('type', props.prefix)
    fd.append('storeType', props.storeType)

    return request({
      url: '/resource/upload',
      method: 'post',
      data: fd,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  } else if (props.storeType === 'qiniu') {
    try {
      const tokenRes = await request({
        url: `/qiniu/getUpToken?key=${key}`,
        method: 'get',
        headers: {
          Authorization: props.isAdmin
            ? localStorage.getItem('adminToken')
            : localStorage.getItem('userToken')
        }
      })

      if (tokenRes.code === 200) {
        options.data = {
          token: tokenRes.data,
          key: key
        }
        return upload(options)
      } else {
        return Promise.reject(tokenRes.message || '获取上传凭证失败')
      }
    } catch (err) {
      return Promise.reject(err.message || '上传异常')
    }
  }
}

// 上传成功
const handleSuccess = (response, file) => {
  let url = ''
  if (props.storeType === 'local') {
    url = response.data
  } else if (props.storeType === 'qiniu') {
    url = store.sysConfig.qiniuDownloadUrl + response.key
    common.saveResource(props.prefix, url, file.size, file.raw.type, file.name, 'qiniu', props.isAdmin)
  }
  emit('addPicture', url)
}

// 上传失败
const handleError = (err) => {
  ElMessage.error(err)
}

// 上传前
const beforeUpload = (file) => {
  if (file.size > props.maxSize * 1024 * 1024) {
    ElMessage.warning(`文件大小不能超过 ${props.maxSize}M`)
    return false
  }
  return true
}

// 删除文件
const handleRemove = (file, fileList) => {
  console.log('文件已删除', file, fileList)
}

// 文件列表变更
const handleChange = (file, fileList) => {
  if (file.size > props.maxSize * 1024 * 1024) {
    ElMessage.warning(`文件大小不能超过 ${props.maxSize}M`)
    const idx = fileList.findIndex(f => f.uid === file.uid)
    if (idx !== -1) fileList.splice(idx, 1)
  }
}
</script>

<style scoped>
.upload-demo {
  width: 100%;
}
</style>
