<template>
  <div>
    <div class="friend-wrap">
      <div class="friend-main">
        <!-- 添加友链 -->
        <div @click="clickLetter()" class="form-wrap">
          <!-- 信封上面 -->
          <img class="before-img" :src="store.sysConfig['webStaticResourcePrefix'] + 'assets/friendLetterTop.png'"
            style="width: 100%" />
          <!-- 信 -->
          <div class="envelope" style="animation: hideToShow 2s">
            <div class="form-main">
              <img :src="store.sysConfig['webStaticResourcePrefix'] + 'assets/friendLetterMiddle.jpg'"
                style="width: 100%" />
              <div>
                <h3 style="text-align: center">有朋自远方来</h3>
                <div>
                  <div class="myCenter form-friend">
                    <div class="user-title">
                      <div>名称：</div>
                      <div>简介：</div>
                      <div>封面：</div>
                      <div>网址：</div>
                    </div>
                    <div class="user-content">
                      <div>
                        <el-input maxlength="30" v-model="friend.title"></el-input>
                      </div>
                      <div>
                        <el-input maxlength="120" v-model="friend.introduction"></el-input>
                      </div>
                      <div>
                        <el-input maxlength="200" v-model="friend.cover"></el-input>
                      </div>
                      <div>
                        <el-input maxlength="200" v-model="friend.url"></el-input>
                      </div>
                    </div>
                  </div>
                  <div class="myCenter" style="margin-top: 20px">
                    <proButton :info="'提交'" @click.native.stop="submitFriend()" :before="constant.before_color_2"
                      :after="constant.after_color_2">
                    </proButton>
                  </div>
                </div>
                <div>
                  <img :src="store.sysConfig['webStaticResourcePrefix'] + 'assets/friendLetterBiLi.png'"
                    style="width: 100%;margin: 5px auto" />
                </div>
                <p style="font-size: 12px;text-align: center;color: #999">欢迎交换友链</p>
              </div>
            </div>
          </div>
          <img class="after-img" :src="store.sysConfig['webStaticResourcePrefix'] + 'assets/friendLetterBottom.png'"
            style="width: 100%" />
        </div>

        <div style="font-size: 20px;font-weight: bold;margin-top: 40px">🌸本站信息</div>
        <div>
          <blockquote>
            <div>网站名称: {{ constant.friendWebName }}</div>
            <div>网址: {{ constant.friendUrl }}</div>
            <div>头像: {{ constant.friendAvatar }}</div>
            <div>描述: {{ constant.friendIntroduction }}</div>
            <div>网站封面: {{ constant.friendCover }}</div>
          </blockquote>
        </div>
        <div style="font-size: 20px;font-weight: bold">🌸申请方式</div>
        <div>
          <blockquote>
            <div>点击上方信封✨✨✨</div>
            <div>不会添加带有广告营销和没有实质性内容的友链🚫🚫🚫</div>
            <div>申请之前请将本网站添加为您的友链哦🎟️🎟️🎟️</div>
          </blockquote>
        </div>

        <hr>

        <h2 style="margin-top: 60px">♥️青出于蓝</h2>
        <card :resourcePathList="friendList['♥️青出于蓝']" @clickResourcePath="clickFriend"></card>

        <hr>

        <h2 style="margin-top: 60px">🥇友情链接</h2>
        <card :resourcePathList="friendList['🥇友情链接']" @clickResourcePath="clickFriend"></card>
      </div>
    </div>
  </div>
</template>

<script setup>
// 引入 Vue Composition API
import { ref, reactive, onMounted } from 'vue'
import { saveFriend_api, getFriends_api } from "@/api/webInfo"
import { ElMessage } from 'element-plus'

import useCommon from "@/utils/common";
import constant from "@/utils/constant"
import useStore from "@/store"

const common = useCommon();
;
const store = useStore();



// 动态引入子组件（等价于 Vue2 的 components）
const card = defineAsyncComponent(() => import('./common/card'))
const proButton = defineAsyncComponent(() => import('./common/proButton'))




// 定义响应式数据（等价于 data）
const friendList = reactive({}) // 好友列表数据
const friend = reactive({        // 表单提交的好友信息
  title: "",
  introduction: "",
  cover: "",
  url: ""
})

/**
 * 点击“写信”按钮时，根据屏幕宽度调整表单容器高度
 */
