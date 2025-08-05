<template>
  <div>
    <div>
      <div class="handle-box">
        <el-select clearable v-model="pagination.resourceType" placeholder="资源聚合类型" class="handle-select mrb10">
          <el-option v-for="(item, i) in resourceTypes" :key="i" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-select clearable v-model="pagination.status" placeholder="状态" class="handle-select mrb10">
          <el-option key="1" label="启用" :value="true"></el-option>
          <el-option key="2" label="禁用" :value="false"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
        <el-button type="primary" @click="addResourcePathDialog = true">新增资源聚合</el-button>
      </div>
      <el-table :data="resourcePaths" border class="table" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="title" label="标题" align="center"></el-table-column>
        <el-table-column prop="classify" label="分类" align="center"></el-table-column>
        <el-table-column prop="introduction" label="简介" align="center"></el-table-column>
        <el-table-column label="封面" align="center">
          <template slot-scope="scope">
            <el-image lazy :preview-src-list="[scope.row.cover]" class="table-td-thumb" :src="scope.row.cover"
              fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="链接" align="center"></el-table-column>

        <el-table-column prop="type" label="资源类型" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === false ? 'danger' : 'success'" disable-transitions>
              {{ scope.row.status === false ? '禁用' : '启用' }}
            </el-tag>
            <el-switch @click.native="changeStatus(scope.row)" v-model="scope.row.status"></el-switch>
          </template>
        </el-table-column>

        <el-table-column prop="remark" label="备注" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
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

    <el-dialog title="图片" :visible.sync="coverDialog" width="25%" :append-to-body="true" :close-on-click-modal="false"
      destroy-on-close center>
      <div>
        <uploadPicture :isAdmin="true" :prefix="resourcePath.type + 'Cover'" @addPicture="addPicture" :maxSize="2"
          :maxNumber="1"></uploadPicture>
      </div>
    </el-dialog>

    <el-dialog title="文件" :visible.sync="uploadDialog" width="25%" :append-to-body="true" :close-on-click-modal="false"
      destroy-on-close center>
      <div>
        <uploadPicture :isAdmin="true" :prefix="resourcePath.type + 'Url'" @addPicture="addFile" :maxSize="10"
          :maxNumber="1" :listType="'text'" :accept="'image/*, video/*, audio/*'"></uploadPicture>
      </div>
    </el-dialog>

    <el-dialog title="资源聚合" :visible.sync="addResourcePathDialog" width="50%" :before-close="clearDialog"
      :append-to-body="true" :close-on-click-modal="false" center>
      <div>
        <div>
          <div class="myCenter">
            <el-radio-group v-model="resourcePath.type">
              <template v-for="item in resourceTypes">
                <el-radio-button :label="item.value">{{ item.label }}</el-radio-button>
              </template>
            </el-radio-group>
          </div>
          <div style="margin-bottom: 5px">标题：</div>
          <el-input maxlength="60" v-model="resourcePath.title"></el-input>
          <div style="margin-top: 10px;margin-bottom: 5px">分类：</div>
          <el-input :disabled="!['friendUrl', 'lovePhoto', 'funny', 'favorites'].includes(resourcePath.type)"
            maxlength="30" v-model="resourcePath.classify"></el-input>
          <div style="margin-top: 10px;margin-bottom: 5px">简介：</div>
          <el-input :disabled="!['friendUrl', 'favorites'].includes(resourcePath.type)" maxlength="1000"
            v-model="resourcePath.introduction"></el-input>
          <div style="margin-top: 10px;margin-bottom: 5px">封面：</div>
          <div style="display: flex">
            <el-input v-model="resourcePath.cover"></el-input>
            <div style="width: 66px;margin: 3.5px 0 0 10px">
              <proButton :info="'上传封面'" @click.native="addResourcePathCover()" :before="constant.before_color_1"
                :after="constant.after_color_1">
              </proButton>
            </div>
          </div>
          <div style="margin-top: 10px;margin-bottom: 5px">链接：</div>
          <div style="display: flex">
            <el-input :disabled="!['friendUrl', 'funny', 'favorites'].includes(resourcePath.type)"
              v-model="resourcePath.url"></el-input>
            <div style="width: 66px;margin: 3.5px 0 0 10px">
              <proButton :info="'上传文件'" @click.native="addResourcePathUrl()" :before="constant.before_color_1"
                :after="constant.after_color_1">
              </proButton>
            </div>
          </div>
          <div style="margin-top: 10px;margin-bottom: 5px">资源类型：</div>
          <div style="margin-top: 10px;margin-bottom: 5px">备注：</div>
          <el-input :disabled="![].includes(resourcePath.type)" maxlength="1000" v-model="resourcePath.remark"
            type="textarea"></el-input>
        </div>
        <div style="display: flex;margin-top: 30px" class="myCenter">
          <proButton :info="'提交'" @click.native="addResourcePath()" :before="constant.before_color_2"
            :after="constant.after_color_2">
          </proButton>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import uploadPicture from "@/components/common/uploadPicture.vue"
