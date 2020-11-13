import axios from "axios";

const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playBtn = document.getElementById("jsPlayBtn");
const volumeBtn = document.getElementById("jsVolumeBtn");
const fullScrnBtn = document.getElementById("jsFullScrnBtn");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("jsVolume");

const DEFAULT_VOLUME = 0.5;

const registerView = () => {
  const videoId = window.location.pathname.split("/videos/")[1];
  fetch(`/api/${videoId}/view`, {
    method: "POST",
  });
};

function handlePlayClick() {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    videoPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
}

function setVolumeBtnIcon() {
  if (videoPlayer.muted) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  } else if (videoPlayer.volume > 0.7) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
  } else if (videoPlayer.volume > 0.3) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
  } else {
    volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
  }
}

function handleVolumeClick() {
  if (videoPlayer.muted) {
    videoPlayer.muted = false;
    setVolumeBtnIcon();
    volumeRange.value = videoPlayer.volume;
  } else {
    videoPlayer.muted = true;
    setVolumeBtnIcon();
    volumeRange.value = 0;
  }
}

function handleVolumeDrag(event) {
  const {
    target: { value },
  } = event;
  videoPlayer.volume = value;
  setVolumeBtnIcon();
}

function handleFullScreen() {
  if (!document.fullscreenElement) {
    const requestFullscreen =
      videoContainer.requestFullscreen ||
      videoContainer.webkitRequestFullScreen ||
      videoContainer.mozRequestFullScreen ||
      videoContainer.msRequestFullScreen;
    requestFullscreen.call(videoContainer);
    fullScrnBtn.innerHTML = '<i class="fas fa-compress"></i>';
  } else {
    const exitFullScreen =
      document.exitFullscreen ||
      document.webkitExitFullScreen ||
      document.mozExitFullScreen ||
      document.msExitFullScreen;
    exitFullScreen.call(document);
    fullScrnBtn.innerHTML = '<i class="fas fa-expand"></i>';
  }
}
const formatDate = (seconds) => {
  const secondsNumber = parseInt(seconds, 10);
  let hours = Math.floor(secondsNumber / 3600);
  let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
  let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (totalSeconds < 10) {
    totalSeconds = `0${totalSeconds}`;
  }
  return `${hours}:${minutes}:${totalSeconds}`;
};

function setTotalTime() {
  totalTime.innerHTML = formatDate(videoPlayer.duration);
}

function setCurrentTime() {
  currentTime.innerHTML = formatDate(videoPlayer.currentTime);
}

function handleEnded() {
  videoPlayer.currentTime = 0;
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
  registerView();
}

function init() {
  videoPlayer.volume = DEFAULT_VOLUME;
  setVolumeBtnIcon();
  playBtn.addEventListener("click", handlePlayClick);
  volumeBtn.addEventListener("click", handleVolumeClick);
  fullScrnBtn.addEventListener("click", handleFullScreen);
  videoPlayer.addEventListener("loadedmetadata", setTotalTime);
  videoPlayer.addEventListener("timeupdate", setCurrentTime);
  videoPlayer.addEventListener("ended", handleEnded);
  volumeRange.addEventListener("input", handleVolumeDrag);
}

if (videoContainer) {
  init();
}
