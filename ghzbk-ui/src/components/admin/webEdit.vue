<template>
  <div>
    <div>
      <el-tag effect="dark" class="my-tag">
        <svg viewBox="0 0 1024 1024" width="20" height="20" style="vertical-align: -4px;">
          <path
            d="M767.1296 808.6528c16.8448 0 32.9728 2.816 48.0256 8.0384 20.6848 7.1168 43.52 1.0752 57.1904-15.9744a459.91936 459.91936 0 0 0 70.5024-122.88c7.8336-20.48 1.0752-43.264-15.9744-57.088-49.6128-40.192-65.0752-125.3888-31.3856-185.856a146.8928 146.8928 0 0 1 30.3104-37.9904c16.2304-14.5408 22.1696-37.376 13.9264-57.6a461.27104 461.27104 0 0 0-67.5328-114.9952c-13.6192-16.9984-36.4544-22.9376-57.0368-15.8208a146.3296 146.3296 0 0 1-48.0256 8.0384c-70.144 0-132.352-50.8928-145.2032-118.7328-4.096-21.6064-20.736-38.5536-42.4448-41.8304-22.0672-3.2768-44.6464-5.0176-67.6864-5.0176-21.4528 0-42.5472 1.536-63.232 4.4032-22.3232 3.1232-40.2432 20.48-43.52 42.752-6.912 46.6944-36.0448 118.016-145.7152 118.4256-17.3056 0.0512-33.8944-2.9696-49.3056-8.448-21.0432-7.4752-44.3904-1.4848-58.368 15.9232A462.14656 462.14656 0 0 0 80.4864 348.16c-7.6288 20.0192-2.7648 43.008 13.4656 56.9344 55.5008 47.8208 71.7824 122.88 37.0688 185.1392a146.72896 146.72896 0 0 1-31.6416 39.168c-16.8448 14.7456-23.0912 38.1952-14.5408 58.9312 16.896 41.0112 39.5776 79.0016 66.9696 113.0496 13.9264 17.3056 37.2736 23.1936 58.2144 15.7184 15.4112-5.4784 32-8.4992 49.3056-8.4992 71.2704 0 124.7744 49.408 142.1312 121.2928 4.9664 20.48 21.4016 36.0448 42.24 39.168 22.2208 3.328 44.9536 5.0688 68.096 5.0688 23.3984 0 46.4384-1.792 68.864-5.1712 21.3504-3.2256 38.144-19.456 42.7008-40.5504 14.8992-68.8128 73.1648-119.7568 143.7696-119.7568z"
            fill="#8C7BFD"></path>
          <path
            d="M511.8464 696.3712c-101.3248 0-183.7568-82.432-183.7568-183.7568s82.432-183.7568 183.7568-183.7568 183.7568 82.432 183.7568 183.7568-82.432 183.7568-183.7568 183.7568z m0-265.1648c-44.8512 0-81.3568 36.5056-81.3568 81.3568S466.9952 593.92 511.8464 593.92s81.3568-36.5056 81.3568-81.3568-36.5056-81.3568-81.3568-81.3568z"
            fill="#FFE37B"></path>
        </svg>
        基础信息
      </el-tag>
      <el-form :model="webInfo" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="网站名称" prop="webName">
          <el-input v-model="webInfo.webName"></el-input>
        </el-form-item>

        <el-form-item label="网站标题" prop="webTitle">
          <el-input v-model="webInfo.webTitle"></el-input>
        </el-form-item>

        <el-form-item label="页脚" prop="footer">
          <el-input v-model="webInfo.footer"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-switch @click.native="changeWebStatus(webInfo)" v-model="webInfo.status"></el-switch>
        </el-form-item>

        <el-form-item label="背景" prop="backgroundImage">
          <div style="display: flex">
            <el-input v-model="webInfo.backgroundImage"></el-input>
            <el-image lazy class="table-td-thumb" style="margin-left: 10px"
              :preview-src-list="[webInfo.backgroundImage]" :src="webInfo.backgroundImage" fit="cover"></el-image>
          </div>
          <uploadPicture :isAdmin="true" :prefix="'webBackgroundImage'" style="margin-top: 15px"
            @addPicture="addBackgroundImage" :maxSize="3" :maxNumber="1"></uploadPicture>
        </el-form-item>

        <el-form-item label="头像" prop="avatar">
          <div style="display: flex">
            <el-input v-model="webInfo.avatar"></el-input>
            <el-image lazy class="table-td-thumb" style="margin-left: 10px" :preview-src-list="[webInfo.avatar]"
              :src="webInfo.avatar" fit="cover"></el-image>
          </div>
          <uploadPicture :isAdmin="true" :prefix="'webAvatar'" style="margin-top: 15px" @addPicture="addAvatar"
            :maxSize="2" :maxNumber="1"></uploadPicture>
        </el-form-item>

        <el-form-item label="提示" prop="waifuJson">
          <div style="display: flex">
            <el-input :disabled="disabled" :rows="6" type="textarea" v-model="webInfo.waifuJson"></el-input>
            <i class="el-icon-edit my-icon" @click="disabled = !disabled"></i>
          </div>
        </el-form-item>
      </el-form>
      <div class="myCenter" style="margin-bottom: 22px">
        <el-button type="primary" @click="submitForm('ruleForm')">保存基本信息</el-button>
      </div>
    </div>

    <div>
      <el-tag effect="dark" class="my-tag">
        <svg viewBox="0 0 1024 1024" width="20" height="20" style="vertical-align: -4px;">
          <path
            d="M767.1296 808.6528c16.8448 0 32.9728 2.816 48.0256 8.0384 20.6848 7.1168 43.52 1.0752 57.1904-15.9744a459.91936 459.91936 0 0 0 70.5024-122.88c7.8336-20.48 1.0752-43.264-15.9744-57.088-49.6128-40.192-65.0752-125.3888-31.3856-185.856a146.8928 146.8928 0 0 1 30.3104-37.9904c16.2304-14.5408 22.1696-37.376 13.9264-57.6a461.27104 461.27104 0 0 0-67.5328-114.9952c-13.6192-16.9984-36.4544-22.9376-57.0368-15.8208a146.3296 146.3296 0 0 1-48.0256 8.0384c-70.144 0-132.352-50.8928-145.2032-118.7328-4.096-21.6064-20.736-38.5536-42.4448-41.8304-22.0672-3.2768-44.6464-5.0176-67.6864-5.0176-21.4528 0-42.5472 1.536-63.232 4.4032-22.3232 3.1232-40.2432 20.48-43.52 42.752-6.912 46.6944-36.0448 118.016-145.7152 118.4256-17.3056 0.0512-33.8944-2.9696-49.3056-8.448-21.0432-7.4752-44.3904-1.4848-58.368 15.9232A462.14656 462.14656 0 0 0 80.4864 348.16c-7.6288 20.0192-2.7648 43.008 13.4656 56.9344 55.5008 47.8208 71.7824 122.88 37.0688 185.1392a146.72896 146.72896 0 0 1-31.6416 39.168c-16.8448 14.7456-23.0912 38.1952-14.5408 58.9312 16.896 41.0112 39.5776 79.0016 66.9696 113.0496 13.9264 17.3056 37.2736 23.1936 58.2144 15.7184 15.4112-5.4784 32-8.4992 49.3056-8.4992 71.2704 0 124.7744 49.408 142.1312 121.2928 4.9664 20.48 21.4016 36.0448 42.24 39.168 22.2208 3.328 44.9536 5.0688 68.096 5.0688 23.3984 0 46.4384-1.792 68.864-5.1712 21.3504-3.2256 38.144-19.456 42.7008-40.5504 14.8992-68.8128 73.1648-119.7568 143.7696-119.7568z"
            fill="#8C7BFD"></path>
          <path
            d="M511.8464 696.3712c-101.3248 0-183.7568-82.432-183.7568-183.7568s82.432-183.7568 183.7568-183.7568 183.7568 82.432 183.7568 183.7568-82.432 183.7568-183.7568 183.7568z m0-265.1648c-44.8512 0-81.3568 36.5056-81.3568 81.3568S466.9952 593.92 511.8464 593.92s81.3568-36.5056 81.3568-81.3568-36.5056-81.3568-81.3568-81.3568z"
            fill="#FFE37B"></path>
        </svg>
        公告
      </el-tag>
      <el-tag :key="i" v-for="(notice, i) in notices" closable :disable-transitions="false"
        @close="handleClose(notices, notice)">
        {{ notice }}
      </el-tag>
      <el-input class="input-new-tag" v-if="inputNoticeVisible" v-model="inputNoticeValue" ref="saveNoticeInput"
        size="small" @keyup.enter.native="handleInputNoticeConfirm" @blur="handleInputNoticeConfirm">
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showNoticeInput()">+ 公告</el-button>
      <div class="myCenter" style="margin-bottom: 22px">
        <el-button type="primary" @click="saveNotice()">保存公告</el-button>
      </div>
    </div>

    <div>
      <el-tag effect="dark" class="my-tag">
        <svg viewBox="0 0 1024 1024" width="20" height="20" style="vertical-align: -4px;">
          <path
            d="M767.1296 808.6528c16.8448 0 32.9728 2.816 48.0256 8.0384 20.6848 7.1168 43.52 1.0752 57.1904-15.9744a459.91936 459.91936 0 0 0 70.5024-122.88c7.8336-20.48 1.0752-43.264-15.9744-57.088-49.6128-40.192-65.0752-125.3888-31.3856-185.856a146.8928 146.8928 0 0 1 30.3104-37.9904c16.2304-14.5408 22.1696-37.376 13.9264-57.6a461.27104 461.27104 0 0 0-67.5328-114.9952c-13.6192-16.9984-36.4544-22.9376-57.0368-15.8208a146.3296 146.3296 0 0 1-48.0256 8.0384c-70.144 0-132.352-50.8928-145.2032-118.7328-4.096-21.6064-20.736-38.5536-42.4448-41.8304-22.0672-3.2768-44.6464-5.0176-67.6864-5.0176-21.4528 0-42.5472 1.536-63.232 4.4032-22.3232 3.1232-40.2432 20.48-43.52 42.752-6.912 46.6944-36.0448 118.016-145.7152 118.4256-17.3056 0.0512-33.8944-2.9696-49.3056-8.448-21.0432-7.4752-44.3904-1.4848-58.368 15.9232A462.14656 462.14656 0 0 0 80.4864 348.16c-7.6288 20.0192-2.7648 43.008 13.4656 56.9344 55.5008 47.8208 71.7824 122.88 37.0688 185.1392a146.72896 146.72896 0 0 1-31.6416 39.168c-16.8448 14.7456-23.0912 38.1952-14.5408 58.9312 16.896 41.0112 39.5776 79.0016 66.9696 113.0496 13.9264 17.3056 37.2736 23.1936 58.2144 15.7184 15.4112-5.4784 32-8.4992 49.3056-8.4992 71.2704 0 124.7744 49.408 142.1312 121.2928 4.9664 20.48 21.4016 36.0448 42.24 39.168 22.2208 3.328 44.9536 5.0688 68.096 5.0688 23.3984 0 46.4384-1.792 68.864-5.1712 21.3504-3.2256 38.144-19.456 42.7008-40.5504 14.8992-68.8128 73.1648-119.7568 143.7696-119.7568z"
            fill="#8C7BFD"></path>
          <path
            d="M511.8464 696.3712c-101.3248 0-183.7568-82.432-183.7568-183.7568s82.432-183.7568 183.7568-183.7568 183.7568 82.432 183.7568 183.7568-82.432 183.7568-183.7568 183.7568z m0-265.1648c-44.8512 0-81.3568 36.5056-81.3568 81.3568S466.9952 593.92 511.8464 593.92s81.3568-36.5056 81.3568-81.3568-36.5056-81.3568-81.3568-81.3568z"
            fill="#FFE37B"></path>
        </svg>
        随机名称
      </el-tag>
      <el-tag :key="i" effect="dark" v-for="(name, i) in randomName" closable :disable-transitions="false"
        :type="types[Math.floor(Math.random() * 5)]" @close="handleClose(randomName, name)">
        {{ name }}
      </el-tag>
      <el-input class="input-new-tag" v-if="inputRandomNameVisible" v-model="inputRandomNameValue"
        ref="saveRandomNameInput" size="small" @keyup.enter.native="handleInputRandomNameConfirm"
        @blur="handleInputRandomNameConfirm">
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showRandomNameInput">+ 随机名称</el-button>
      <div class="myCenter" style="margin-bottom: 22px">
        <el-button type="primary" @click="saveRandomName()">保存随机名称</el-button>
      </div>
    </div>

    <div>
      <el-tag effect="dark" class="my-tag">
        <svg viewBox="0 0 1024 1024" width="20" height="20" style="vertical-align: -4px;">
          <path
            d="M767.1296 808.6528c16.8448 0 32.9728 2.816 48.0256 8.0384 20.6848 7.1168 43.52 1.0752 57.1904-15.9744a459.91936 459.91936 0 0 0 70.5024-122.88c7.8336-20.48 1.0752-43.264-15.9744-57.088-49.6128-40.192-65.0752-125.3888-31.3856-185.856a146.8928 146.8928 0 0 1 30.3104-37.9904c16.2304-14.5408 22.1696-37.376 13.9264-57.6a461.27104 461.27104 0 0 0-67.5328-114.9952c-13.6192-16.9984-36.4544-22.9376-57.0368-15.8208a146.3296 146.3296 0 0 1-48.0256 8.0384c-70.144 0-132.352-50.8928-145.2032-118.7328-4.096-21.6064-20.736-38.5536-42.4448-41.8304-22.0672-3.2768-44.6464-5.0176-67.6864-5.0176-21.4528 0-42.5472 1.536-63.232 4.4032-22.3232 3.1232-40.2432 20.48-43.52 42.752-6.912 46.6944-36.0448 118.016-145.7152 118.4256-17.3056 0.0512-33.8944-2.9696-49.3056-8.448-21.0432-7.4752-44.3904-1.4848-58.368 15.9232A462.14656 462.14656 0 0 0 80.4864 348.16c-7.6288 20.0192-2.7648 43.008 13.4656 56.9344 55.5008 47.8208 71.7824 122.88 37.0688 185.1392a146.72896 146.72896 0 0 1-31.6416 39.168c-16.8448 14.7456-23.0912 38.1952-14.5408 58.9312 16.896 41.0112 39.5776 79.0016 66.9696 113.0496 13.9264 17.3056 37.2736 23.1936 58.2144 15.7184 15.4112-5.4784 32-8.4992 49.3056-8.4992 71.2704 0 124.7744 49.408 142.1312 121.2928 4.9664 20.48 21.4016 36.0448 42.24 39.168 22.2208 3.328 44.9536 5.0688 68.096 5.0688 23.3984 0 46.4384-1.792 68.864-5.1712 21.3504-3.2256 38.144-19.456 42.7008-40.5504 14.8992-68.8128 73.1648-119.7568 143.7696-119.7568z"
            fill="#8C7BFD"></path>
          <path
            d="M511.8464 696.3712c-101.3248 0-183.7568-82.432-183.7568-183.7568s82.432-183.7568 183.7568-183.7568 183.7568 82.432 183.7568 183.7568-82.432 183.7568-183.7568 183.7568z m0-265.1648c-44.8512 0-81.3568 36.5056-81.3568 81.3568S466.9952 593.92 511.8464 593.92s81.3568-36.5056 81.3568-81.3568-36.5056-81.3568-81.3568-81.3568z"
            fill="#FFE37B"></path>
        </svg>
        随机头像
      </el-tag>
      <div :key="i" style="display: flex" v-for="(avatar, i) in randomAvatar">
        <el-tag style="white-space: normal;height: unset" closable :disable-transitions="false"
          @close="handleClose(randomAvatar, avatar)">
          {{ avatar }}
        </el-tag>
        <div>
          <el-image lazy class="table-td-thumb" style="margin: 10px" :preview-src-list="[avatar]" :src="avatar"
            fit="cover"></el-image>
        </div>
      </div>

      <el-input class="input-new-tag" v-if="inputRandomAvatarVisible" v-model="inputRandomAvatarValue"
        ref="saveRandomAvatarInput" size="small" @keyup.enter.native="handleInputRandomAvatarConfirm"
        @blur="handleInputRandomAvatarConfirm">
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showRandomAvatarInput">+ 随机头像</el-button>
      <uploadPicture :isAdmin="true" :prefix="'randomAvatar'" style="margin: 10px" @addPicture="addRandomAvatar"
        :maxSize="1" :maxNumber="5"></uploadPicture>
      <div class="myCenter" style="margin-bottom: 22px">
        <el-button type="primary" @click="saveRandomAvatar()">保存随机头像</el-button>
      </div>
    </div>

    <div>
      <el-tag effect="dark" class="my-tag">
        <svg viewBox="0 0 1024 1024" width="20" height="20" style="vertical-align: -4px;">
          <path
            d="M767.1296 808.6528c16.8448 0 32.9728 2.816 48.0256 8.0384 20.6848 7.1168 43.52 1.0752 57.1904-15.9744a459.91936 459.91936 0 0 0 70.5024-122.88c7.8336-20.48 1.0752-43.264-15.9744-57.088-49.6128-40.192-65.0752-125.3888-31.3856-185.856a146.8928 146.8928 0 0 1 30.3104-37.9904c16.2304-14.5408 22.1696-37.376 13.9264-57.6a461.27104 461.27104 0 0 0-67.5328-114.9952c-13.6192-16.9984-36.4544-22.9376-57.0368-15.8208a146.3296 146.3296 0 0 1-48.0256 8.0384c-70.144 0-132.352-50.8928-145.2032-118.7328-4.096-21.6064-20.736-38.5536-42.4448-41.8304-22.0672-3.2768-44.6464-5.0176-67.6864-5.0176-21.4528 0-42.5472 1.536-63.232 4.4032-22.3232 3.1232-40.2432 20.48-43.52 42.752-6.912 46.6944-36.0448 118.016-145.7152 118.4256-17.3056 0.0512-33.8944-2.9696-49.3056-8.448-21.0432-7.4752-44.3904-1.4848-58.368 15.9232A462.14656 462.14656 0 0 0 80.4864 348.16c-7.6288 20.0192-2.7648 43.008 13.4656 56.9344 55.5008 47.8208 71.7824 122.88 37.0688 185.1392a146.72896 146.72896 0 0 1-31.6416 39.168c-16.8448 14.7456-23.0912 38.1952-14.5408 58.9312 16.896 41.0112 39.5776 79.0016 66.9696 113.0496 13.9264 17.3056 37.2736 23.1936 58.2144 15.7184 15.4112-5.4784 32-8.4992 49.3056-8.4992 71.2704 0 124.7744 49.408 142.1312 121.2928 4.9664 20.48 21.4016 36.0448 42.24 39.168 22.2208 3.328 44.9536 5.0688 68.096 5.0688 23.3984 0 46.4384-1.792 68.864-5.1712 21.3504-3.2256 38.144-19.456 42.7008-40.5504 14.8992-68.8128 73.1648-119.7568 143.7696-119.7568z"
            fill="#8C7BFD"></path>
          <path
            d="M511.8464 696.3712c-101.3248 0-183.7568-82.432-183.7568-183.7568s82.432-183.7568 183.7568-183.7568 183.7568 82.432 183.7568 183.7568-82.432 183.7568-183.7568 183.7568z m0-265.1648c-44.8512 0-81.3568 36.5056-81.3568 81.3568S466.9952 593.92 511.8464 593.92s81.3568-36.5056 81.3568-81.3568-36.5056-81.3568-81.3568-81.3568z"
            fill="#FFE37B"></path>
        </svg>
        随机封面
      </el-tag>
      <div :key="i" style="display: flex" v-for="(cover, i) in randomCover">
        <el-tag style="white-space: normal;height: unset" closable :disable-transitions="false"
          @close="handleClose(randomCover, cover)">
          {{ cover }}
        </el-tag>
        <div>
          <el-image lazy class="table-td-thumb" style="margin: 10px" :preview-src-list="[cover]" :src="cover"
            fit="cover"></el-image>
        </div>
      </div>

      <el-input class="input-new-tag" v-if="inputRandomCoverVisible" v-model="inputRandomCoverValue"
        ref="saveRandomCoverInput" size="small" @keyup.enter.native="handleInputRandomCoverConfirm"
        @blur="handleInputRandomCoverConfirm">
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showRandomCoverInput">+ 随机封面</el-button>
      <uploadPicture :isAdmin="true" :prefix="'randomCover'" style="margin: 10px" @addPicture="addRandomCover"
        :maxSize="2" :maxNumber="5"></uploadPicture>
      <div class="myCenter" style="margin-bottom: 40px">
        <el-button type="primary" @click="saveRandomCover()">保存随机封面</el-button>
      </div>
    </div>

    <div>
      <el-button type="danger" @click="resetForm('ruleForm')">重置所有修改</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import uploadPicture from '@/components/common/uploadPicture.vue'
