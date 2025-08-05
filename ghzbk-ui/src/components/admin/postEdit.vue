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
      文章信息
    </el-tag>
    <el-form :model="article" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
      <el-form-item label="标题" prop="articleTitle">
        <el-input maxlength="30" v-model="article.articleTitle"></el-input>
      </el-form-item>

      <el-form-item label="视频链接" prop="videoUrl">
        <el-input maxlength="1000" v-model="article.videoUrl"></el-input>
      </el-form-item>

      <el-form-item label="内容" prop="articleContent">
        <mavon-editor ref="md" @imgAdd="imgAdd" v-model="article.articleContent" />
      </el-form-item>

      <el-form-item label="是否启用评论" prop="commentStatus">
        <el-tag :type="article.commentStatus === false ? 'danger' : 'success'" disable-transitions>
          {{ article.commentStatus === false ? '否' : '是' }}
        </el-tag>
        <el-switch v-model="article.commentStatus"></el-switch>
      </el-form-item>

      <el-form-item label="是否推荐" prop="recommendStatus">
        <el-tag :type="article.recommendStatus === false ? 'danger' : 'success'" disable-transitions>
          {{ article.recommendStatus === false ? '否' : '是' }}
        </el-tag>
        <el-switch v-model="article.recommendStatus"></el-switch>
      </el-form-item>

      <el-form-item label="是否可见" prop="viewStatus">
        <el-tag :type="article.viewStatus === false ? 'danger' : 'success'" disable-transitions>
          {{ article.viewStatus === false ? '否' : '是' }}
        </el-tag>
        <el-switch v-model="article.viewStatus"></el-switch>
      </el-form-item>

      <el-form-item v-if="article.viewStatus === false" label="不可见时的访问密码" prop="password">
        <el-input maxlength="30" v-model="article.password"></el-input>
      </el-form-item>

      <el-form-item v-if="article.viewStatus === false" label="密码提示" prop="tips">
        <el-input maxlength="60" v-model="article.tips"></el-input>
      </el-form-item>

      <el-form-item label="封面" prop="articleCover">
        <div style="display: flex">
          <el-input v-model="article.articleCover"></el-input>
          <el-image class="table-td-thumb" lazy style="margin-left: 10px" :preview-src-list="[article.articleCover]"
            :src="article.articleCover" fit="cover"></el-image>
        </div>
        <uploadPicture :isAdmin="true" :prefix="'articleCover'" style="margin-top: 10px" @addPicture="addArticleCover"
          :maxSize="2" :maxNumber="1"></uploadPicture>
      </el-form-item>
      <el-form-item label="分类" prop="sortId">
        <el-select v-model="article.sortId" placeholder="请选择分类">
          <el-option v-for="item in sorts" :key="item.id" :label="item.sortName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签" prop="labelId">
        <el-select v-model="article.labelId" placeholder="请选择标签">
          <el-option v-for="item in labelsTemp" :key="item.id" :label="item.labelName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="myCenter" style="margin-bottom: 22px">
      <el-button type="primary" @click="submitForm(ruleForm)">保存</el-button>
      <el-button type="danger" @click="resetForm(ruleForm)">重置所有修改</el-button>
    </div>
  </div>
</template>

