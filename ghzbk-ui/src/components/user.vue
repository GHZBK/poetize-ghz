<template>
  <div>
    <!-- 登陆和注册 -->
    <div v-if="common.isEmpty(currentUser)" class="myCenter in-up-container my-animation-hideToShow">
      <!-- 背景图片 -->
      <el-image class="my-el-image" style="position: absolute" v-once lazy
        :src="store.webInfo.randomCover[Math.floor(Math.random() * store.webInfo.randomCover.length)]" fit="cover">
        <div slot="error" class="image-slot"></div>
      </el-image>
      <div class="in-up" id="loginAndRegist">
        <div class="form-container sign-up-container">
          <div class="myCenter">
            <h1>注册</h1>
            <input v-model="username" type="text" maxlength="30" placeholder="用户名">
            <input v-model="password" type="password" maxlength="30" placeholder="密码">
            <input v-model="email" type="email" placeholder="邮箱">
            <input v-model="code" type="text" placeholder="验证码" disabled>
            <a style="margin: 0" href="#" @click="changeDialog('邮箱验证码')">获取验证码</a>
            <button @click="regist()">注册</button>
          </div>
        </div>
        <div class="form-container sign-in-container">
          <div class="myCenter">
            <h1>登录</h1>
            <input v-model="account" type="text" placeholder="用户名/邮箱/手机号">
            <input v-model="password" type="password" placeholder="密码">
            <a href="#" @click="changeDialog('找回密码')">忘记密码？</a>
            <button @click="login()">登录</button>
          </div>
        </div>
        <div class="overlay-container">
          <div class="overlay">
            <div class="overlay-panel myCenter overlay-left">
              <h1>已有帐号？</h1>
              <p>请登录🚀</p>
              <button class="ghost" @click="signIn()">登录</button>
            </div>
            <div class="overlay-panel myCenter overlay-right">
              <h1>没有帐号？</h1>
              <p>立即注册吧😃</p>
              <button class="ghost" @click="signUp()">注册</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户信息 -->
    <div v-else class="user-container myCenter my-animation-hideToShow">
      <!-- 背景图片 -->
      <el-image class="my-el-image" style="position: absolute" v-once lazy
        :src="store.webInfo.randomCover[Math.floor(Math.random() * store.webInfo.randomCover.length)]" fit="cover">
        <div slot="error" class="image-slot"></div>
      </el-image>
      <div class="shadow-box-mini user-info" style="display: flex">
        <div class="user-left">
          <div>
            <el-avatar class="user-avatar" @click.native="changeDialog('修改头像')" :size="60"
              :src="currentUser.avatar"></el-avatar>
          </div>
          <div class="myCenter" style="margin-top: 12px">
            <div class="user-title">
              <div>用户名：</div>
              <div>手机号：</div>
              <div>邮箱：</div>
              <div>性别：</div>
              <div>简介：</div>
            </div>
            <div class="user-content">
              <div>
                <el-input maxlength="30" v-model="currentUser.username"></el-input>
              </div>
              <div>
                <div v-if="!common.isEmpty(currentUser.phoneNumber)">
                  {{ currentUser.phoneNumber }} <span class="changeInfo" @click="changeDialog('修改手机号')">修改（功能未接入）</span>
                </div>
                <div v-else><span class="changeInfo" @click="changeDialog('绑定手机号')">绑定手机号（功能未接入）</span></div>
              </div>
              <div>
                <div v-if="!common.isEmpty(currentUser.email)">
                  {{ currentUser.email }} <span class="changeInfo" @click="changeDialog('修改邮箱')">修改</span>
                </div>
                <div v-else><span class="changeInfo" @click="changeDialog('绑定邮箱')">绑定邮箱</span></div>
              </div>
              <div>
                <el-radio-group v-model="currentUser.gender">
                  <el-radio :label="0" style="margin-right: 10px">薛定谔的猫</el-radio>
                  <el-radio :label="1" style="margin-right: 10px">男</el-radio>
                  <el-radio :label="2">女</el-radio>
                </el-radio-group>
              </div>
              <div>
                <el-input v-model="currentUser.introduction" maxlength="60" type="textarea" show-word-limit></el-input>
              </div>
            </div>
          </div>
          <div style="margin-top: 20px">
            <proButton :info="'提交'" @click.native="submitUserInfo()" :before="constant.before_color_2"
              :after="constant.after_color_2">
            </proButton>
          </div>
        </div>
        <div class="user-right">

        </div>
      </div>
    </div>


    <el-dialog :title="dialogTitle" :visible.sync="showDialog" width="30%" :before-close="clearDialog"
      :append-to-body="true" :close-on-click-modal="false" center>
      <div class="myCenter" style="flex-direction: column">
        <div>
          <div v-if="dialogTitle === '修改手机号' || dialogTitle === '绑定手机号'">
            <div style="margin-bottom: 5px">手机号：</div>
            <el-input v-model="phoneNumber"></el-input>
            <div style="margin-top: 10px;margin-bottom: 5px">验证码：</div>
            <el-input v-model="code"></el-input>
            <div style="margin-top: 10px;margin-bottom: 5px">密码：</div>
            <el-input v-model="password"></el-input>
          </div>
          <div v-else-if="dialogTitle === '修改邮箱' || dialogTitle === '绑定邮箱'">
            <div style="margin-bottom: 5px">邮箱：</div>
            <el-input v-model="email"></el-input>
            <div style="margin-top: 10px;margin-bottom: 5px">验证码：</div>
            <el-input v-model="code"></el-input>
            <div style="margin-top: 10px;margin-bottom: 5px">密码：</div>
            <el-input v-model="password"></el-input>
          </div>
          <div v-else-if="dialogTitle === '修改头像'">
            <uploadPicture :prefix="'userAvatar'" @addPicture="addPicture" :maxSize="1" :maxNumber="1"></uploadPicture>
          </div>
          <div v-else-if="dialogTitle === '找回密码'">
            <div class="myCenter" style="margin-bottom: 12px">
              <el-radio-group v-model="passwordFlag">
                <el-radio :label="1" style="margin-right: 10px">手机号</el-radio>
                <el-radio :label="2">邮箱</el-radio>
              </el-radio-group>
            </div>
            <div v-if="passwordFlag === 1">
              <div style="margin-bottom: 5px">手机号：</div>
              <el-input v-model="phoneNumber"></el-input>
              <div style="margin-top: 10px;margin-bottom: 5px">验证码：</div>
              <el-input v-model="code"></el-input>
              <div style="margin-top: 10px;margin-bottom: 5px">新密码：</div>
              <el-input maxlength="30" v-model="password"></el-input>
            </div>
            <div v-else-if="passwordFlag === 2">
              <div style="margin-bottom: 5px">邮箱：</div>
              <el-input v-model="email"></el-input>
              <div style="margin-top: 10px;margin-bottom: 5px">验证码：</div>
              <el-input v-model="code"></el-input>
              <div style="margin-top: 10px;margin-bottom: 5px">新密码：</div>
              <el-input maxlength="30" v-model="password"></el-input>
            </div>
          </div>
          <div v-else-if="dialogTitle === '邮箱验证码'">
            <div>
              <div style="margin-bottom: 5px">邮箱：</div>
              <el-input v-model="email"></el-input>
              <div style="margin-top: 10px;margin-bottom: 5px">验证码：</div>
              <el-input v-model="code"></el-input>
            </div>
          </div>
        </div>
        <div style="display: flex;margin-top: 30px" v-show="dialogTitle !== '修改头像'">
          <proButton :info="codeString"
            v-show="dialogTitle === '修改手机号' || dialogTitle === '绑定手机号' || dialogTitle === '修改邮箱' || dialogTitle === '绑定邮箱' || dialogTitle === '找回密码' || dialogTitle === '邮箱验证码'"
            @click.native="getCode()" :before="constant.before_color_1" :after="constant.after_color_1"
            style="margin-right: 20px">
          </proButton>
          <proButton :info="'提交'" @click.native="submitDialog()" :before="constant.before_color_2"
            :after="constant.after_color_2">
          </proButton>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
