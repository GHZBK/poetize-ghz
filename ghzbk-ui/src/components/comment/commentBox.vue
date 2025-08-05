<template>
  <div>
    <!-- 框 -->
    <textarea class="comment-textarea" v-model="commentContent" placeholder="写下点什么..." maxlength="1000" />
    <!-- 按钮 -->
    <div class="myBetween" style="margin-bottom: 10px">
      <div style="display: flex">
        <div :class="{ 'emoji-active': showEmoji }" @click="showEmoji = !showEmoji">
          <i class="el-icon-orange myEmoji"></i>
        </div>
        <div @click="openPicture()">
          <i class="el-icon-picture myPicture"></i>
        </div>
      </div>

      <div style="display: flex">
        <!--        <proButton :info="'涂鸦'"-->
        <!--                   v-show="!$common.mobile() && !disableGraffiti"-->
        <!--                   @click.native="showGraffiti()"-->
        <!--                   :before="constant.before_color_1"-->
        <!--                   :after="constant.after_color_1"-->
        <!--                   style="margin-right: 6px">-->
        <!--        </proButton>-->
        <proButton :info="'提交'" @click.native="submitComment()" :before="constant.before_color_2"
          :after="constant.after_color_2">
        </proButton>
      </div>
    </div>
    <!-- 表情 -->
    <emoji @addEmoji="addEmoji" :showEmoji="showEmoji"></emoji>

    <el-dialog title="图片" v-model="showPicture" width="25%" :append-to-body="true" :close-on-click-modal="false"
      destroy-on-close center>
      <div>
        <uploadPicture :prefix="'commentPicture'" @addPicture="addPicture" :maxSize="2" :maxNumber="1"></uploadPicture>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
// 引入 Vue Composition API
import { ref, computed, defineEmits } from 'vue'
import useStore from "@/store"
import useCommon from "@/utils/common";
import constant from "@/utils/constant"
import emoji from '@/components/common/emoji.vue'
import proButton from '@/components/common/proButton.vue'
import uploadPicture from '@/components/common/uploadPicture.vue'

// Props 定义
defineProps({
  disableGraffiti: {
    type: Boolean,
    default: false
  }
})

// Emits 定义
const emit = defineEmits(['showGraffiti', 'submitComment'])

const common = useCommon();
const store = useStore();
;

// 响应式数据
const commentContent = ref("")              // 评论内容
const showEmoji = ref(false)                // 是否显示表情面板
const showPicture = ref(false)              // 是否显示图片上传弹窗
const picture = reactive({                  // 当前上传的图片信息
  name: computed(() => store.currentUser.username || '匿名'),
  url: ""
})

/**
 * 打开图片上传面板
 */
const openPicture = () => {
  if (common.isEmpty(store.currentUser)) {
    ElMessage.error("请先登录！")
    return
  }
  showPicture.value = true
}

/**
 * 添加图片到评论
 * @param {string} res 图片上传返回的 URL
 */
const addPicture = (res) => {
  picture.url = res
  savePicture()
}

/**
 * 保存图片到评论内容
 */
const savePicture = () => {
  const imgTag = `[${picture.name},${picture.url}]`
  commentContent.value += imgTag
  picture.url = ""
  showPicture.value = false
}

/**
 * 在评论框插入表情
 * @param {string} key 表情文本
 */
const addEmoji = (key) => {
  commentContent.value += key
}

/**
 * 进入涂鸦模式
 */
const showGraffiti = () => {
  if (common.isEmpty(store.currentUser)) {
    ElMessage.error("请先登录！")
    return
  }
  commentContent.value = ""
  emit('showGraffiti')
}

/**
 * 提交评论
 */
const submitComment = () => {
  if (common.isEmpty(store.currentUser)) {
    ElMessage.error("请先登录！")
    return
  }
  if (commentContent.value.trim() === "") {
    ElMessage.warning("你还没写呢~")
    return
  }
  emit('submitComment', commentContent.value.trim())
  commentContent.value = ""
}
</script>

<style scoped>
.comment-textarea {
  border: 1px solid var(--lightGray);
  width: 100%;
  font-size: 14px;
  padding: 15px;
  min-height: 180px;
  /* 不改变大小 */
  resize: none;
  /* 不改变边框 */
  outline: none;
  border-radius: 4px;
  background-image: var(--commentURL);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: 100%;
  margin-bottom: 10px;
}

.comment-textarea:focus {
  border-color: var(--themeBackground);
}

.myEmoji {
  font-size: 18px;
  cursor: pointer;
  transition: all 0.5s;
  margin-right: 12px;
}

.myEmoji:hover {
  transform: rotate(360deg);
  font-size: 22px;
}

.myPicture {
  font-size: 18px;
  cursor: pointer;
}

.emoji-active {
  color: var(--red);
}
</style>
