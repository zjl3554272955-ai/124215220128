// ========== 音频播放时间换算（老师提供） ==========
function transTime(value) {
  var time = '';
  var h = parseInt(value / 3600);
  value %= 3600;
  var m = parseInt(value / 60);
  var s = parseInt(value % 60);
  if (h > 0) {
    time = formatTime(h + ':' + m + ':' + s);
  } else {
    time = formatTime(m + ':' + s);
  }
  return time;
}

function formatTime(value) {
  var time = '';
  var s = value.split(':');
  var i = 0;
  for (; i < s.length - 1; i++) {
    time += s[i].length == 1 ? '0' + s[i] : s[i];
    time += ':';
  }
  time += s[i].length == 1 ? '0' + s[i] : s[i];
  return time;
}

// ========== 获取页面元素 ==========
const audio = document.getElementById('audioTag');
const playPauseBtn = document.getElementById('playPause');
const skipForwardBtn = document.getElementById('skipForward'); // 上一首
const skipBackwardBtn = document.getElementById('skipBackward'); // 下一首
const progressTotal = document.getElementById('progress-total');
const progress = document.getElementById('progress');
const playedTimeSpan = document.getElementById('playedTime');
const audioTimeSpan = document.getElementById('audioTime');
const musicTitle = document.getElementById('music-title');
const authorName = document.getElementById('author-name');
const recordImg = document.getElementById('record-img');
const volumeTogger = document.getElementById('volumn-togger');
const volumeBtn = document.getElementById('volume');
const playModeBtn = document.getElementById('playMode');
const speedBtn = document.getElementById('speed');
const musicList = document.getElementById('music-list');
const closeListBtn = document.getElementById('close-list');
const listBtn = document.getElementById('list');

// ========== 播放列表配置 ==========
const playlist = [
  { title: '洛春赋', author: '云汐/张晶朗24215220128', src: 'mp3/music0.mp3' },
  { title: 'Yesterday', author: 'The Beatles/张晶朗24215220128', src: 'mp3/music1.mp3' },
  { title: '江南烟雨色', author: '杨树人/张晶朗24215220128', src: 'mp3/music2.mp3' },
  { title: 'Vision pt.II', author: 'Lost Sky/张晶朗24215220128', src: 'mp3/music3.mp3' },
];

let currentIndex = 0;     // 当前播放索引
let isPlaying = false;    // 是否正在播放
let playMode = 0;         // 0=列表循环, 1=单曲循环, 2=随机播放
let currentSpeed = 1.0;   // 播放倍速

// ========== 初始化 ==========
function init() {
  loadSong(currentIndex);
  audio.volume = volumeTogger.value / 100;
}
init();

// ========== 加载歌曲（含背景和唱片切换） ==========
function loadSong(index) {
  const song = playlist[index];
  audio.src = song.src;
  musicTitle.textContent = song.title;
  authorName.textContent = song.author;
  // 切换背景图
  document.body.style.backgroundImage = "url('images/bg" + index + ".png')";
  // 切换唱片封面
  recordImg.style.backgroundImage = "url('images/record" + index + ".jpg')";
  // 重置进度
  progress.style.width = '0%';
  playedTimeSpan.textContent = '00:00';
  audioTimeSpan.textContent = '00:00';
  // 重置播放按钮
  playPauseBtn.classList.remove('icon-pause');
  playPauseBtn.classList.add('icon-play');
  isPlaying = false;
}

// ========== 播放/暂停 ==========
playPauseBtn.addEventListener('click', function () {
  if (isPlaying) {
    audio.pause();
    playPauseBtn.classList.remove('icon-pause');
    playPauseBtn.classList.add('icon-play');
    recordImg.classList.remove('rotate-play');
  } else {
    audio.play();
    playPauseBtn.classList.remove('icon-play');
    playPauseBtn.classList.add('icon-pause');
    recordImg.classList.add('rotate-play');
  }
  isPlaying = !isPlaying;
});

// ========== 音频可以播放时，设置总时长 ==========
audio.addEventListener('loadedmetadata', function () {
  audioTimeSpan.textContent = transTime(audio.duration);
});

// ========== 时间更新 ==========
audio.addEventListener('timeupdate', function () {
  const currentTime = audio.currentTime;
  const duration = audio.duration;
  const percent = (currentTime / duration) * 100;
  progress.style.width = percent + '%';
  playedTimeSpan.textContent = transTime(currentTime);
});

// ========== 进度条点击跳转 ==========
progressTotal.addEventListener('click', function (e) {
  const rect = this.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  const percent = clickX / width;
  audio.currentTime = percent * audio.duration;
});

// ========== 上一首 ==========
skipForwardBtn.addEventListener('click', function () {
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  loadSong(currentIndex);
  if (isPlaying || playPauseBtn.classList.contains('icon-pause')) {
    audio.play();
    playPauseBtn.classList.remove('icon-play');
    playPauseBtn.classList.add('icon-pause');
    recordImg.classList.add('rotate-play');
    isPlaying = true;
  }
});

