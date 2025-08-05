<template>
  <div>
    <!-- 两句诗 -->
    <div class="my-animation-slide-top">
      <twoPoem></twoPoem>
    </div>

    <div style="background: var(--background);padding-top: 40px;" class="my-animation-slide-bottom">
      <!-- 标签 -->
      <div class="sort-warp shadow-box" v-if="!common.isEmpty(sort) && !common.isEmpty(sort.labels)">
        <div v-for="(label, index) in sort.labels" :key="index"
          :class="{ isActive: !common.isEmpty(labelId) && parseInt(labelId) === label.id }" @click="listArticle(label)">
          <proTag :info="label.labelName + ' ' + label.countOfLabel"
            :color="constant.before_color_list[Math.floor(Math.random() * 6)]" style="margin: 12px">
          </proTag>
        </div>
      </div>

      <!-- 文章 -->
      <div class="article-wrap">
        <articleList :articleList="articles"></articleList>
        <div class="pagination-wrap">
          <div @click="pageArticles()" class="pagination" v-if="pagination.total !== articles.length">
            下一页
          </div>
          <div v-else style="user-select: none">
            ~~到底啦~~
          </div>
        </div>
      </div>
      <!-- 页脚 -->
      <myFooter></myFooter>
    </div>
  </div>
</template>

<script setup>
// 引入 Vue Composition API
import { ref, reactive, watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'

import useCommon from "@/utils/common";
import constant from "@/utils/constant"
import useStore from "@/store"
import { getArticles_api } from "@/api/article"

  ;
const common = useCommon();

// 动态导入组件src/components\sort.vue
const twoPoem = defineAsyncComponent(() => import('@/components/common/twoPoem'))
const proTag = defineAsyncComponent(() => import('@/components/common/proTag'))
const articleList = defineAsyncComponent(() => import('@/components/articleList'))
const myFooter = defineAsyncComponent(() => import('@/components/common/myFooter'))



const store = useStore();
const route = useRoute()

// 响应式数据
const sortId = ref(route.query.sortId)        // 当前分类 ID
const labelId = ref(route.query.labelId)      // 当前标签 ID
const sort = ref(null)                        // 当前分类对象
const articles = ref([])                      // 文章列表

// 分页信息
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
  searchKey: "",
  sortId: sortId.value,
  labelId: labelId.value
})

/**
 * 获取分类信息
 * 根据 sortId 从 Pinia 中查找对应分类
 */
const getSort = () => {
  const sortInfo = store.sortInfo
  if (!common.isEmpty(sortInfo)) {
    const sortArray = sortInfo.filter(f => f.id === parseInt(sortId.value))
    if (!common.isEmpty(sortArray)) {
      sort.value = sortArray[0]
    }
  }
}

/**
 * 获取文章列表
 * 调用后端接口加载文章
 */
const getArticles = async () => {
  try {
    const res = await getArticles_api(pagination)
    if (!common.isEmpty(res.data)) {
      articles.value = articles.value.concat(res.data.records)
      pagination.total = res.data.total
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 分页加载更多文章
 */
const pageArticles = () => {
  pagination.current++
  getArticles()
}

/**
 * 根据标签切换文章列表
 * @param {Object} label - 标签对象
 */
const listArticle = (label) => {
  labelId.value = label.id
  Object.assign(pagination, {
    current: 1,
    size: 10,
    total: 0,
    searchKey: "",
    sortId: route.query.sortId,
    labelId: label.id
  })
  articles.value = []
  nextTick(() => {
    getArticles()
  })
}

// 监听路由变化，重新加载分类和文章数据
watch(route, () => {
  sortId.value = route.query.sortId
  labelId.value = route.query.labelId
  Object.assign(pagination, {
    current: 1,
    size: 10,
    total: 0,
    searchKey: "",
    sortId: sortId.value,
    labelId: labelId.value
  })
  articles.value = []
  getSort()
  getArticles()
})

// 生命周期：页面加载时获取分类和文章
onMounted(() => {
  getSort()
  getArticles()
})
</script>

<style scoped>
.sort-warp {
  width: 70%;
  max-width: 780px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
}

.article-wrap {
  width: 70%;
  margin: 40px auto;
  min-height: 600px;
}

.isActive {
  animation: scale 1.5s ease-in-out infinite;
}

.pagination-wrap {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.pagination {
  padding: 13px 15px;
  border: 1px solid var(--lightGray);
  border-radius: 3rem;
  color: var(--greyFont);
  width: 100px;
  user-select: none;
  cursor: pointer;
  text-align: center;
}

.pagination:hover {
  border: 1px solid var(--themeBackground);
  color: var(--themeBackground);
  box-shadow: 0 0 5px var(--themeBackground);
}


@media screen and (max-width: 900px) {
  .sort-warp {
    width: 90%;
  }

  .article-wrap {
    width: 90%;
  }
}
</style>
