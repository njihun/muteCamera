let video;
let canvasElement;
let container = document.querySelector('#container');
let innerSize = [innerWidth, innerHeight];
document.addEventListener('fullscreenchange', ()=>{
    innerSize = [innerWidth, innerHeight];
});
function openCamera() {
    fullscreen().then(() => {
        if (!isFullscreen) {
            alert("전체 화면이 지원되지 않는 환경입니다. 브라우저에 따라 화면 비율이 다르게 표시될 수 있습니다.");
        }
        // exitFullScreen();
        canvasElement = document.createElement('canvas');
        let canvas = canvasElement.getContext('2d');
        container.innerHTML = '';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        
        innerSize = [innerWidth, innerHeight];
        
        let div = document.createElement('div');
        div.style.width = `${innerSize[0]}px`;
        div.style.height = `${innerSize[1] * 0.88 - innerSize[1] * 0.3}px`;
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'center';
        div.appendChild(canvasElement);
        container.appendChild(div);

        div = document.createElement('div');
        div.style.width = `${innerSize[0]}px`;
        div.style.height = `${innerSize[1] * 0.88 - innerSize[1] * 0.3}px`;
        div.style.top = `${innerSize[1] * 0.12}px`;
        div.id = 'more';
        container.appendChild(div);

        div = document.createElement('div');
        div.style.width = `${innerSize[0]}px`;
        div.style.height = `${innerSize[1] * 0.3}px`;
        div.style.backgroundColor = 'black';
        div.style.color = 'white';
        div.style.zIndex = '1';//canvas blur 번짐 방지
        div.style.display = 'flex';
        div.style.flexDirection = 'column';

        let div2 = document.createElement('div');
        div2.style.display = 'flex';
        div2.style.justifyContent = 'center';
        div2.id = 'types';

        let cameraType = document.createElement('div');
        cameraType.style.fontSize = '2vh';
        cameraType.style.padding = '1.2vh';
        cameraType.style.paddingLeft = '2.5vh';
        cameraType.style.paddingRight = '2.5vh';
        cameraType.style.margin = '1vh';
        cameraType.style.borderRadius = '90px';
        cameraType.textContent = '사진';
        div2.appendChild(cameraType);

        cameraType = cameraType.cloneNode();
        cameraType.textContent = '동영상';
        div2.appendChild(cameraType);

        cameraType = cameraType.cloneNode();
        cameraType.textContent = '더보기';
        div2.appendChild(cameraType);

        div.appendChild(div2);

        div2 = document.createElement('div');
        div2.style.display = 'flex';
        div2.style.alignItems = 'center';
        div2.style.justifyContent = 'center';
        div2.style.width = `${innerSize[0]}px`;
        div2.style.flexGrow = '1';
        
        div3 = document.createElement('div');
        div3.style.width = `${innerSize[1] * 0.1}px`;
        div3.style.height = `${innerSize[1] * 0.1}px`;
        div3.style.backgroundColor = 'white';
        div3.style.borderRadius = '50%';
        div3.style.margin = '0 auto';
        div2.appendChild(div3);

        div3 = div3.cloneNode();
        div3.style.width = `${innerSize[1] * 0.15}px`;
        div3.style.height = `${innerSize[1] * 0.15}px`;
        div2.appendChild(div3);

        div3 = div3.cloneNode();
        div3.style.width = `${innerSize[1] * 0.1}px`;
        div3.style.height = `${innerSize[1] * 0.1}px`;
        div2.appendChild(div3);

        div.appendChild(div2);

        container.appendChild(div);

        selectType(0, innerSize);

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
                if (video.videoWidth > video.videoHeight) {
                    let height = Number(document.getElementById('more').style.height.replace('px', ''));
                    canvasElement.width = height / video.videoHeight * video.videoWidth;
                    canvasElement.height = height;
                } else {
                    canvasElement.width = innerSize[0];
                    canvasElement.height = innerSize[0] / video.videoWidth * video.videoHeight;
                }
                canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            }
            requestAnimationFrame(tick);
        }
    });
}
function selectType(x = 0, innerSize) {
    
    types = Array.from(document.getElementById('types').children);
    let typesWidth = [0, 0];
    types.forEach((e, i) => {
        e.onclick = () => selectType(i, innerSize);
        e.style.fontWeight = 'unset';
        e.style.backgroundColor = 'unset';
        if (x < i) {
            typesWidth[0] += e.getBoundingClientRect().width;
            typesWidth[0] += innerSize[1] * 0.02;//cameraType.style.margin
        } else if (x > i) {
            typesWidth[1] += e.getBoundingClientRect().width;
            typesWidth[1] += innerSize[1] * 0.02;//cameraType.style.margin
        } else {
            e.style.fontWeight = 'bold';
            e.style.backgroundColor = 'rgba(255,255,255,0.2)';
        }
    });
    let y = typesWidth[1] - typesWidth[0];
    y /= 2;
    div = document.getElementById('types');
    div.style.transform = `translateX(${-y}px)`;


    canvasElement.style.filter = 'unset';
    document.getElementById('more').style.display = 'none';
    switch (x) {
        case 0:
            break;
        case 1:
            break;
        case 2:
            canvasElement.style.filter = 'blur(50px)';
            document.getElementById('more').style.display = 'block';
            break;
        default:
            break;
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
function imageDownload(canvas, fileName = 'image', textContent = 'Download') {
    let a = document.createElement('a');
    a.textContent = textContent;
    let img = canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
    a.setAttribute('download', `${fileName}.png`);
    a.setAttribute('href', img);
    return a;
}
function isFullscreen() {
    return document.fullscreenElement || /* Standard syntax */
        document.webkitFullscreenElement || /* Safari and Opera syntax */
        document.msFullscreenElement; /* IE11 syntax */
}

function fullscreen(element = document.documentElement) {
    if (element.requestFullscreen) return element.requestFullscreen();
    if (element.webkitRequestFullscreen) return element.webkitRequestFullscreen();
    if (element.mozRequestFullScreen) return element.mozRequestFullScreen();
    if (element.msRequestFullscreen) return element.msRequestFullscreen();
    // return Promise.reject(new Error('Fullscreen API is not supported'));
}
function exitFullScreen() {
    if (document.exitFullscreen) return document.exitFullscreen();
    if (document.webkitCancelFullscreen) return document.webkitCancelFullscreen();
    if (document.mozCancelFullScreen) return document.mozCancelFullScreen();
    if (document.msExitFullscreen) return document.msExitFullscreen();
}