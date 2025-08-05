<template>
  <div>
    <el-tag effect="dark" class="my-tag">
      <svg viewBox="0 0 1024 1024" width="20" height="20" style="vertical-align: -3px;">
        <path d="M0 0h1024v1024H0V0z" fill="#202425" opacity=".01"></path>
        <path
          d="M682.666667 204.8h238.933333a34.133333 34.133333 0 0 1 34.133333 34.133333v648.533334a68.266667 68.266667 0 0 1-68.266666 68.266666h-204.8V204.8z"
          fill="#FFAA44"></path>
        <path
          d="M68.266667 921.6a34.133333 34.133333 0 0 0 34.133333 34.133333h785.066667a68.266667 68.266667 0 0 1-68.266667-68.266666V102.4a34.133333 34.133333 0 0 0-34.133333-34.133333H102.4a34.133333 34.133333 0 0 0-34.133333 34.133333v819.2z"
          fill="#11AA66"></path>
        <path
          d="M238.933333 307.2a34.133333 34.133333 0 0 0 0 68.266667h136.533334a34.133333 34.133333 0 1 0 0-68.266667H238.933333z m0 204.8a34.133333 34.133333 0 1 0 0 68.266667h409.6a34.133333 34.133333 0 1 0 0-68.266667H238.933333z m0 204.8a34.133333 34.133333 0 1 0 0 68.266667h204.8a34.133333 34.133333 0 1 0 0-68.266667H238.933333z"
          fill="#FFFFFF"></path>
      </svg>
      留言列表
    </el-tag>
    <el-table :data="treeHoles" border class="table" header-cell-class-name="table-header">
      <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
      <el-table-column prop="message" label="留言内容" align="center"></el-table-column>
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { treeHoleBossList_api } from "@/api/admin"
import { deleteTreeHole_api } from "@/api/webInfo"
import useCommon from "@/utils/common";

const common = useCommon();

// 分页数据
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 树洞列表
const treeHoles = ref([])

/**
 * 获取树洞列表
 */
const getTreeHoles = async () => {
  try {
    const res = await treeHoleBossList_api(pagination, true)
    if (!common.isEmpty(res.data)) {
      treeHoles.value = res.data.records
      pagination.total = res.data.total
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 翻页
 * @param {number} val 页码
 */
const handlePageChange = (val) => {
  pagination.current = val
  getTreeHoles()
}

/**
 * 删除树洞
 * @param {Object} item 树洞项
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
      await deleteTreeHole_api({ id: item.id }, true)
      pagination.current = 1
      getTreeHoles()
      ElMessage.success('删除成功！')
    } catch (error) {
      ElMessage.error(error.message)
    }
  }).catch(() => {
    ElMessage.success('已取消删除!')
  })
}

// 生命周期：加载数据
onMounted(() => {
  getTreeHoles()
})
</script>


<style scoped>
.my-tag {
  margin-bottom: 40px;
  width: 100%;
  text-align: left;
  background: var(--lightYellow);
  border: none;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: var(--black);
}

.pagination {
  margin: 20px 0;
  text-align: right;
}
</style>