import useStore from "@/store"
import useCommon from "@/utils/common";
import { updateWebInfo_api } from "@/api/webInfo"

const ruleForm = ref();
const saveNoticeInput = ref();
const saveRandomNameInput = ref();
const saveRandomAvatarInput = ref();
const saveRandomCoverInput = ref();

const common = useCommon();
const store = useStore();




// 表单数据
const disabled = ref(true)
const types = ['', 'success', 'info', 'danger', 'warning']
const inputNoticeVisible = ref(false)
const inputNoticeValue = ref("")
const inputRandomNameVisible = ref(false)
const inputRandomNameValue = ref("")
const inputRandomAvatarVisible = ref(false)
const inputRandomAvatarValue = ref("")
const inputRandomCoverVisible = ref(false)
const inputRandomCoverValue = ref("")
const webInfo = reactive({
  id: null,
  webName: "",
  webTitle: "",
  footer: "",
  backgroundImage: "",
  avatar: "",
  waifuJson: "",
  status: false
})
const notices = ref([])
const randomAvatar = ref([])
const randomName = ref([])
const randomCover = ref([])

const rules = {
  webName: [
    { required: true, message: '请输入网站名称', trigger: 'blur' },
    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change' }
  ],
  webTitle: [
    { required: true, message: '请输入网站标题', trigger: 'blur' }
  ],
  footer: [
    { required: true, message: '请输入页脚', trigger: 'blur' }
  ],
  backgroundImage: [
    { required: true, message: '请输入背景', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请设置网站状态', trigger: 'change' }
  ],
  avatar: [
    { required: true, message: '请上传头像', trigger: 'change' }
  ]
}

// 获取网站信息
const getWebInfo = async () => {
  try {
    const res = await updateWebInfo_api({}, true)
    if (!common.isEmpty(res.data)) {
      Object.assign(webInfo, res.data)
      notices.value = JSON.parse(res.data.notices || '[]')
      randomAvatar.value = JSON.parse(res.data.randomAvatar || '[]')
      randomName.value = JSON.parse(res.data.randomName || '[]')
      randomCover.value = JSON.parse(res.data.randomCover || '[]')
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

// 更新网站信息
const updateWebInfo = (value) => {
  ElMessageBox.confirm('确认保存？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success',
    center: true
  }).then(async () => {
    try {
      await updateWebInfo_api(value, true)
      getWebInfo()
      ElMessage.success('保存成功！')
    } catch (error) {
      ElMessage.error(error.message)
    }
  }).catch(() => {
    ElMessage.success('已取消保存!')
  })
}

// 修改网站状态
const changeWebStatus = async (webInfo) => {
  try {
    await updateWebInfo_api({
      id: webInfo.id,
      status: webInfo.status
    }, true)

    getWebInfo();
    ElMessage.success('保存成功！');
  } catch (error) {
    ElMessage.error(error.message);
  }
}

// 添加图片
const addBackgroundImage = (res) => {
  webInfo.backgroundImage = res
}
const addAvatar = (res) => {
  webInfo.avatar = res
}
const addRandomAvatar = (res) => {
  randomAvatar.value.push(res)
}
const addRandomCover = (res) => {
  randomCover.value.push(res)
}

// 删除数组项
const handleClose = (array, item) => {
  array.splice(array.indexOf(item), 1)
}

// 公告管理
const handleInputNoticeConfirm = () => {
  if (inputNoticeValue.value) {
    notices.value.push(inputNoticeValue.value)
  }
  inputNoticeVisible.value = false
  inputNoticeValue.value = ''
}
const showNoticeInput = () => {
  inputNoticeVisible.value = true
  nextTick(() => {
    saveNoticeInput.value.focus()
  })
}
const saveNotice = () => {
  updateWebInfo({
    id: webInfo.id,
    notices: JSON.stringify(notices.value)
  })
}

// 随机名称管理
const handleInputRandomNameConfirm = () => {
  if (inputRandomNameValue.value) {
    randomName.value.push(inputRandomNameValue.value)
  }
  inputRandomNameVisible.value = false
  inputRandomNameValue.value = ''
}
const showRandomNameInput = () => {
  inputRandomNameVisible.value = true
  nextTick(() => {
    saveRandomNameInput.value?.focus()
  })
}
const saveRandomName = () => {
  updateWebInfo({
    id: webInfo.id,
    randomName: JSON.stringify(randomName.value)
  })
}

// 随机头像管理
const handleInputRandomAvatarConfirm = () => {
  if (inputRandomAvatarValue.value) {
    randomAvatar.value.push(inputRandomAvatarValue.value)
  }
  inputRandomAvatarVisible.value = false
  inputRandomAvatarValue.value = ''
}
const showRandomAvatarInput = () => {
  inputRandomAvatarVisible.value = true
  nextTick(() => {
    saveRandomAvatarInput.value.focus()
  })
}
const saveRandomAvatar = () => {
  updateWebInfo({
    id: webInfo.id,
    randomAvatar: JSON.stringify(randomAvatar.value)
  })
}

// 随机封面管理
const handleInputRandomCoverConfirm = () => {
  if (inputRandomCoverValue.value) {
    randomCover.value.push(inputRandomCoverValue.value)
  }
  inputRandomCoverVisible.value = false
  inputRandomCoverValue.value = ''
}
const showRandomCoverInput = () => {
  inputRandomCoverVisible.value = true
  nextTick(() => {
    saveRandomCoverInput.value.focus();
  })
}
const saveRandomCover = () => {
  updateWebInfo({
    id: webInfo.id,
    randomCover: JSON.stringify(randomCover.value)
  })
}


const submitForm = () => {
  ruleForm.value.validate((valid) => {
    if (valid) {
      updateWebInfo(webInfo)
    } else {
      ElMessage.warning('请完善必填项！')
    }
  });
}

const resetForm = () => {
  ruleForm.value.resetFields();
  getWebInfo();
}

onMounted(() => {
  getWebInfo()
})
</script>


<style scoped>
.my-tag {
  margin-bottom: 20px !important;
  width: 100%;
  text-align: left;
  background: var(--lightYellow);
  border: none;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: var(--black);
}

.el-tag {
  margin: 10px;
}

.button-new-tag {
  margin: 10px;
  height: 32px;
  line-height: 32px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 200px;
  margin: 10px;
}

.my-icon {
  cursor: pointer;
  margin-left: 10px;
  font-size: 18px;
  font-weight: bold;
  color: var(--blue);
}

.table-td-thumb {
  border-radius: 2px;
  width: 40px;
  height: 40px;
}
</style>
