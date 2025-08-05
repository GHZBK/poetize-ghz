<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-select v-if="isBoss" v-model="pagination.commentType" placeholder="评论来源类型" style="margin-right: 10px">
        <el-option key="1" label="文章评论" value="article"></el-option>
        <el-option key="2" label="树洞留言" value="message"></el-option>
        <el-option key="3" label="家庭祝福" value="love"></el-option>
      </el-select>
      <el-input class="my-input" type="number" style="width: 140px;margin-right: 10px" v-model="pagination.source"
        placeholder="评论来源标识"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchComments()">搜索</el-button>
      <el-button type="danger" @click="clearSearch()">清除参数</el-button>
    </div>
    <el-table :data="comments" border class="table" header-cell-class-name="table-header">
      <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
      <el-table-column prop="source" label="评论来源标识" align="center"></el-table-column>
      <el-table-column prop="type" label="评论来源类型" align="center"></el-table-column>
      <el-table-column prop="userId" label="发表用户ID" align="center"></el-table-column>
      <el-table-column prop="likeCount" label="点赞数" align="center"></el-table-column>
      <el-table-column prop="commentContent" label="评论内容" align="center"></el-table-column>
      <el-table-column prop="commentInfo" label="评论额外信息" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
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
import { ref, reactive, onMounted } from 'vue'
import useStore from "@/store"
import useCommon from "@/utils/common";
import constant from "@/utils/constant"
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  bossList_api, bossUser_api, userDeleteComment_api,
  bossDeleteComment_api,
} from "@/api/admin"

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
  source: null,
  commentType: ""
})

// 评论列表
const comments = ref([])

/**
 * 获取评论列表
 */
const getComments = async () => {
  const api = isBoss.value ? bossList_api : bossUser_api;

  try {
    const res = await api(pagination, true);
    if (!common.isEmpty(res.data)) {
      comments.value = res.data.records
      pagination.total = res.data.total
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 清空搜索条件并刷新评论列表
 */
const clearSearch = () => {
  Object.assign(pagination, {
    current: 1,
    size: 10,
    total: 0,
    source: null,
    commentType: ""
  })

  getComments()
}

/**
 * 分页切换
 * @param {Number} val 页码
 */
const handlePageChange = (val) => {
  pagination.current = val
  getComments()
}

/**
 * 搜索评论
 */
const searchComments = () => {
  pagination.current = 1
  pagination.total = 0
  getComments()
}

/**
 * 删除评论
 * @param {Object} item 要删除的评论对象
 */
const handleDelete = (item) => {
  const api = isBoss.value ? bossDeleteComment_api : userDeleteComment_api;

  ElMessageBox.confirm(
    '删除评论后，所有该评论的回复均不可见。确认删除？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success',
      center: true
    }
  ).then(async () => {
    try {
      const res = await api({ id: item.id }, true);
      pagination.current = 1
      getComments()
      ElMessage.success("删除成功！")
    } catch (error) {
      ElMessage.error(error.message)
    }
  }).catch(() => {
    ElMessage.success('已取消删除!')
  })
}

// 生命周期：组件加载时获取评论
onMounted(() => {
  getComments()
})
</script>


<style scoped>
.pagination {
  margin: 20px 0;
  text-align: right;
}

.my-input>>>input::-webkit-inner-spin-button {
  appearance: none;
}
</style>
