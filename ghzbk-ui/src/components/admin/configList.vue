<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="configDialog = true">新增配置</el-button>
    </div>
    <el-table :data="configList" height="75vh" border class="table" header-cell-class-name="table-header">
      <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
      <el-table-column prop="configName" label="名称" align="center"></el-table-column>
      <el-table-column prop="configKey" label="键名" align="center"></el-table-column>
      <el-table-column prop="configValue" label="键值" align="center"></el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.configType === '1'">私有</span>
          <span v-else-if="scope.row.configType === '2'">公开</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="editConfig(scope.row)">
            编辑
          </el-button>
          <el-button type="text" icon="el-icon-delete" style="color: var(--orangeRed)"
            @click="deleteHandle(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="配置" :visible.sync="configDialog" width="30%" :before-close="handleClose" :append-to-body="true"
      destroy-on-close center>
      <div class="my-dialog">
        <div class="myCenter">
          <el-radio-group v-model="config.configType">
            <el-radio-button label="1">私有</el-radio-button>
            <el-radio-button label="2">公开</el-radio-button>
          </el-radio-group>
        </div>
        <el-input placeholder="请输入名称" v-model="config.configName">
          <template slot="prepend">名称</template>
        </el-input>
        <el-input placeholder="请输入键名" v-model="config.configKey">
          <template slot="prepend">键名</template>
        </el-input>
        <el-input placeholder="请输入键值" v-model="config.configValue">
          <template slot="prepend">键值</template>
        </el-input>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="saveOrEditConfig()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import useStore from "@/store"
import useCommon from "@/utils/common";
import constant from "@/utils/constant"
import { deleteConfig_api, saveOrUpdateConfig_api, listConfig_api } from "@/api/sysConfig"

const common = useCommon();
const store = useStore();
;

// 控制配置弹窗
const configDialog = ref(false)

// 配置列表
const configList = ref([])

// 当前编辑/新增的配置
const config = reactive({
  id: null,
  configName: "",
  configKey: "",
  configValue: "",
  configType: ""
})

/**
 * 获取配置列表
 */
const getConfigInfo = async () => {
  try {
    const res = await listConfig_api({}, true)
    if (!common.isEmpty(res.data)) {
      configList.value = res.data
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 保存或更新配置
 */
const saveOrEditConfig = async () => {
  if (
    common.isEmpty(config.configName) ||
    common.isEmpty(config.configKey) ||
    common.isEmpty(config.configType)
  ) {
    ElMessage.error("请完善所有配置信息！")
    return
  }

  try {
    await saveOrUpdateConfig_api(config, true)
    ElMessage.success("保存成功！")
    getConfigInfo()
    handleClose()
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 编辑配置
 * @param {Object} cfg 要编辑的配置对象
 */
const editConfig = (cfg) => {
  configDialog.value = true
  config.id = cfg.id
  config.configName = cfg.configName
  config.configKey = cfg.configKey
  config.configValue = cfg.configValue
  config.configType = cfg.configType
}

/**
 * 删除配置
 * @param {Number} id 配置ID
 */
const deleteHandle = (id) => {
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
      await deleteConfig_api({ id: id }, true)
      ElMessage.success("删除成功！")
      getConfigInfo()
      handleClose()
    } catch (error) {
      ElMessage.error(error.message)
    }
  }).catch(() => {
    ElMessage.success('已取消删除!')
  })
}

/**
 * 关闭弹窗并清空表单
 */
const handleClose = () => {

  Object.assign(config, {
    id: null,
    configName: "",
    configKey: "",
    configValue: "",
    configType: ""
  })


  configDialog.value = false
}

// 生命周期：组件挂载时加载配置
onMounted(() => {
  getConfigInfo()
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
