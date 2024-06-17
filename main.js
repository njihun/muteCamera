let video;
let canvasElement;
let container = document.querySelector('#container');
let innerSize = [innerWidth, innerHeight];
let facingMode = 'user';
let gallery = [];
document.addEventListener('fullscreenchange', () => {
    innerSize = [innerWidth, innerHeight];
});
function openCamera() {
    // if (!isFullscreen) {
    //     alert("전체 화면이 지원되지 않는 환경입니다. 브라우저에 따라 화면 비율이 다르게 표시될 수 있습니다.");
    // }
    canvasElement = document.createElement('canvas');
    let canvas = canvasElement.getContext('2d');
    container.innerHTML = '';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';

    let div = document.createElement('div');
    div.style.width = '100vw';
    div.style.height = 'calc(88vh - 30vh)';
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'center';
    div.appendChild(canvasElement);
    container.appendChild(div);

    div = document.createElement('div');
    div.style.width = '100vw';
    div.style.height = '58vh';//calc(88vh - 30vh)
    div.style.top = '12vh';
    div.id = 'more';
    container.appendChild(div);

    div = document.createElement('div');
    div.style.width = '100vw';
    div.style.height = '30vh';
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
    div2.style.width = '100vw';
    div2.style.flexGrow = '1';
    div2.style.gap = '10vw';

    div3 = document.createElement('div');
    div3.style.width = '8vh';
    div3.style.height = '8vh';
    div3.style.backgroundColor = 'white';
    div3.style.borderRadius = '50%';
    div3.id = 'gallery';
    div2.appendChild(div3);

    div3 = div3.cloneNode();
    div3.style.width = '10vh';
    div3.style.height = '10vh';
    div3.id = 'shutter';
    div2.appendChild(div3);

    div3 = div3.cloneNode();
    div3.style.width = '8vh';
    div3.style.height = '8vh';
    div3.style.lineHeight = '8vh';
    div3.style.textAlign = 'center';
    div3.style.color = 'black';
    div3.onclick = () => startVideo(video, facingMode=='user'?'environment':'user');
    div3.id = 'change';
    div3.textContent = 'change';
    div2.appendChild(div3);

    div.appendChild(div2);

    container.appendChild(div);

    selectType();

    video = document.createElement('video');

    startVideo(video);
    async function startVideo(video, facingMode2 = 'user') {
        try {
            facingMode = facingMode2;
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { exact: facingMode2 }
                }
            }).then(function (stream) {
                video.srcObject = stream;
                video.setAttribute('playsinline', true);      // iOS 사용시 전체 화면을 사용하지 않음을 전달
                video.play();
                requestAnimationFrame(tick);
            });
        } catch (err) {
            console.error("Error accessing the camera: ", err);
        }
    }
    function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            innerSize = [innerWidth, innerHeight];
            let height = Number(document.getElementById('more').style.height.replace('vh', ''));
            canvasElement.width = video.videoWidth/video.videoHeight*(height/100*innerSize[1]);
            canvasElement.height = video.videoHeight/video.videoWidth*innerSize[0];
            if (video.videoWidth > video.videoHeight) {
                if(canvasElement.height>height/100*innerSize[1]){
                    canvasElement.height = height/100*innerSize[1];
                }else{
                    canvasElement.width = innerSize[0];
                }
            } else {
                if(canvasElement.width>innerSize[0]){
                    canvasElement.width = innerSize[0];
                }else{
                    canvasElement.height = height/100*innerSize[1];
                }
            }
            if(canvasElement.width>innerSize[0]){
                
            }else if(canvasElement.height>height/100*innerSize[1]){

            }
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        }
        requestAnimationFrame(tick);
    }
}
function selectType(x = 0) {
    types = Array.from(document.getElementById('types').children);
    let typesWidth = [0, 0];
    types.forEach((e, i) => {
        e.onclick = () => selectType(i);
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
    document.getElementById('shutter').onclick = () => null;
    document.querySelector("#container > div:nth-child(3) > div:nth-child(2)").style.display = 'none';
    switch (x) {
        case 0:
            document.querySelector("#container > div:nth-child(3) > div:nth-child(2)").style.display = 'flex';
            document.getElementById('shutter').onclick = () => {
                let img = new Image();
                img.src = canvasElement.toDataURL('image/png');
                gallery.unshift(img);
                document.getElementById('gallery').style.backgroundImage = `url(${img.src})`;
            };
            document.getElementById('gallery').onclick = () => {
                // document.querySelector("#container > div:nth-child(1)").appendChild(imageDownload(gallery[0]));

            };
            break;
        case 1:
            document.querySelector("#container > div:nth-child(3) > div:nth-child(2)").style.display = 'flex';
            document.getElementById('shutter').onclick = () => {
                alert('아직 지원하지 않는 기능입니다.');
                return;
                let img = new Image();
                img.src = canvasElement.toDataURL('image/png');
                gallery.unshift(img);
                document.getElementById('gallery').style.backgroundImage = `url(${img.src})`;
            };
            break;
        case 2:
            canvasElement.style.filter = 'blur(1vh)';
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
function imageDownload(img, fileName = 'image', textContent = 'Download') {
    let a = document.createElement('a');
    a.textContent = textContent;
    a.setAttribute('download', `${fileName}.png`);
    a.setAttribute('href', img.src);
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