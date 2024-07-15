let video;
let canvasElement;
let canvas;
let container = document.querySelector('#container');
let innerSize = [innerWidth, innerHeight];
let facingMode = 'user';
let gallery = [];
let test = 0;
let model;
!detectObjectsButton();
function servoMotor(detectedObj) {
    console.log(detectedObj);
    if(detectedObj.includes('bottle')){
        console.log('!!!!!');
    }
}
// Function to detect objects in video stream
async function detectObjects(model) {
    if (!model) {
        console.error("Model is not loaded yet!");
        return;
    }
    const predictions = await model.detect(video);
    servoMotor(predictions.map((e) =>{
        return e.class
    }));

    // Draw the predictions
    predictions.forEach(prediction => {
        canvas.beginPath();
        prediction.bbox = [...prediction.bbox].map((e, i)=>{
            //prediction.bbox[0] = prediction.bbox[0]*canvasElement.width/video.videoWidth
            return e*(i%2==0?canvasElement.width:canvasElement.height)/(i%2==0?video.videoWidth:video.videoHeight);
        })
        canvas.rect(...prediction.bbox);
        canvas.lineWidth = 2;
        canvas.strokeStyle = 'dodgerblue';
        canvas.fillStyle = 'dodgerblue';
        canvas.font = `${canvasElement.width*0.03}px serif`;
        canvas.stroke();
        canvas.fillText(
            `${prediction.class} (${(prediction.score * 100).toFixed(2)}%)`,
            prediction.bbox[0],
            prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10
        );
    });
}

// Load the model and start detection
function detectObjectsButton() {
    if(test==0){
        testFunc();
    }else{
        test = 0;
    }
}
async function testFunc(){
    model = await cocoSsd.load();
    test = 1;
}