// ========== 下一首 ==========
skipBackwardBtn.addEventListener('click', function () {
  if (playMode === 2) {
    currentIndex = Math.floor(Math.random() * playlist.length);
  } else {
    currentIndex = (currentIndex + 1) % playlist.length;
  }
  loadSong(currentIndex);
  if (isPlaying || playPauseBtn.classList.contains('icon-pause')) {
    audio.play();
    playPauseBtn.classList.remove('icon-play');
    playPauseBtn.classList.add('icon-pause');
    recordImg.classList.add('rotate-play');
    isPlaying = true;
  }
});

// ========== 歌曲结束自动下一首 ==========
audio.addEventListener('ended', function () {
  if (playMode === 1) {
    audio.currentTime = 0;
    audio.play();
  } else if (playMode === 0) {
    skipBackwardBtn.click();
  } else {
    currentIndex = Math.floor(Math.random() * playlist.length);
    loadSong(currentIndex);
    audio.play();
    playPauseBtn.classList.remove('icon-play');
    playPauseBtn.classList.add('icon-pause');
    recordImg.classList.add('rotate-play');
    isPlaying = true;
  }
});

// ========== 播放模式切换（用图片替换文字Emoji） ==========
playModeBtn.addEventListener('click', function () {
  playMode = (playMode + 1) % 3;
  if (playMode === 0) {
    playModeBtn.style.backgroundImage = "url('images/mode1.png')";
  } else if (playMode === 1) {
    playModeBtn.style.backgroundImage = "url('images/mode2.png')";
  } else {
    playModeBtn.style.backgroundImage = "url('images/mode3.png')";
  }
});

// ========== 倍速切换 ==========
speedBtn.addEventListener('click', function () {
  if (currentSpeed === 1.0) {
    currentSpeed = 1.5;
  } else if (currentSpeed === 1.5) {
    currentSpeed = 2.0;
  } else {
    currentSpeed = 1.0;
  }
  audio.playbackRate = currentSpeed;
  speedBtn.textContent = currentSpeed.toFixed(1) + 'X';
});

// ========== 音量调节 + 静音切换 ==========
let lastVolume = 0.7;

// 滑块调节音量
volumeTogger.addEventListener('input', function () {
  audio.volume = this.value / 100;
  if (audio.volume > 0) {
    volumeBtn.style.backgroundImage = "url('images/音量.png')";
  } else {
    volumeBtn.style.backgroundImage = "url('images/静音.png')";
  }
});

// 单击音量图标：弹出/隐藏滑块
volumeBtn.addEventListener('click', function () {
  if (volumeTogger.style.display === 'block') {
    volumeTogger.style.display = 'none';
  } else {
    volumeTogger.style.display = 'block';
  }
});

// 双击音量图标：切换静音
volumeBtn.addEventListener('dblclick', function () {
  if (audio.volume > 0) {
    lastVolume = audio.volume;
    audio.volume = 0;
    volumeTogger.value = 0;
    volumeBtn.style.backgroundImage = "url('images/静音.png')";
  } else {
    audio.volume = lastVolume;
    volumeTogger.value = lastVolume * 100;
    volumeBtn.style.backgroundImage = "url('images/音量.png')";
  }
});

// 点其他地方隐藏滑块
document.addEventListener('click', function (e) {
  if (e.target !== volumeBtn && e.target !== volumeTogger) {
    volumeTogger.style.display = 'none';
  }
});

// ========== 播放列表显示/隐藏 ==========
listBtn.addEventListener('click', function () {
  musicList.style.display = 'block';
});
closeListBtn.addEventListener('click', function () {
  musicList.style.display = 'none';
});

// ========== 点击列表项切换歌曲 ==========
const musicItems = document.querySelectorAll('.all-list div');
musicItems.forEach(function (item, index) {
  item.addEventListener('click', function () {
    currentIndex = index;
    loadSong(currentIndex);
    audio.play();
    playPauseBtn.classList.remove('icon-play');
    playPauseBtn.classList.add('icon-pause');
    recordImg.classList.add('rotate-play');
    isPlaying = true;
    musicList.style.display = 'none';
  });
});

// ========== MV 功能 ==========
const mvBtn = document.getElementById('MV');
const mvOverlay = document.getElementById('mv-overlay');
const mvClose = document.getElementById('mv-close');
const mvVideo = document.getElementById('mv-video');
const mvTitle = document.getElementById('mv-title');

const mvList = [
  'mp4/video0.mp4',
  'mp4/video1.mp4',
  'mp4/video2.mp4',
  'mp4/video3.mp4',
];

mvBtn.addEventListener('click', function () {
  mvVideo.src = mvList[currentIndex];
  mvTitle.textContent = 'MV - ' + playlist[currentIndex].title;
  mvOverlay.style.display = 'flex';
  mvVideo.play();
  audio.pause();
  playPauseBtn.classList.remove('icon-pause');
  playPauseBtn.classList.add('icon-play');
  recordImg.classList.remove('rotate-play');
  isPlaying = false;
});

mvClose.addEventListener('click', function () {
  mvOverlay.style.display = 'none';
  mvVideo.pause();
  mvVideo.src = '';
});

mvOverlay.addEventListener('click', function (e) {
  if (e.target === mvOverlay) {
    mvClose.click();
  }
});