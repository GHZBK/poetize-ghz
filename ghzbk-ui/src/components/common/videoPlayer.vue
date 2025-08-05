<template>
  <div>
    <div>
      <video-player class="video-player-box" ref="videoPlayerRef" :options="playerOptions" :playsinline="true"
        @play="onPlayerPlay($event)" @pause="onPlayerPause($event)" @ended="onPlayerEnded($event)"
        @waiting="onPlayerWaiting($event)" @playing="onPlayerPlaying($event)" @loadeddata="onPlayerLoadeddata($event)"
        @timeupdate="onPlayerTimeupdate($event)" @canplay="onPlayerCanplay($event)"
        @canplaythrough="onPlayerCanplaythrough($event)" @statechanged="playerStateChanged($event)"
        @ready="playerReadied($event)">
      </video-player>
    </div>
  </div>
</template>

<script setup>
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
import { ref, reactive, computed, watch } from 'vue'

// 定义 props
const props = defineProps({
  url: {
    type: Object
  },
  cover: {
    type: String,
    default: ""
  }
})

const videoPlayerRef = ref()

// video.js 配置
const playerOptions = reactive({
  //是否在页面加载后载入视频
  preload: 'metadata',
  aspectRatio: '16:9',
  //自适应宽高
  fluid: true,
  loop: false,
  muted: false,
  language: 'zh-CN',
  autoplay: false,
  //可选的播放速度
  playbackRates: [0.5, 1.0, 1.5, 2.0],
  sources: [{
    type: '',
    src: ''
  }],
  poster: '',
  notSupportedMessage: '此视频暂无法播放',
  controlBar: {
    //暂停和播放键
    playToggle: true,
    //进度条
    progressControl: true,
    //全屏按钮
    fullscreenToggle: true
  }
})


const player = computed(() => videoPlayerRef.value?.player)

// 监听 url 变化，更新播放器资源
watch(
  () => props.url,
  (val) => {
    if (val) {
      playerOptions.sources[0].src = val.src
      playerOptions.sources[0].type = val.type
      playerOptions.poster = props.cover
    }
  },
  { immediate: true, deep: true }
)

// 播放回调
function onPlayerPlay(player) {
  console.log('播放', player)
}

// 暂停回调
function onPlayerPause(player) {
  console.log('暂停', player)
}

// 视频播完回调
function onPlayerEnded(player) {
  console.log('结束', player)
}

// 暂停等待缓冲回调
function onPlayerWaiting(player) {
  console.log('等待缓冲', player)
}

// 恢复播放回调
function onPlayerPlaying(player) {
  console.log('恢复播放', player)
}

// 视频首帧加载完成
function onPlayerLoadeddata(player) {
  console.log('首帧加载', player)
}

// 播放进度更新
function onPlayerTimeupdate(player) {
  console.log('时间更新', player.currentTime())
}

// 可以播放回调
function onPlayerCanplay(player) {
  console.log('可以播放', player)
}

// 可以顺畅播放到结束
function onPlayerCanplaythrough(player) {
  console.log('可以顺畅播放', player)
}

// 播放状态改变回调
function playerStateChanged(player) {
  console.log('状态改变', player)
}

// 播放器已就绪回调
function playerReadied(player) {
  console.log('播放器就绪', player)
}
</script>


<style>
.video-player-box {
  border-radius: 5px;
  overflow: hidden;
}

.vjs-big-play-button {
  left: 50% !important;
  top: 50% !important;
  transform: translate(-50%, -50%) !important;
}
</style>
