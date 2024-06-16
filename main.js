let video;
let canvasElement;
let container = document.querySelector('#container');
let innerSize = [window.innerWidth, window.innerHeight];
function openCamera() {
    innerSize = [window.innerWidth, window.innerHeight];
    canvasElement = document.createElement('canvas');
    let canvas = canvasElement.getContext('2d');
    container.innerHTML = '';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';

    let div = document.createElement('div');
    div.style.width = `${innerSize[0]}px`;
    div.style.height = `${innerSize[1]*0.88 - innerSize[1]*0.3}px`;
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'center';
    div.appendChild(canvasElement);
    container.appendChild(div);
    
    div = document.createElement('div');
    div.style.width = `${innerSize[0]}px`;
    div.style.height = `${innerSize[1]*0.3}px`;
    
    let div2 = document.createElement('div');
    div2.style.display = 'flex';
    div2.style.justifyContent = 'center';

    let cameraType = document.createElement('div');
    cameraType.style.fontSize = '2vh';
    cameraType.style.padding = '1.2vh';
    cameraType.style.paddingLeft = '2.5vh';
    cameraType.style.paddingRight = '2.5vh';
    cameraType.style.margin = '1.5vh';
    cameraType.style.borderRadius = '90px';
    cameraType.textContent = '사진';

    div2.appendChild(cameraType);
    
    cameraType = cameraType.cloneNode(cameraType);
    cameraType.textContent = '동영상';
    div2.appendChild(cameraType);
    
    cameraType = cameraType.cloneNode(cameraType);
    cameraType.textContent = '더보기';
    div2.appendChild(cameraType);
    
    div.appendChild(div2);
    container.appendChild(div);

    selectType();

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
            // canvasElement.height = innerSize[1]*0.48;
            canvasElement.width = video.videoWidth;
            canvasElement.height = video.videoHeight;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        }
        requestAnimationFrame(tick);
    }
}
function selectType(x=0) {
    let types = document.querySelectorAll('#container > div > div:nth-child(1) > *')
    let typesWidth = [0, 0];
    types.forEach((e, i)=>{
        e.onclick = () => selectType(i);
        e.style.fontWeight = 'unset';
        e.style.backgroundColor = 'unset';
        if(x<i){
            typesWidth[0] += e.getBoundingClientRect().width;
            typesWidth[0] += innerSize[1]*0.03;//cameraType.style.margin
        }else if(x>i){
            typesWidth[1] += e.getBoundingClientRect().width;
            typesWidth[1] += innerSize[1]*0.03;//cameraType.style.margin
        }else{
            e.style.fontWeight = 'bold';
            e.style.backgroundColor = 'lightgray';
        }
    });
    let y = typesWidth[1]-typesWidth[0];
    y /= 2;
    div = document.querySelector('#container > div > div:nth-child(1)');
    div.style.transform = `translateX(${-y}px)`;
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