const recordContainer = document.getElementById("jsRecordContainer");
const recordBtn = document.getElementById("jsRecordBtn");
const videoPreview = document.getElementById("jsVideoPreview");

let videoRecorder;

const handleVideoData = (event) => {
  const { data } = event;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(data);
  link.download = "recorded.webm";
  document.body.appendChild(link);
  link.click();
};

const initRecoding = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { width: 1280, height: 720 },
    });
    videoPreview.srcObject = stream;
    videoPreview.muted = true;
    videoPreview.play();

    videoRecorder = new MediaRecorder(stream);
    videoRecorder.addEventListener("dataavailable", handleVideoData);
  } catch (error) {
    console.error(error);
    recordBtn.innerHTML = "Can't record 😭";
  }
};

const startRecording = () => {
  videoRecorder.start();
  recordBtn.innerHTML = "Stop recording";
  recordBtn.removeEventListener("click", startRecording);
  recordBtn.addEventListener("click", stopRecording);
};

const stopRecording = () => {
  videoRecorder.stop();
  recordBtn.innerHTML = "Start recording";
  recordBtn.removeEventListener("click", stopRecording);
  recordBtn.addEventListener("click", startRecording);
};

function init() {
  initRecoding();
  recordBtn.addEventListener("click", startRecording);
}

if (recordContainer) {
  init();
}
