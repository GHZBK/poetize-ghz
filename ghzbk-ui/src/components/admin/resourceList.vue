<template>
  <div>
    <div>
      <div class="handle-box">
        <el-select clearable v-model="pagination.resourceType" placeholder="资源类型" class="handle-select mrb10">
          <el-option key="21" label="Video.Article" value="video/article"></el-option>
          <el-option key="20" label="公共资源" value="assets"></el-option>
          <el-option key="10" label="表情包" value="internetMeme"></el-option>
          <el-option key="1" label="用户头像" value="userAvatar"></el-option>
          <el-option key="2" label="文章封面" value="articleCover"></el-option>
          <el-option key="3" label="文章图片" value="articlePicture"></el-option>
          <el-option key="5" label="网站头像" value="webAvatar"></el-option>
          <el-option key="4" label="背景图片" value="webBackgroundImage"></el-option>
          <el-option key="6" label="随机头像" value="randomAvatar"></el-option>
          <el-option key="7" label="随机封面" value="randomCover"></el-option>
          <el-option key="8" label="画笔图片" value="graffiti"></el-option>
          <el-option key="9" label="评论图片" value="commentPicture"></el-option>
          <el-option key="11" label="聊天群头像" value="im/groupAvatar"></el-option>
          <el-option key="12" label="群聊天图片" value="im/groupMessage"></el-option>
          <el-option key="13" label="朋友聊天图片" value="im/friendMessage"></el-option>
          <el-option key="14" label="音乐声音" value="funnyUrl"></el-option>
          <el-option key="15" label="音乐封面" value="funnyCover"></el-option>
          <el-option key="16" label="Love.Cover" value="love/bgCover"></el-option>
          <el-option key="17" label="Love.Man" value="love/manCover"></el-option>
          <el-option key="18" label="Love.Woman" value="love/womanCover"></el-option>
          <el-option key="19" label="收藏夹封面" value="favoritesCover"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
        <el-button type="primary" @click="addResources()">新增资源</el-button>
      </div>
      <el-table :data="resources" border class="table" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="originalName" label="名称" align="center"></el-table-column>
        <el-table-column prop="userId" label="用户ID" align="center"></el-table-column>
        <el-table-column prop="type" label="资源类型" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === false ? 'danger' : 'success'" disable-transitions>
              {{ scope.row.status === false ? '禁用' : '启用' }}
            </el-tag>
            <el-switch @click.native="changeStatus(scope.row)" v-model="scope.row.status"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="路径" align="center">
          <template slot-scope="scope">
            <template v-if="!common.isEmpty(scope.row.mimeType) && scope.row.mimeType.includes('image')">
              <el-image lazy :preview-src-list="[scope.row.path]" class="table-td-thumb" :src="scope.row.path"
                fit="cover"></el-image>
            </template>
            <template v-else>
              {{ scope.row.path }}
            </template>
          </template>
        </el-table-column>

        <el-table-column label="大小(KB)" align="center">
          <template slot-scope="scope">
            {{ Math.round(scope.row.size / 1024) }}
          </template>
        </el-table-column>
        <el-table-column prop="mimeType" label="类型" align="center"></el-table-column>
        <el-table-column prop="storeType" label="存储平台" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-delete" style="color: var(--orangeRed)"
              @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="pagination.current"
          :page-size="pagination.size" :total="pagination.total" @current-change="handlePageChange">
        </el-pagination>
      </div>
    </div>

    <el-dialog title="文件" :visible.sync="resourceDialog" width="25%" :append-to-body="true"
      :close-on-click-modal="false" destroy-on-close center>
      <div>
        <div style="display: flex;margin-bottom: 10px">
          <div style="line-height: 40px">存储平台：</div>
          <el-select v-model="storeType" placeholder="存储平台" style="width: 120px">
            <el-option v-for="(item, i) in storeTypes" :key="i" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <uploadPicture :isAdmin="true" :prefix="pagination.resourceType" @addPicture="addFile" :storeType="storeType"
          :listType="'text'" :accept="'image/*, video/*, audio/*'" :maxSize="100" :maxNumber="10"></uploadPicture>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import useCommon from "@/utils/common";
import constant from "@/utils/constant"
import uploadPicture from "@/components/common/uploadPicture.vue"
import { deleteResource_api, listResource_api, changeResourceStatus_api } from "@/api/resource"

// 初始化工具
const common = useCommon();
;

// 分页对象
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
  resourceType: ""
})

// 资源列表
const resources = ref([])

// 上传资源弹窗
const resourceDialog = ref(false)

// 存储方式选项
const storeTypes = ref([
  { label: "服务器", value: "local" },
  { label: "七牛云", value: "qiniu" }
])

// 当前存储类型
const storeType = ref(localStorage.getItem("defaultStoreType"))

/**
 * 获取资源列表
 */
const getResources = async () => {
  try {
    const res = await listResource_api(pagination, true)
    if (!common.isEmpty(res.data)) {
      resources.value = res.data.records
      pagination.total = res.data.total
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 删除资源
 * @param {Object} item 要删除的资源
 */
const handleDelete = (item) => {
  ElMessageBox.confirm(
    '确认删除资源？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success',
      center: true
    }
  ).then(async () => {
    try {
      await deleteResource_api({ path: item.path }, true, false)
      pagination.current = 1
      getResources()
      ElMessage.success("删除成功！")
    } catch (error) {
      ElMessage.error(error.message)
    }
  }).catch(() => {
    ElMessage.success('已取消删除!')
  })
}

/**
 * 新增文件（上传后回调）
 * @param {String} res 文件路径
 */
const addFile = (res) => {
  // 这里原逻辑是空的，保留
}

/**
 * 打开上传资源弹窗
 */
const addResources = () => {
  if (common.isEmpty(pagination.resourceType)) {
    ElMessage.error("请选择资源类型！")
    return
  }
  resourceDialog.value = true
}

/**
 * 搜索资源
 */
const search = () => {
  pagination.total = 0
  pagination.current = 1
  getResources()
}

/**
 * 修改资源状态
 * @param {Object} item 资源对象
 */
const changeStatus = async (item) => {
  try {
    await changeResourceStatus_api({
      id: item.id,
      flag: item.status
    }, true)
    ElMessage.success("修改成功！")
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 分页切换
 * @param {Number} val 页码
 */
const handlePageChange = (val) => {
  pagination.current = val
  getResources()
}

// 生命周期 - 组件挂载后调用
onMounted(() => {
  getResources()
})
</script>


<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 200px;
}

.table {
  width: 100%;
  font-size: 14px;
}

.mrb10 {
  margin-right: 10px;
  margin-bottom: 10px;
}

.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}

.pagination {
  margin: 20px 0;
  text-align: right;
}

.el-switch {
  margin: 5px;
}
</style>