import proButton from "@/components/common/proButton.vue"
import useCommon from "@/utils/common";
import constant from "@/utils/constant"
import { updateResourcePath_api, saveResourcePath_api, listResourcePath_api, deleteResourcePath_api } from "@/api/webInfo"

// 初始化工具
const common = useCommon();
;

// 资源类型
const resourceTypes = ref([
  { label: "友链", value: "friendUrl" },
  { label: "图片", value: "lovePhoto" },
  { label: "音乐", value: "funny" },
  { label: "收藏夹", value: "favorites" }
])

// 分页信息
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
  resourceType: "",
  status: null
})

// 资源路径列表
const resourcePaths = ref([])

// 弹窗控制
const coverDialog = ref(false)
const uploadDialog = ref(false)
const addResourcePathDialog = ref(false)
const isUpdate = ref(false)

// 当前编辑的资源路径对象
const resourcePath = reactive({
  title: "",
  classify: "",
  introduction: "",
  cover: "",
  url: "",
  type: "",
  remark: ""
})

/**
 * 添加封面图片
 * @param {String} res 图片路径
 */
const addPicture = (res) => {
  resourcePath.cover = res
  coverDialog.value = false
}

/**
 * 添加资源文件
 * @param {String} res 文件路径
 */
const addFile = (res) => {
  resourcePath.url = res
  uploadDialog.value = false
}

/**
 * 打开资源文件上传弹窗（只允许部分类型）
 */
const addResourcePathUrl = () => {
  if (!addResourcePathDialog.value) return
  if (!['funny'].includes(resourcePath.type)) {
    ElMessage.error("请选择有效资源类型！")
    return
  }
  uploadDialog.value = true
}

/**
 * 打开封面图片上传弹窗
 */
const addResourcePathCover = () => {
  if (!addResourcePathDialog.value) return
  if (common.isEmpty(resourcePath.type)) {
    ElMessage.error("请选择资源类型！")
    return
  }
  coverDialog.value = true
}

/**
 * 新增或修改资源路径
 */
const addResourcePath = async () => {
  if (common.isEmpty(resourcePath.title) || common.isEmpty(resourcePath.type)) {
    ElMessage.error("标题和资源类型不能为空！")
    return
  }
  try {

    const api = isUpdate.value ? updateResourcePath_api : saveResourcePath_api;
    await api(resourcePath, true)

    ElMessage.success("保存成功！")
    addResourcePathDialog.value = false
    clearDialog()
    search()
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 查询资源路径列表
 */
const getResourcePaths = async () => {
  try {
    const res = await listResourcePath_api(pagination, true)
    if (!isEmpty(res.data)) {
      resourcePaths.value = res.data.records
      pagination.total = res.data.total
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 修改资源路径状态
 * @param {Object} item 资源路径对象
 */
const changeStatus = async (item) => {
  try {
    await updateResourcePath_api(item, true)
    ElMessage.success("修改成功！")
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 删除资源路径
 * @param {Object} item 资源路径对象
 */
const handleDelete = (item) => {
  ElMessageBox.confirm(
    '确认删除？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success',
      center: true
    }
  ).then(async () => {
    try {
      await deleteResourcePath_api({ id: item.id }, true)
      search()
      ElMessage.success("删除成功！")
    } catch (error) {
      ElMessage.error(error.message)
    }
  }).catch(() => {
    ElMessage.success('已取消删除!')
  })
}

/**
 * 编辑资源路径
 * @param {Object} item 资源路径对象
 */
const handleEdit = (item) => {
  Object.assign(resourcePath, JSON.parse(JSON.stringify(item)))
  addResourcePathDialog.value = true
  isUpdate.value = true
}

/**
 * 清理对话框数据
 */
const clearDialog = () => {
  isUpdate.value = false
  addResourcePathDialog.value = false
  Object.assign(resourcePath, {
    title: "",
    classify: "",
    introduction: "",
    cover: "",
    url: "",
    type: "",
    remark: ""
  })
}

/**
 * 分页跳转
 * @param {Number} val 页码
 */
const handlePageChange = (val) => {
  pagination.current = val
  getResourcePaths()
}

/**
 * 搜索资源路径
 */
const search = () => {
  pagination.total = 0
  pagination.current = 1
  getResourcePaths()
}

// 生命周期：组件挂载后获取数据
onMounted(() => {
  getResourcePaths()
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
