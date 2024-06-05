document.getElementById('imageUpload').addEventListener('change', function(e) {
    let file = e.target.files[0];
    let img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function() {
        detectWaterDropRadius(img);
    }
});

function detectWaterDropRadius(img) {
    let src = cv.imread(img);
    let dst = new cv.Mat();
    let gray = new cv.Mat();
    let circles = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    cv.GaussianBlur(gray, gray, new cv.Size(9, 9), 2, 2);
    cv.HoughCircles(gray, circles, cv.HOUGH_GRADIENT, 1, gray.rows / 8, 100, 30, 0, 0);

    let canvas = document.getElementById('canvasOutput');
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    let radius = 0;
    for (let i = 0; i < circles.cols; ++i) {
        let x = circles.data32F[i * 3];
        let y = circles.data32F[i * 3 + 1];
        radius = circles.data32F[i * 3 + 2];
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    src.delete(); dst.delete(); gray.delete(); circles.delete();

    document.getElementById('calculateButton').onclick = function() {
        let pressureDifference = parseFloat(document.getElementById('pressureInput').value);
        let surfaceTension = (pressureDifference * radius) / 2;
        document.getElementById('surfaceTensionOutput').innerText = surfaceTension.toFixed(2);
    }
}