const clickLetter = () => {
  if (document.body.clientWidth < 700) {
    $(".form-wrap").css({ height: "1000px", top: "-200px" })
  } else {
    $(".form-wrap").css({ height: "1150px", top: "-200px" })
  }
}

/**
 * 提交好友申请表单
 * 验证表单数据完整性后调用后端 API
 */
const submitFriend = async () => {
  // 验证用户是否已登录
  if (common.isEmpty(userStore.currentUser)) {
    ElMessage.error("请先登录！")
    return
  }

  // 验证各字段是否填写
  if (friend.title.trim() === "") {
    ElMessage.warning("你还没写名称呢~")
    return
  }
  if (friend.introduction.trim() === "") {
    ElMessage.warning("你还没写简介呢~")
    return
  }
  if (friend.cover.trim() === "") {
    ElMessage.warning("你还没设置封面呢~")
    return
  }
  if (friend.url.trim() === "") {
    ElMessage.warning("你还没写网址呢~")
    return
  }

  // 调用 API 提交好友信息
  try {
    await saveFriend_api(friend)
    $(".form-wrap").css({ height: "447px", top: "0" }) // 收起表单
    ElMessage.success("提交成功，待管理员审核！")
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 点击好友卡片时，在新标签页打开对应网址
 * @param {string} path - 好友网址
 */
const clickFriend = (path) => {
  window.open(path)
}

/**
 * 获取好友列表数据
 * 调用后端 API 拉取数据
 */
const getFriends = async () => {
  try {
    const response = await getFriends_api()
    if (!common.isEmpty(response.data)) {
      Object.assign(friendList, response.data)
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

// 生命周期：组件挂载后自动获取好友列表
onMounted(() => {
  getFriends()
})
</script>

<style scoped>
.friend-main {
  max-width: 1200px;
  margin: 40px auto;
  border-radius: 10px;
  padding: 40px;
  background: rgba(255, 255, 255, .85);
}

.friend-main h2 {
  font-size: 20px;
}

hr {
  position: relative;
  margin: 40px auto;
  border: 2px dashed var(--lightGreen);
  overflow: visible;
}

hr:before {
  position: absolute;
  top: -14px;
  left: 5%;
  color: var(--lightGreen);
  content: '❄';
  font-size: 30px;
  line-height: 1;
  transition: all 1s ease-in-out;
}

hr:hover:before {
  left: calc(95% - 20px);
}

.form-wrap {
  margin: 0 auto;
  overflow: hidden;
  width: 530px;
  height: 447px;
  position: relative;
  top: 0;
  transition: all 1s ease-in-out .3s;
  z-index: 0;
  cursor: pointer;
}


.before-img {
  position: absolute;
  bottom: 126px;
  left: 0;
  background-repeat: no-repeat;
  width: 530px;
  height: 317px;
  z-index: -100;
}

.after-img {
  position: absolute;
  bottom: -2px;
  left: 0;
  background-repeat: no-repeat;
  width: 530px;
  height: 259px;
  z-index: 100;
}

.friend-wrap {
  color: var(--black);
}

.envelope {
  position: relative;
  margin: 0 auto;
  transition: all 1s ease-in-out .3s;
  padding: 200px 20px 20px;
}

.form-main {
  background: var(--white);
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
}


.user-title {
  text-align: right;
  user-select: none;
}

.user-content {
  text-align: left;
}

.user-title div {
  height: 55px;
  line-height: 55px;
  text-align: center;
}

.user-content>div {
  height: 55px;
  display: flex;
  align-items: center;
}

.user-content>>>.el-input__inner {
  border: none;
  height: 35px;
  background: var(--whiteMask);
}

.form-friend {
  margin-top: 12px;
  background-color: #eee;
  border: #ddd 1px solid;
  padding: 20px 0;
}

blockquote {
  line-height: 2;
  border-left: 0.2rem solid #ed6ea0;
  padding: 10px 1rem;
  background-color: #ffe6fa;
  border-radius: 4px;
  margin: 20px auto;
  color: var(--maxGreyFont);
}

@media screen and (max-width: 700px) {
  .form-wrap {
    width: auto;
  }

  .before-img {
    width: auto;
  }

  .after-img {
    width: auto;
  }
}

@media screen and (max-width: 500px) {
  .friend-main {
    padding: 40px 15px;
  }
}
</style>