<script setup>
// 引入 Vue Composition API
import { ref, reactive, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useCommon from "@/utils/common";
import constant from "@/utils/constant"
import uploadPicture from '@/components/common/uploadPicture.vue'
// import markdownEditor from '../common/markdownEditor.vue'
import { upload_api } from "@/api/upload"
import { listSortAndLabel_api } from "@/api/webInfo"
import { getArticleById_api } from "@/api/admin"
import { saveArticle_api, updateArticle_api } from "@/api/article"


  ;
const common = useCommon();
const store = useStore();
const route = useRoute()
const router = useRouter()

const ruleForm = ref();


// 响应式数据
const id = ref(route.query.id || null)
const article = reactive({
  articleTitle: "",
  articleContent: "",
  commentStatus: true,
  recommendStatus: false,
  viewStatus: true,
  password: "",
  tips: "",
  articleCover: "",
  videoUrl: "",
  sortId: null,
  labelId: null
})
const sorts = ref([])
const labels = ref([])
const labelsTemp = ref([])
const md = ref(null);

// 表单验证规则
const rules = reactive({
  articleTitle: [{ required: true, message: '请输入标题', trigger: 'change' }],
  articleContent: [{ required: true, message: '请输入内容', trigger: 'change' }],
  commentStatus: [{ required: true, message: '是否启用评论', trigger: 'change' }],
  recommendStatus: [{ required: true, message: '是否推荐', trigger: 'change' }],
  viewStatus: [{ required: true, message: '是否可见', trigger: 'change' }],
  articleCover: [{ required: true, message: '请选择封面', trigger: 'change' }],
  sortId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  labelId: [{ required: true, message: '请选择标签', trigger: 'blur' }]
})

// 监听分类变化，动态过滤标签
watch(
  () => article.sortId,
  (newVal, oldVal) => {
    if (oldVal !== null) article.labelId = null
    if (!common.isEmpty(newVal) && !common.isEmpty(labels.value)) {
      labelsTemp.value = labels.value.filter(l => l.sortId === newVal)
    }
  }
)

// 初始化分类和标签数据
const getSortAndLabel = async () => {
  try {
    const res = await listSortAndLabel_api()
    if (!common.isEmpty(res.data)) {
      sorts.value = res.data.sorts
      labels.value = res.data.labels
      if (!common.isEmpty(id.value)) {
        this.getArticle();
      }
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

// 获取文章详情（编辑模式）
const getArticle = async () => {
  try {
    const res = await getArticleById_api({ id: id.value }, true)
    if (!common.isEmpty(res.data)) {
      Object.assign(article, res.data)
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 图片上传（文章内插入图片）
 */
const imgAdd = (pos, file) => {
  const suffix = file.name.includes('.')
    ? file.name.slice(file.name.lastIndexOf('.'))
    : '';

  const key = `articlePicture/${store.currentAdmin.username.replace(/[^a-zA-Z]/g, '')}${store.currentAdmin.id}${Date.now()}${Math.floor(Math.random() * 1000)}${suffix}`
  const storeType = localStorage.getItem("defaultStoreType")
  const fd = new FormData()
  fd.append("file", file);
  fd.append("originalName", file.name);
  fd.append("key", key);
  fd.append("relativePath", key);
  fd.append("type", "articlePicture");
  fd.append("storeType", storeType);
  storeType === "local" ? saveLocal(pos, fd) : saveQiniu(pos, fd)
}

/**
 * 本地上传图片
 */
const saveLocal = async (pos, fd) => {
  try {
    const res = await upload_api(constant.baseURL + "/resource/upload", fd, true)
    if (!common.isEmpty(res.data)) {
      md.value.$img2Url(pos, res.data)
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 七牛云上传图片
 */
const saveQiniu = async (pos, fd) => {
  try {
    const tokenRes = await uploadQiniu_api('/qiniu/getUpToken', { key: fd.get("key") }, true)
    if (!common.isEmpty(tokenRes.data)) {
      fd.append("token", tokenRes.data)
      const uploadRes = await uploadQiniu(store.sysConfig.qiniuUrl, fd)
      if (!common.isEmpty(uploadRes.key)) {
        const url = store.sysConfig['qiniu.downloadUrl'] + uploadRes.key
        common.saveResource("articlePicture", url, fd.get("file").size, fd.get("file").type, fd.get("file").name, "qiniu", true)

        md.value.$img2Url(pos, url)
      }
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 设置文章封面
 */
const addArticleCover = (res) => {
  article.articleCover = res
}

/**
 * 提交表单
 */
const submitForm = async () => {
  if (!article.viewStatus && common.isEmpty(article.password)) {
    ElMessage.error("文章不可见时必须输入密码！");
    return;
  }

  ruleForm.value.validate(async (valid) => {
    if (valid) {
      const api = id.value ? updateArticle_api : saveArticle_api;
      if (id.value) article.value.id = id.value;
      await saveArticle(article.value, api);
    } else {
      ElMessage.error("请完善必填项！");
    }
  });
};



/**
 * 保存/更新文章
 */
const saveArticle = async (article, fun) => {
  try {
    await ElMessageBox.confirm('确认保存？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success',
      center: true
    });
    await fun(article, true);
    ElMessage.success("保存成功！");
    router.push({ path: '/postList' });
  } catch (error) {
    ElMessage.error(error.message);
  }
};

/**
 * 重置表单
 */
const resetForm = () => {
  md.value.resetFields()
  if (!common.isEmpty(id.value)) {
    getArticle();
  }
}

// 初始化数据
onMounted(getSortAndLabel())
</script>

<style scoped>
.my-tag {
  margin-bottom: 20px;
  width: 100%;
  text-align: left;
  background: var(--lightYellow);
  border: none;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: var(--black);
}

.table-td-thumb {
  border-radius: 2px;
  width: 40px;
  height: 40px;
}

.el-switch {
  margin-left: 10px;
}

.el-form-item {
  margin-bottom: 40px;
}
</style>