// 引入 Vue Composition API
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import proButton from '@/components/common/proButton.vue'
import uploadPicture from '@/components/common/uploadPicture.vue'

import useCommon from "@/utils/common";
import constant from "@/utils/constant"
import useStore from "@/store"
import { login_api, updateSecretInfo_api, getCodeForForgetPassword_api, getCodeForBind_api, updateForForgetPassword_api } from "@/api/user"

  ;
const common = useCommon();
const store = useStore();
const router = useRouter()

// 响应式数据
const currentUser = computed(() => store.currentUser)
const username = ref("")
const account = ref("")
const password = ref("")
const phoneNumber = ref("")
const email = ref("")
const avatar = ref("")
const showDialog = ref(false)
const code = ref("")
const dialogTitle = ref("")
const codeString = ref("验证码")
const passwordFlag = ref(null)
let intervalCode = null

/**
 * 上传头像后回调
 * @param {string} res - 上传后的图片 URL
 */
const addPicture = (res) => {
  avatar.value = res
  submitDialog()
}

/**
 * 切换到注册面板
 */
const signUp = () => {
  document.querySelector("#loginAndRegist").classList.add('right-panel-active')
}

/**
 * 切换到登录面板
 */
const signIn = () => {
  document.querySelector("#loginAndRegist").classList.remove('right-panel-active')
}