document.addEventListener('fullscreenchange', () => {
    innerSize = [innerWidth, innerHeight];
    setTimeout(() => {
        selectType(Array.from(document.getElementById('types').children).map((e) => {
            return e.style.backgroundColor;
        }).indexOf('rgba(255, 255, 255, 0.2)'))
        if (!isFullscreen) {
            alert("전체 화면이 지원되지 않는 환경입니다. 브라우저에 따라 화면 비율이 다르게 표시될 수 있습니다.");
        }
    }, 100);
});
function openCamera() {
    canvasElement = document.createElement('canvas');
    canvas = canvasElement.getContext('2d');
    container.innerHTML = '';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.fontSize = '1.8vh';

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
    div.innerHTML = `<button onclick="fullscreen();">전체화면</button>`
    div.innerHTML = `<button onclick="detectObjectsButton();">사물인식</button>`

    container.appendChild(div);

    div = document.createElement('div');
    div.style.width = '100vw';
    div.style.height = '30vh';
    div.style.backgroundColor = 'black';
    div.style.color = 'white';
    div.style.zIndex = '1';//canvas blur 번짐 방지
    div.style.display = 'flex';
    div.style.flexDirection = 'column';

    div2 = document.createElement('div');
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
    div3.onclick = () => {
        div = document.createElement('div');
        div.style.backgroundColor = 'dimgray';
        div.style.position = 'fixed';
        div.style.width = '100vw';
        div.style.minHeight = '100vh';
        div.style.top = '0';
        div.style.zIndex = '1';
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.id = 'galleryTap';

        div2 = document.createElement('div');
        div2.id = 'logo';
        div2.textContent = 'Gallery';

        div3 = document.createElement('div');
        div3.id = 'back';
        div3.style.position = 'fixed';
        div3.style.top = '0';
        div3.style.width = '10vh';
        div3.style.height = '10vh';
        div3.style.lineHeight = '10vh';
        div3.style.fontSize = '2vh';
        div3.style.margin = '1vh';
        div3.style.borderRadius = '50%';
        div3.style.backgroundColor = 'rgba(255,255,255,0.2)';
        div3.textContent = 'back';
        div3.onclick = () => {
            document.getElementById('galleryTap').remove();
        }
        div2.appendChild(div3);

        div.appendChild(div2);

        div2 = document.createElement('div');
        div2.style.display = 'flex';
        div2.style.maxHeight = '88vh';//logo height 제외 calc(100vh - 12vh)
        div2.style.flexWrap = 'wrap';
        div2.style.overflowY = 'auto';
        gallery.forEach((e, i) => {

            div3 = document.createElement('div');
            div3.id = 'gallery';
            div3.style.width = '25vw';
            div3.style.height = '25vw';
            div3.style.display = 'flex';
            div3.style.backgroundImage = `url(${e.src})`;
            div3.onclick = () => {
                div = document.createElement('div');
                div.style.position = 'fixed';
                div.style.top = '0';
                div.style.backgroundColor = 'black';
                div.style.width = '100vw';
                div.style.height = '100vh';
                div.style.zIndex = '1';
                div.id = 'detail';

                div2 = document.createElement('div');
                div2.id = 'logo';
                div2.textContent = 'Detail';

                div3 = document.createElement('div');
                div3.id = 'back';
                div3.style.position = 'fixed';
                div3.style.top = '0';
                div3.style.width = '10vh';
                div3.style.height = '10vh';
                div3.style.lineHeight = '10vh';
                div3.style.fontSize = '2vh';
                div3.style.margin = '1vh';
                div3.style.borderRadius = '50%';
                div3.style.backgroundColor = 'rgba(255,255,255,0.2)';
                div3.textContent = 'back';
                div3.onclick = () => {
                    document.getElementById('detail').remove();
                }
                div2.appendChild(div3);
                div.appendChild(div2);

                div2 = document.createElement('div');
                div2.style.width = '100vw';
                div2.style.height = '76vh';//calc(100vh - 12vh - 12vh)
                // div2.style.backgroundImage = `url(${e.src})`;
                // div2.id = 'gallery';
                
                div3 = document.createElement('canvas');
                div3.width = video.videoWidth;
                div3.height = video.videoHeight;
                let div3Context = div3.getContext('2d');
                div3Context.drawImage(e, 0, 0, Number((div2.style.width).replace('vw', ''))*innerSize[0]*0.01, Number((div2.style.height).replace('vh', ''))*innerSize[1]*0.01);
                div2.appendChild(div3)


                div.appendChild(div2);

                div2 = document.createElement('div');
                div2.style.width = '100vw';
                div2.style.height = '12vh';
                div2.style.lineHeight = '10vh';
                div2.style.textAlign = 'center';
                div2.style.display = 'flex';
                div2.style.alignItems = 'center';

                div3 = document.createElement('div');
                div3.style.margin = '0 auto';
                div3.style.width = '10vh';
                div3.style.height = '10vh';
                div3.style.backgroundColor = 'rgba(255,255,255,0.2)';
                div3.style.color = 'white';
                div3.style.borderRadius = '50%';
                div3.textContent = 'Download';
                div3.onclick = () => {
                    imageDownload(e);
                }
                div2.appendChild(div3);

                div3 = div3.cloneNode(true);
                div3.textContent = 'delete';
                div3.onclick = () => {
                    gallery.splice(i, 1);
                    document.getElementById('back').click();
                    document.getElementById('back').click();
                    try {
                        document.querySelectorAll('#gallery')[1].style.backgroundImage = `url(${gallery[0].src})`;
                    } catch (err) {
                        document.querySelectorAll('#gallery')[1].style.backgroundImage = 'none';
                    }
                    document.querySelectorAll('#gallery')[1].click();
                }
                div2.appendChild(div3);

                div3 = div3.cloneNode(true);
                div3.textContent = 'detail';
                div3.onclick = () => {
                    const img = e;
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    context.drawImage(img, 0, 0, canvas.width, canvas.height);

                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    const pixels = imageData.data;

                    const sharpness = calculateSharpness(pixels, canvas.width, canvas.height);
                    const noise = calculateNoise(pixels);
                    document.querySelectorAll('#detailValue span')[0].textContent = `${canvas.width} x ${canvas.height}`;
                    document.querySelectorAll('#detailValue span')[1].textContent = sharpness.toFixed(2);
                    document.querySelectorAll('#detailValue span')[2].textContent = noise.toFixed(2);
                    document.getElementById('detailValue').style.display = 'block';
                }
                div2.appendChild(div3);

                div.appendChild(div2);


                div2 = document.createElement('div');
                div2.style.width = '80vw';
                div2.style.height = '30vh';
                div2.style.top = '50%';
                div2.style.left = '50%';
                div2.style.position = 'fixed';
                div2.style.transform = 'translate(-50%, -50%)';
                div2.style.backgroundColor = 'rgba(0,0,0,0.5)';
                div2.style.borderRadius = '30px';
                div2.style.padding = '5vw';
                div2.style.zIndex = '2';
                div2.style.color = 'white';
                div2.style.display = 'none';
                div2.innerHTML = `
                <h2>Detail</h2>
                <div style="user-select: text;">Resolution:<span style="margin-left: 1vh;">${0}</span></div>
                <div style="user-select: text;">Sharpness:<span style="margin-left: 1vh;">${0}</span></div>
                <div style="user-select: text;">Noise Level:<span style="margin-left: 1vh;">${0}</span></div>
                `;
                div2.id = 'detailValue';
                div.appendChild(div2);

                container.appendChild(div);
            }
            div2.appendChild(div3);
            if (i == gallery.length - 1)
                div.appendChild(div2);
        })

        container.appendChild(div);
    };
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
    div3.onclick = () => startVideo(video, facingMode == 'user' ? 'environment' : 'user');
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
                video.onloadeddata = () => {
                    requestAnimationFrame(tick);
                }
            });
        } catch (err) {
            console.error("Error accessing the camera: ", err);
        }
    }
    function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            innerSize = [innerWidth, innerHeight];
            let height = Number(document.getElementById('more').style.height.replace('vh', ''));
            canvasElement.width = video.videoWidth / video.videoHeight * (height / 100 * innerSize[1]);
            canvasElement.height = video.videoHeight / video.videoWidth * innerSize[0];
            if (video.videoWidth > video.videoHeight) {
                if (canvasElement.height > height / 100 * innerSize[1]) {
                    canvasElement.width = innerSize[0];
                } else {
                    canvasElement.height = height / 100 * innerSize[1];
                }
            } else {
                if (canvasElement.width > innerSize[0]) {
                    canvasElement.height = height / 100 * innerSize[1];
                } else {
                    canvasElement.width = innerSize[0];
                }
            }
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            if(test==1)
                detectObjects(model);
            requestAnimationFrame(tick);

        }
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
            e.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
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
                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    let saveImage = document.createElement('canvas');
                    saveImage.width = video.videoWidth;
                    saveImage.height = video.videoHeight;
                    let saveContext = saveImage.getContext('2d');
                    saveContext.drawImage(canvasElement, 0, 0, saveImage.width, saveImage.height);
                    let img = new Image();
                    img.src = saveImage.toDataURL('image/png');
                    gallery.unshift(img);
                    document.querySelectorAll('#gallery')[1].style.backgroundImage = `url(${img.src})`;
                }
            };
            break;
        case 1:
            document.querySelector("#container > div:nth-child(3) > div:nth-child(2)").style.display = 'flex';
            document.getElementById('shutter').onclick = () => {
                alert('아직 지원하지 않는 기능입니다.');
                return;
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
    }
}
/**
 * 
 * @param {Element} img 다운로드할 이미지
 * @param {String} fileName 다운로드할 사진 파일명 fileName.png
 * @param {String} textContent 다운로드 버튼 텍스트
 * @returns 클릭하면 사진이 다운로드되는 a태그
 */
