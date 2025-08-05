<template>
  <div>
    <div>
      <div class="handle-box">
        <el-select clearable v-model="pagination.status" placeholder="状态" class="handle-select mrb10">
          <el-option key="1" label="启用" :value="true"></el-option>
          <el-option key="2" label="禁用" :value="false"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
      </div>
      <el-table :data="loves" border class="table" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="userId" label="用户ID" align="center"></el-table-column>

        <el-table-column prop="manName" label="男生昵称" align="center"></el-table-column>
        <el-table-column prop="womanName" label="女生昵称" align="center"></el-table-column>

        <el-table-column label="背景封面" align="center">
          <template slot-scope="scope">
            <el-image lazy :preview-src-list="[scope.row.bgCover]" class="table-td-thumb" :src="scope.row.bgCover"
              fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="男生头像" align="center">
          <template slot-scope="scope">
            <el-image lazy :preview-src-list="[scope.row.manCover]" class="table-td-thumb" :src="scope.row.manCover"
              fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="女生头像" align="center">
          <template slot-scope="scope">
            <el-image lazy :preview-src-list="[scope.row.womanCover]" class="table-td-thumb" :src="scope.row.womanCover"
              fit="cover"></el-image>
          </template>
        </el-table-column>

        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === false ? 'danger' : 'success'" disable-transitions>
              {{ scope.row.status === false ? '禁用' : '启用' }}
            </el-tag>
            <el-switch @click.native="changeStatus(scope.row)" v-model="scope.row.status"></el-switch>
          </template>
        </el-table-column>

        <el-table-column prop="timing" label="计时" align="center"></el-table-column>
        <el-table-column prop="countdownTitle" label="倒计时标题" align="center"></el-table-column>
        <el-table-column prop="countdownTime" label="倒计时时间" align="center"></el-table-column>
        <!-- <el-table-column prop="familyInfo" label="额外信息" align="center" show-overflow-tooltip></el-table-column> -->
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="最终修改时间" align="center"></el-table-column>
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import useCommon from "@/utils/common";
import constant from "@/utils/constant"
import { ElMessage, ElMessageBox } from 'element-plus'
import { deleteFamily_api, changeLoveStatus_api } from "@/api/family"

const common = useCommon();
const store = useStore();


// 分页信息
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
  status: null
})

// 表白墙数据
const loves = ref([])

/**
 * 获取表白墙列表
 */
const getLoves = async () => {
  try {
    const res = await post(`${baseURL}/family/listFamily`, pagination, true)
    if (!isEmpty(res.data)) {
      loves.value = res.data.records
      pagination.total = res.data.total
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 删除表白资源
 * @param {Object} item 要删除的表白对象
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
      await deleteFamily_api({ id: item.id }, true)
      pagination.current = 1
      getLoves()
      ElMessage.success("删除成功！")
    } catch (error) {
      ElMessage.error(error.message)
    }
  }).catch(() => {
    ElMessage.success('已取消删除!')
  })
}

/**
 * 搜索表白墙数据
 */
const search = () => {
  pagination.total = 0
  pagination.current = 1
  getLoves()
}

/**
 * 修改表白状态
 * @param {Object} item 表白对象
 */
const changeStatus = async (item) => {
  try {
    await changeLoveStatus_api({
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
  getLoves()
}

// 生命周期 - 组件挂载后调用
onMounted(() => {
  getLoves()
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