/**
 * 用户登录
 */
const login = async () => {
  if (common.isEmpty(account.value) || common.isEmpty(password.value)) {
    ElMessage.error("请输入账号或密码！")
    return
  }
  const user = {
    account: account.value.trim(),
    password: common.encrypt(password.value.trim())
  }
  try {
    const res = await login_api(user, false, false)
    if (!common.isEmpty(res.data)) {
      store.loadCurrentUser(res.data)
      localStorage.setItem("userToken", res.data.accessToken)
      account.value = ""
      password.value = ""
      router.push({ path: '/' })
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 用户注册
 */
const regist = async () => {
  if (common.isEmpty(username.value) || common.isEmpty(password.value)) {
    ElMessage.error("请输入用户名或密码！")
    return
  }
  if (dialogTitle.value === "邮箱验证码" && common.isEmpty(email.value)) {
    ElMessage.error("请输入邮箱！")
    return
  }
  if (common.isEmpty(code.value)) {
    ElMessage.error("请输入验证码！")
    return
  }
  if (username.value.includes(" ") || password.value.includes(" ")) {
    ElMessage.error("用户名或密码不能包含空格！")
    return
  }
  const user = {
    username: username.value.trim(),
    code: code.value.trim(),
    password: common.encrypt(password.value.trim())
  }
  if (dialogTitle.value === "邮箱验证码") {
    user.email = email.value
  }
  try {
    const res = await register_api(user)
    if (!common.isEmpty(res.data)) {
      store.loadCurrentUser(res.data)
      localStorage.setItem("userToken", res.data.accessToken)
      username.value = ""
      password.value = ""
      router.push({ path: '/' })
      const userToken = common.encrypt(localStorage.getItem("userToken"))
      window.open(constant.imBaseURL + "?userToken=" + userToken);
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 修改用户信息
 */
const submitUserInfo = async () => {
  if (!checkParameters()) return

  // 构建用户对象
  const user = {
    username: currentUser.value.username,
    gender: currentUser.value.gender
  }

  // 和原版一样：非空再 trim
  if (!common.isEmpty(currentUser.value.introduction)) {
    user.introduction = currentUser.value.introduction.trim()
  }

  try {
    // 确认提示
    await ElMessageBox.confirm('确认保存？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success',
      center: true
    })

    // 调用接口
    const res = await updateUserInfo_api(user)

    if (!common.isEmpty(res.data)) {
      store.loadCurrentUser(res.data)
      currentUser.value = store.currentUser
      ElMessage.success("修改成功！")
    }
  } catch (error) {
    // 判断是取消还是请求错误
    if (error === 'cancel') {
      ElMessage({
        type: 'success',
        message: '已取消保存!'
      })
    } else {
      ElMessage.error(error.message)
    }
  }
}


function checkParams(params) {
  if (dialogTitle.value === "修改手机号" || dialogTitle.value === "绑定手机号" || (dialogTitle.value === "找回密码" && passwordFlag.value === 1)) {
    params.flag = 1;
    if (common.isEmpty(phoneNumber.value)) {
      ElMessage.error("请输入手机号！")
      return false;
    }
    if (!(/^1[345789]\d{9}$/.test(phoneNumber.value))) {
      ElMessage.error("手机号格式有误！")
      return false;
    }
    params.place = phoneNumber.value;
    return true;
  } else if (dialogTitle.value === "修改邮箱" || dialogTitle.value === "绑定邮箱" || dialogTitle.value === "邮箱验证码" || (dialogTitle.value === "找回密码" && passwordFlag.value === 2)) {
    params.flag = 2;
    if (common.isEmpty(email.value)) {
      ElMessage.error("请输入邮箱！")
      return false;
    }
    if (!(/^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/.test(email.value))) {
      ElMessage.error("邮箱格式有误！")
      return false;
    }
    params.place = email.value;
    return true;
  }
  return false;
}


/**
 * 检查用户名是否合法
 */
const checkParameters = () => {
  if (common.isEmpty(currentUser.value.username)) {
    ElMessage.error("请输入用户名！")
    return false
  }
  if (currentUser.value.username.includes(" ")) {
    ElMessage.error("用户名不能包含空格！")
    return false
  }
  return true
}

/**
 * 修改对话框内容
 * @param {string} value - 对话框标题
 */
const changeDialog = (value) => {
  if (value === "邮箱验证码" && (common.isEmpty(email.value) || !/^\w+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email.value))) {
    ElMessage.error("请输入有效邮箱！")
    return
  }
  dialogTitle.value = value
  showDialog.value = true
}

/**
 * 提交对话框（修改头像、绑定手机号/邮箱、找回密码）
 */
const submitDialog = () => {
  if (dialogTitle.value === "修改头像") {
    if (common.isEmpty(avatar.value)) {
      ElMessage.error("请上传头像！")
    } else {
      updateUserInfo({ avatar: avatar.value.trim() })
    }
  } else if (
    ["修改手机号", "绑定手机号", "修改邮箱", "绑定邮箱"].includes(dialogTitle.value)
  ) {
    updateSecretInfo()
  } else if (dialogTitle.value === "找回密码") {
    if (passwordFlag.value !== 1 && passwordFlag.value !== 2) {
      ElMessage.error("请选择找回方式！")
    } else {
      updateSecretInfo()
    }
  } else if (dialogTitle.value === "邮箱验证码") {
    showDialog.value = false
  }
}

/**
 * 更新用户敏感信息（密码、手机号、邮箱）
 */
const updateSecretInfo = async () => {
  if (common.isEmpty(code.value)) {
    ElMessage.error("请输入验证码！")
    return
  }
  if (common.isEmpty(password.value)) {
    ElMessage.error("请输入密码！")
    return
  }
  const params = {
    code: code.value.trim(),
    password: common.encrypt(password.value.trim())
  }

  if (!checkParams(params)) {
    return;
  }

  if (this.dialogTitle === "找回密码") {
    await updateForForgetPassword_api(params, false, false)
    clearDialog();
    ElMessage.success("修改成功，请重新登陆！")


  } else {
    await updateSecretInfo_api(params, false, false);
    if (!common.isEmpty(res.data)) {
      store.loadCurrentUser(res.data)
      currentUser = store.currentUser;
      clearDialog();
      ElMessage.success("修改成功！")
    }

  }
}

/**
 * 获取验证码
 */
const getCode = () => {
  if (codeString.value === "验证码") {
    const params = {};
    if (!checkParams(params)) return;

    const apiCall = dialogTitle.value.includes("找回")
      ? getCodeForForgetPassword_api
      : getCodeForBind_api;

    apiCall(params).then(() => {
      ElMessage.success("验证码已发送，请注意查收！");
    }).catch(error => {
      ElMessage.error(error.message);
    });

    codeString.value = "30";
    intervalCode = setInterval(() => {
      if (codeString.value === "0") {
        clearInterval(intervalCode);
        codeString.value = "验证码";
      } else {
        codeString.value = String(parseInt(codeString.value) - 1);
      }
    }, 1000);
  } else {
    ElMessage.warning("请稍后再试！");
  }
};

/**
 * 清空对话框数据
 */
const clearDialog = () => {
  password.value = ""
  phoneNumber.value = ""
  email.value = ""
  avatar.value = ""
  showDialog.value = false
  code.value = ""
  dialogTitle.value = ""
  passwordFlag.value = null
  if (intervalCode) {
    clearInterval(intervalCode)
    codeString.value = "验证码"
  }
}
</script>

<style scoped>
.in-up-container {
  height: 100vh;
  position: relative;
}

.in-up {
  opacity: 0.9;
  border-radius: 10px;
  box-shadow: 0 15px 30px var(--miniMask), 0 10px 10px var(--miniMask);
  position: relative;
  overflow: hidden;
  width: 750px;
  max-width: 100%;
  min-height: 450px;
  margin: 10px;
}

.in-up p {
  font-size: 14px;
  letter-spacing: 1px;
  margin: 20px 0 30px 0;
}

.in-up a {
  color: var(--black);
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
}

.form-container {
  position: absolute;
  height: 100%;
  transition: all 0.5s ease-in-out;
}

.sign-in-container {
  left: 0;
  width: 50%;
}

.sign-up-container {
  left: 0;
  width: 50%;
  opacity: 0;
}

.form-container div {
  background: var(--white);
  flex-direction: column;
  padding: 0 20px;
  height: 100%;
}

.form-container input {
  background: var(--maxLightGray);
  border-radius: 2px;
  border: none;
  padding: 12px 15px;
  margin: 10px 0;
  width: 100%;
  outline: none;
}

.in-up button {
  border-radius: 2rem;
  border: none;
  background: var(--lightRed);
  color: var(--white);
  font-size: 16px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 2px;
  cursor: pointer;
}

.in-up button:hover {
  animation: scale 0.8s ease-in-out;
}

.in-up button.ghost {
  background: transparent;
  border: 1px solid var(--white);
}

.sign-up-container button {
  margin-top: 20px;
}

.overlay-container {
  position: absolute;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: all 0.5s ease-in-out;
}

.overlay {
  background: var(--gradualRed);
  color: var(--white);
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
}

.overlay-panel {
  position: absolute;
  top: 0;
  flex-direction: column;
  height: 100%;
  width: 50%;
  transition: all 0.5s ease-in-out;
}

.overlay-right {
  right: 0;
  transform: translateY(0);
}

.overlay-left {
  transform: translateY(-20%);
}

.in-up.right-panel-active .sign-in-container {
  transform: translateY(100%);
}

.in-up.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

.in-up.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
}

.in-up.right-panel-active .overlay {
  transform: translateX(50%);
}

.in-up.right-panel-active .overlay-left {
  transform: translateY(0);
}

.in-up.right-panel-active .overlay-right {
  transform: translateY(20%);
}

.user-container {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.user-info {
  width: 80%;
  z-index: 10;
  margin-top: 70px;
  height: calc(100vh - 90px);
  margin-bottom: 20px;
  border-radius: 10px;
  overflow: hidden;
}

.user-left {
  width: 50%;
  background: var(--maxMaxWhiteMask);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  padding: 20px;
}

.user-right {
  width: 50%;
  background: var(--maxWhiteMask);
  padding: 20px;
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

.user-content>>>.el-input__inner,
.user-content>>>.el-textarea__inner {
  border: none;
  background: var(--whiteMask);
}

.user-content>>>.el-input__count {
  background: var(--transparent);
  user-select: none;
}

.changeInfo {
  color: var(--white);
  font-size: 0.75rem;
  cursor: pointer;
  background: var(--themeBackground);
  padding: 3px;
  border-radius: 0.2rem;
  user-select: none;
}

@media screen and (max-width: 920px) {
  .user-info {
    width: 90%;
  }

  .user-left {
    width: 100%;
  }

  .user-right {
    display: none;
  }
}
</style>