function imageDownload(img, fileName = 'image') {
    let a = document.createElement('a');
    a.setAttribute('download', `${fileName}.png`);
    a.setAttribute('href', img.src);
    a.click();
}

function calculateSharpness(pixels, width, height) {
    let sum = 0;
    for (let y = 0; y < height - 1; y++) {
        for (let x = 0; x < width - 1; x++) {
            const index = (y * width + x) * 4;
            const indexRight = (y * width + (x + 1)) * 4;
            const indexBottom = ((y + 1) * width + x) * 4;

            const deltaX = Math.abs(pixels[index] - pixels[indexRight]) +
                Math.abs(pixels[index + 1] - pixels[indexRight + 1]) +
                Math.abs(pixels[index + 2] - pixels[indexRight + 2]);

            const deltaY = Math.abs(pixels[index] - pixels[indexBottom]) +
                Math.abs(pixels[index + 1] - pixels[indexBottom + 1]) +
                Math.abs(pixels[index + 2] - pixels[indexBottom + 2]);

            sum += deltaX + deltaY;
        }
    }
    return sum / (width * height);
}

function calculateNoise(pixels) {
    let sum = 0;
    for (let i = 0; i < pixels.length; i += 4) {
        const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        sum += Math.abs(pixels[i] - avg) + Math.abs(pixels[i + 1] - avg) + Math.abs(pixels[i + 2] - avg);
    }
    return sum / (pixels.length / 4);
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
}
function exitFullScreen() {
    if (document.exitFullscreen) return document.exitFullscreen();
    if (document.webkitCancelFullscreen) return document.webkitCancelFullscreen();
    if (document.mozCancelFullScreen) return document.mozCancelFullScreen();
    if (document.msExitFullscreen) return document.msExitFullscreen();
}