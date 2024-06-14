let video;
let canvasElement;
let container = document.querySelector('#container');
innerSize = [window.innerWidth, window.innerHeight];
function openCamera() {
    canvasElement = document.createElement('canvas');
    let canvas = canvasElement.getContext('2d');
    container.innerHTML = '';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';

    let div = document.createElement('div');
    div.style.width = `${innerSize[0]}px`;
    div.style.height = `${innerSize[1]*0.88 - 200}px`;
    div.appendChild(canvasElement);
    container.appendChild(div);
    
    div = document.createElement('div');
    div.style.width = `${innerSize[0]}px`;
    div.style.height = `${200}px`;
    
    let div2 = document.createElement('div');
    div2.style.display = 'flex';
    div2.style.justifyContent = 'center';

    let cameraType = document.createElement('div');
    cameraType.style.fontSize = '15px';
    cameraType.style.fontWeight = 'bold';
    cameraType.style.padding = '10px';
    cameraType.style.paddingLeft = '20px';
    cameraType.style.paddingRight = '20px';
    cameraType.style.margin = '10px';
    cameraType.style.borderRadius = '50px';
    cameraType.style.backgroundColor = 'lightgray';
    cameraType.textContent = '사진';
    // cameraType.style.margin = '0 auto';
    // cameraType.style.transform = 'translateX(-50%)';
    // cameraType.style.left = '50%';
    // cameraType.style.position = 'absolute';

    div2.appendChild(cameraType);
    
    cameraType = cameraType.cloneNode(cameraType);
    // cameraType.style.backgroundColor = 'unset';
    cameraType.textContent = '동영상';
    div2.appendChild(cameraType);
    
    div.appendChild(div2);
    container.appendChild(div);
    let x = 0;
    let y = 0;
    if(x==0){
        y = -20-(document.querySelector('#container > div > div:nth-child(1) > div:nth-child(2)').getBoundingClientRect().width)/2
    }
    div = document.querySelector('#container > div > div:nth-child(1)');
    div.style.transform = `translateX(${(document.querySelector('#container > div > div:nth-child(1) > div:nth-child(2)').getBoundingClientRect().width - document.querySelector('#container > div > div:nth-child(1) > div:nth-child(1)').getBoundingClientRect().width)/2}px)`;
    // div.style.transform = `translateX(${y}px)`;

    video = document.createElement('video');
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user'/*environment*/ } }).then(function (stream) {
        video.srcObject = stream;
        video.setAttribute('playsinline', true);      // iOS 사용시 전체 화면을 사용하지 않음을 전달
        video.play();
        requestAnimationFrame(tick);
    });
    function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvasElement.width = innerSize[0];
            canvasElement.height = innerSize[1]*0.48;
            // canvasElement.width = video.videoWidth;
            // canvasElement.height = video.videoHeight;
            // canvasElement.width = video.videoWidth;
            // canvasElement.height = video.videoHeight;
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