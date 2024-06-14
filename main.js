let video;
let canvasElement;
let container = document.querySelector('#container');
innerSize = [window.innerWidth, window.innerHeight];
function openCamera() {
    canvasElement = document.createElement('canvas');
    let canvas = canvasElement.getContext('2d');
    container.innerHTML = '';
    container.style.display = 'block';
    container.style.flexDirection = 'column';
    let div = document.createElement('div');
    div.style.width = innerSize[0];
    div.style.height = innerSize[1]*0.48;
    div.appendChild(canvasElement);
    container.appendChild(div);
    div = document.createElement('div');
    div.style.width = innerSize[0];
    div.style.height = innerSize[1]*0.4;




    container.appendChild(div);
    video = document.createElement('video');
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user'/*environment*/ } }).then(function (stream) {
        video.srcObject = stream;
        video.setAttribute('playsinline', true);      // iOS 사용시 전체 화면을 사용하지 않음을 전달
        video.play();
        requestAnimationFrame(tick);
    });
    function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            // canvasElement.width = innerSize[0];
            // canvasElement.height = innerSize[1]*0.88;
            // canvasElement.width = video.videoWidth;
            // canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;
            canvasElement.height = video.videoHeight;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        }
        requestAnimationFrame(tick);
    }
}
function closeCamera(stream = video.srcObject) {
    if (stream) {
        let tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null; // 스트림을 비워서 비디오 요소도 해제
        container.innerHTML = '';
        let img = imageDownload(canvasElement);
        img.classList.add('button')
        container.appendChild(img);
    }
}
/**
 * 
 * @param {Element} canvas 다운로드할 canvas element
 * @param {String} fileName 다운로드할 사진 파일명 fileName.png
 * @param {String} textContent 다운로드 버튼 텍스트
 * @returns 클릭하면 사진이 다운로드되는 a태그
 */
function imageDownload(canvas, fileName='image', textContent='Download'){
    let a = document.createElement('a');
    a.textContent = textContent;
    let img = canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
    a.setAttribute('download', `${fileName}.png`);
    a.setAttribute('href', img);
    return a;
}