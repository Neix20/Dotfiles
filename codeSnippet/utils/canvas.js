
const canvas = document.querySelector("canvas");
const fps = 24;
const ts = 3500 * 4;
const fileName = "YatuProBg.webm"

let chunks = [];

const stream = canvas.captureStream(fps);
const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
    ignoreMutedMedia: true
});
mediaRecorder.ondataavailable = (e) => {
    chunks.push(e.data);
};
mediaRecorder.onstop = function(e) {
    const blob = new Blob(chunks, { 'type' : 'video/webm' });
    chunks = [];
    const url = URL.createObjectURL(blob);

    const dlElem = document.createElement("a");
    dlElem.href = url;
    dlElem.download = fileName;
    dlElem.click();

    URL.revokeObjectURL(url);
  };
mediaRecorder.start();
setTimeout(() => mediaRecorder.stop(), ts);