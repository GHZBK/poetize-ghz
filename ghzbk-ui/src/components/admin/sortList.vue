<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="sortDialog = true">新增分类</el-button>
    </div>
    <el-table :data="sortInfo" border class="table" header-cell-class-name="table-header">
      <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
      <el-table-column prop="sortName" label="分类名称" align="center"></el-table-column>
      <el-table-column prop="sortDescription" label="分类描述" align="center"></el-table-column>
      <el-table-column label="分类类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.sortType === 0">导航栏分类</span>
          <span v-else-if="scope.row.sortType === 1">普通分类</span>
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="分类优先级" align="center"></el-table-column>
      <el-table-column prop="countOfSort" label="文章总数" align="center"></el-table-column>
      <el-table-column label="操作" width="380" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="editSort(scope.row)">
            编辑分类
          </el-button>
          <el-button type="text" icon="el-icon-edit" @click="sayLabel(scope.row)">
            查看标签
          </el-button>
          <el-button type="text" icon="el-icon-edit" @click="insertLabel(scope.row)">
            新增标签
          </el-button>
          <el-button type="text" icon="el-icon-delete" style="color: var(--orangeRed)"
            @click="deleteHandle(scope.row.id, 1)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-table v-if="!common.isEmpty(sort)" :data="sort.labels" border class="table" style="margin-top: 40px"
      header-cell-class-name="table-header">
      <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
      <el-table-column label="分类名称" align="center">
        <span>{{ sort.sortName }}</span>
      </el-table-column>
      <el-table-column prop="labelName" label="标签名称" align="center"></el-table-column>
      <el-table-column prop="labelDescription" label="标签描述" align="center"></el-table-column>
      <el-table-column prop="countOfLabel" label="文章总数" align="center"></el-table-column>
      <el-table-column label="操作" width="320" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="editLabel(scope.row)">
            编辑标签
          </el-button>
          <el-button type="text" icon="el-icon-delete" style="color: var(--orangeRed)"
            @click="deleteHandle(scope.row.id, 2)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="分类" :visible.sync="sortDialog" width="30%" :before-close="handleClose" :append-to-body="true"
      destroy-on-close center>
      <div class="my-dialog">
        <div class="myCenter">
          <el-radio-group v-model="sortForHttp.sortType">
            <el-radio-button :label="0">导航栏分类</el-radio-button>
            <el-radio-button :label="1">普通分类</el-radio-button>
          </el-radio-group>
        </div>
        <el-input placeholder="请输入分类名称" v-model="sortForHttp.sortName">
          <template slot="prepend">分类名称</template>
        </el-input>
        <el-input placeholder="请输入分类描述" v-model="sortForHttp.sortDescription">
          <template slot="prepend">分类描述</template>
        </el-input>
        <el-input type="number" placeholder="请输入整数，数字小的在前面" v-model="sortForHttp.priority">
          <template slot="prepend">分类优先级</template>
        </el-input>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="saveSortEdit()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="标签" :visible.sync="labelDialog" width="30%" :before-close="handleClose" :append-to-body="true"
      destroy-on-close center>
      <div class="my-dialog">
        <el-input placeholder="请输入标签名称" v-model="labelForHttp.labelName">
          <template slot="prepend">标签名称</template>
        </el-input>
        <el-input placeholder="请输入标签描述" v-model="labelForHttp.labelDescription">
          <template slot="prepend">标签描述</template>
        </el-input>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="saveLabelEdit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import useCommon from "@/utils/common";
import constant from "@/utils/constant"
import { getSortInfo_api, deleteSort_api, deleteLabel_api, saveSort_api, updateSort_api, saveLabel_api, updateLabel_api } from "@/api/webInfo"

// 初始化工具
const common = useCommon();
;

// 弹窗状态
const sortDialog = ref(false)
const labelDialog = ref(false)

// 分类 & 标签数据
const sortInfo = ref([])
const sort = ref({})

// 分类编辑对象
const sortForHttp = reactive({
  id: null,
  sortName: "",
  sortDescription: "",
  sortType: null,
  priority: null
})

// 标签编辑对象
const labelForHttp = reactive({
  id: null,
  sortId: null,
  labelName: "",
  labelDescription: ""
})

/**
 * 获取分类信息
 */
const getSortInfo = async () => {
  try {
    const res = await getSortInfo_api()
    if (!common.isEmpty(res.data)) {
      sortInfo.value = res.data
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 删除分类或标签
 * @param {Number} id ID
 * @param {Number} flag 1=分类 2=标签
 */
const deleteHandle = (id, flag) => {
  const api = flag === 1 ? deleteSort_api : deleteLabel_api;
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
      await api({ id: id }, true)
      ElMessage.success("删除成功！")
      getSortInfo()
      sort.value = {}
    } catch (error) {
      ElMessage.error(error.message)
    }
  }).catch(() => {
    ElMessage.success('已取消删除!')
  })
}

/**
 * 保存或更新分类
 */
const saveSortEdit = async () => {
  if (
    common.isEmpty(sortForHttp.sortType) ||
    common.isEmpty(sortForHttp.priority) ||
    common.isEmpty(sortForHttp.sortName) ||
    common.isEmpty(sortForHttp.sortDescription)
  ) {
    ElMessage.error("请完善所有分类信息！")
    return
  }

  const api = common.isEmpty(sortForHttp.id) ? saveSort_api : updateSort_api;

  try {
    await api(sortForHttp, true)
    ElMessage.success("保存成功！")
    getSortInfo()
    handleClose()
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 保存或更新标签
 */
const saveLabelEdit = async () => {
  if (
    isEmpty(labelForHttp.labelName) ||
    isEmpty(labelForHttp.labelDescription)
  ) {
    ElMessage.error("请完善所有标签信息！")
    return
  }
  const api = common.isEmpty(labelForHttp.id) ? saveLabel_api : updateLabel_api;


  try {
    await api(labelForHttp, true)
    ElMessage.success("保存成功！")
    getSortInfo()
    handleClose()
    sort.value = {}
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 打开分类编辑弹窗
 * @param {Object} item 分类对象
 */
const editSort = (item) => {
  sortDialog.value = true
  Object.assign(sortForHttp, {
    id: item.id,
    sortName: item.sortName,
    sortDescription: item.sortDescription,
    sortType: item.sortType,
    priority: item.priority
  })
}

/**
 * 打开标签编辑弹窗
 * @param {Object} item 标签对象
 */
const editLabel = (item) => {
  labelDialog.value = true
  Object.assign(labelForHttp, {
    id: item.id,
    sortId: item.sortId,
    labelName: item.labelName,
    labelDescription: item.labelDescription
  })
}

/**
 * 新增标签时指定分类ID
 * @param {Object} item 分类对象
 */
const insertLabel = (item) => {
  labelForHttp.sortId = item.id
  labelDialog.value = true
}

/**
 * 关闭所有弹窗并重置表单
 */
const handleClose = () => {
  Object.assign(sortForHttp, {
    id: null,
    sortName: "",
    sortDescription: "",
    sortType: null,
    priority: null
  })
  Object.assign(labelForHttp, {
    id: null,
    sortId: null,
    labelName: "",
    labelDescription: ""
  })
  sortDialog.value = false
  labelDialog.value = false
}

/**
 * 选择查看标签的分类
 * @param {Object} item 分类对象
 */
const sayLabel = (item) => {
  sort.value = item
}

// 生命周期：挂载时获取分类信息
onMounted(() => {
  getSortInfo()
})
</script>

<style scoped>
.my-dialog>div {
  margin: 12px;
}

.my-dialog>>>input::-webkit-inner-spin-button {
  appearance: none;
}
</style>
