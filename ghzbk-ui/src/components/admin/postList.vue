<template>
  <div>
    <div class="handle-box">
      <el-select v-model="pagination.recommendStatus" placeholder="是否推荐" style="width: 120px" class="mrb10">
        <el-option key="1" label="是" :value="true"></el-option>
        <el-option key="2" label="否" :value="false"></el-option>
      </el-select>
      <el-select style="width: 140px" class="mrb10" v-model="pagination.sortId" placeholder="请选择分类">
        <el-option v-for="item in sorts" :key="item.id" :label="item.sortName" :value="item.id">
        </el-option>
      </el-select>
      <el-select style="width: 140px" class="mrb10" v-model="pagination.labelId" placeholder="请选择标签">
        <el-option v-for="item in labelsTemp" :key="item.id" :label="item.labelName" :value="item.id">
        </el-option>
      </el-select>
      <el-input v-model="pagination.searchKey" placeholder="文章标题" class="handle-input mrb10"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchArticles()">搜索</el-button>
      <el-button type="danger" @click="clearSearch()">清除参数</el-button>
      <el-button type="primary" @click="router.push({ path: '/postEdit' })">新增文章</el-button>
    </div>
    <el-table :data="articles" border class="table" header-cell-class-name="table-header">
      <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
      <el-table-column prop="username" label="作者" align="center"></el-table-column>
      <el-table-column prop="articleTitle" label="文章标题" align="center"></el-table-column>
      <el-table-column prop="sort.sortName" label="分类" align="center"></el-table-column>
      <el-table-column prop="label.labelName" label="标签" align="center"></el-table-column>
      <el-table-column prop="viewCount" label="浏览量" align="center"></el-table-column>
      <el-table-column prop="likeCount" label="点赞数" align="center"></el-table-column>
      <el-table-column label="是否可见" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.viewStatus === false ? 'danger' : 'success'" disable-transitions>
            {{ scope.row.viewStatus === false ? '不可见' : '可见' }}
          </el-tag>
          <el-switch @click.native="changeStatus(scope.row, 1)" v-model="scope.row.viewStatus"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="封面" align="center">
        <template slot-scope="scope">
          <el-image lazy class="table-td-thumb" :src="scope.row.articleCover" fit="cover"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="是否启用评论" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.commentStatus === false ? 'danger' : 'success'" disable-transitions>
            {{ scope.row.commentStatus === false ? '否' : '是' }}
          </el-tag>
          <el-switch @click.native="changeStatus(scope.row, 2)" v-model="scope.row.commentStatus"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="是否推荐" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.recommendStatus === false ? 'danger' : 'success'" disable-transitions>
            {{ scope.row.recommendStatus === false ? '否' : '是' }}
          </el-tag>
          <el-switch @click.native="changeStatus(scope.row, 3)" v-model="scope.row.recommendStatus"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="commentCount" label="评论数" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column prop="updateTime" label="最终修改时间" align="center"></el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" style="color: var(--orangeRed)" @click="handleDelete(scope.row)">
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
</template>

<script setup>
// 引入 Vue Composition API
import { ref, reactive, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useStore from "@/store"
import useCommon from "@/utils/common";
import constant from "@/utils/constant"
import { ElMessage, ElMessageBox } from 'element-plus'
import { listSortAndLabel_api } from "@/api/webInfo"
import {
  articleUserList_api,
  articleBossList_api,
  changeArticleStatus_api
} from "@/api/admin"


// 初始化 Router、Store 和工具方法
const router = useRouter()
const common = useCommon();
const store = useStore();
;

// 判断当前管理员是否 Boss
const isBoss = ref(store.currentAdmin?.isBoss)

// 分页数据
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
  searchKey: "",
  recommendStatus: null,
  sortId: null,
  labelId: null
})

// 文章列表
const articles = ref([])
// 分类和标签列表
const sorts = ref([])
const labels = ref([])
// 当前分类下的标签临时列表
const labelsTemp = ref([])

/**
 * 监听分页的 sortId 变化
 * 当分类变化时，清空标签选择并更新临时标签列表
 */
watch(() => pagination.sortId, (newVal) => {
  pagination.labelId = null
  if (!common.isEmpty(newVal) && !common.isEmpty(labels.value)) {
    labelsTemp.value = labels.value.filter(l => l.sortId === newVal)
  }
})

/**
 * 获取分类和标签数据
 */
const getSortAndLabel = async () => {
  try {
    const res = await listSortAndLabel_api()
    if (!common.isEmpty(res.data)) {
      sorts.value = res.data.sorts
      labels.value = res.data.labels
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 获取文章列表
 */
const getArticles = async () => {

  const api = isBoss.value ? articleBossList_api : articleUserList_api;

  try {
    const res = await api(pagination, true)
    if (!common.isEmpty(res.data)) {
      articles.value = res.data.records
      pagination.total = res.data.total
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 清空搜索条件并刷新文章列表
 */
const clearSearch = () => {
  Object.assign(pagination, {
    current: 1,
    size: 10,
    total: 0,
    searchKey: "",
    recommendStatus: null,
    sortId: null,
    labelId: null
  })

  getArticles()
}

/**
 * 分页切换
 * @param {Number} val 页码
 */
const handlePageChange = (val) => {
  pagination.current = val
  getArticles()
}

/**
 * 搜索文章
 */
const searchArticles = () => {
  pagination.current = 1
  pagination.total = 0
  getArticles()
}

/**
 * 修改文章状态
 * @param {Object} article 文章对象
 * @param {Number} flag 修改的字段类型（1=可见性, 2=评论, 3=推荐）
 */
const changeStatus = async (article, flag) => {
  let param = {}
  if (flag === 1) {
    param = { articleId: article.id, viewStatus: article.viewStatus }
  } else if (flag === 2) {
    param = { articleId: article.id, commentStatus: article.commentStatus }
  } else if (flag === 3) {
    param = { articleId: article.id, recommendStatus: article.recommendStatus }
  }

  try {
    await changeArticleStatus_api(param, true)
    if (flag === 1) {
      ElMessage({
        duration: 0,
        showClose: true,
        message: "修改成功！注意，文章不可见时必须设置密码才能访问！",
        type: "warning"
      })
    } else {
      ElMessage.success("修改成功！")
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 删除文章
 * @param {Object} item 要删除的文章
 */
const handleDelete = (item) => {
  ElMessageBox.confirm('确认删除？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success',
    center: true
  }).then(async () => {
    try {
      await deleteArticle_api({ id: item.id }, true)
      pagination.current = 1
      getArticles()
      ElMessage.success("删除成功！")
    } catch (error) {
      ElMessage.error(error.message)
    }
  }).catch(() => {
    ElMessage.success('已取消删除!')
  })
}

/**
 * 跳转到编辑文章页面
 * @param {Object} item 要编辑的文章
 */
const handleEdit = (item) => {
  router.push({ path: '/postEdit', query: { id: item.id } })
}

// 生命周期：组件创建时加载数据
onMounted(() => {
  getArticles()
  getSortAndLabel()
})
</script>


<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-input {
  width: 160px;
  display: inline-block;
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
