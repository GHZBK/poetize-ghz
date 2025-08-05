<template>
  <div>
    <div>
      <div class="handle-box">
        <el-select v-model="pagination.userType" placeholder="用户类型" class="handle-select mrb10">
          <el-option key="1" label="站长" :value="0"></el-option>
          <el-option key="2" label="管理员" :value="1"></el-option>
          <el-option key="3" label="普通用户" :value="2"></el-option>
        </el-select>
        <el-select v-model="pagination.userStatus" placeholder="用户状态" class="handle-select mrb10">
          <el-option key="1" label="启用" :value="true"></el-option>
          <el-option key="2" label="禁用" :value="false"></el-option>
        </el-select>
        <el-input v-model="pagination.searchKey" placeholder="用户名/手机号/邮箱" class="handle-input mrb10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchUser()">搜索</el-button>
        <el-button type="danger" @click="clearSearch()">清除参数</el-button>
      </div>
      <el-table :data="users" border class="table" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="username" label="用户名" align="center"></el-table-column>
        <el-table-column prop="phoneNumber" label="手机号" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
        <el-table-column label="赞赏" width="100" align="center">
          <template slot-scope="scope">
            <el-input size="medium" maxlength="30" v-model="scope.row.admire"
              @blur="changeUserAdmire(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="用户状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.userStatus === false ? 'danger' : 'success'" disable-transitions>
              {{ scope.row.userStatus === false ? '禁用' : '启用' }}
            </el-tag>
            <el-switch v-if="scope.row.id !== store.currentAdmin.id" @click.native="changeUserStatus(scope.row)"
              v-model="scope.row.userStatus"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="头像" align="center">
          <template slot-scope="scope">
            <el-image lazy class="table-td-thumb" :src="scope.row.avatar" fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.gender === 1" disable-transitions>
              男
            </el-tag>
            <el-tag type="success" v-else-if="scope.row.gender === 2" disable-transitions>
              女
            </el-tag>
            <el-tag type="success" v-else disable-transitions>
              保密
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="introduction" label="简介" align="center"></el-table-column>
        <el-table-column label="用户类型" width="100" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.userType === 0" disable-transitions>
              站长
            </el-tag>
            <el-tag type="success" v-else-if="scope.row.userType === 1" style="cursor: pointer"
              @click.native="editUser(scope.row)" disable-transitions>
              管理员
            </el-tag>
            <el-tag type="success" v-else style="cursor: pointer" @click.native="editUser(scope.row)"
              disable-transitions>
              普通用户
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" align="center"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="pagination.current"
          :page-size="pagination.size" :total="pagination.total" @current-change="handlePageChange">
        </el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="修改用户类型" :visible.sync="editVisible" width="30%" :before-close="handleClose" :append-to-body="true"
      destroy-on-close center>
      <div class="myCenter">
        <el-radio-group v-model="changeUser.userType">
          <el-radio-button :label="1">管理员</el-radio-button>
          <el-radio-button :label="2">普通用户</el-radio-button>
        </el-radio-group>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="saveEdit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup>
// 引入 Vue Composition API
import { ref, reactive, onMounted } from 'vue'
import useCommon from "@/utils/common";
import { ElMessage, ElMessageBox } from 'element-plus'
import { userList_api, changeUserStatus_api, changeUserType_api, changeUserAdmire_api } from "@/api/admin"

const common = useCommon();

// 分页数据
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
  searchKey: "",
  userStatus: null,
  userType: null
})

// 用户列表
const users = ref([])

// 当前编辑的用户信息
const changeUser = reactive({
  id: null,
  userType: null
})

// 是否显示编辑对话框
const editVisible = ref(false)

/**
 * 获取用户列表
 */
const getUsers = async () => {
  try {
    const res = await userList_api(pagination, true)
    if (!common.isEmpty(res.data)) {
      users.value = res.data.records
      pagination.total = res.data.total
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 清空搜索条件并重新获取用户列表
 */
const clearSearch = () => {
  Object.assign(pagination, {
    current: 1,
    size: 10,
    total: 0,
    searchKey: "",
    userStatus: null,
    userType: null
  })
  getUsers()
}

/**
 * 修改用户状态
 * @param {Object} user 要修改的用户对象
 */
const changeUserStatus = async (user) => {
  try {
    await changeUserStatus_api({
      userId: user.id,
      flag: user.userStatus
    }, true)
    ElMessage.success("修改成功！")
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 修改用户赞赏信息
 * @param {Object} user 要修改的用户对象
 */
const changeUserAdmire = (user) => {
  if (!common.isEmpty(user.admire)) {
    ElMessageBox.confirm('确认保存？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success',
      center: true
    }).then(async () => {
      try {
        await changeUserAdmire_api({
          userId: user.id,
          admire: user.admire
        }, true)
        ElMessage.success("修改成功！")
      } catch (error) {
        ElMessage.error(error.message)
      }
    }).catch(() => {
      ElMessage.success('已取消保存!')
    })
  }
}

/**
 * 打开编辑用户对话框
 * @param {Object} user 要编辑的用户对象
 */
const editUser = (user) => {
  changeUser.id = user.id
  changeUser.userType = user.userType
  editVisible.value = true
}

/**
 * 保存编辑后的用户信息
 */
const saveEdit = async () => {
  try {
    await changeUserType_api({
      userId: this.changeUser.id,
      userType: this.changeUser.userType
    }, true)
    handleClose()
    getUsers()
    ElMessage.success("修改成功！")
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 关闭编辑对话框并重置数据
 */
const handleClose = () => {
  changeUser.id = null
  changeUser.userType = null
  editVisible.value = false
}

/**
 * 搜索用户
 */
const searchUser = () => {
  pagination.current = 1
  pagination.total = 0
  getUsers()
}

/**
 * 分页切换
 * @param {Number} val 新的页码
 */
const handlePageChange = (val) => {
  pagination.current = val
  getUsers()
}

// 生命周期钩子 - 组件创建时获取用户列表
onMounted(() => {
  getUsers()
})
</script>


<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
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
