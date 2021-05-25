console.log('filter init hi');

// canvas 객체 생성
var canvas = $('#picture_canvas')[0];
var ctx = canvas.getContext('2d');

function drawImageData(image) {
    image.height *= canvas.offsetWidth / image.width;
    image.width = canvas.offsetWidth;

    if(image.height > canvas.offsetHeight){
        image.width *= canvas.offsetHeight / image.height;
        image.height = canvas.offsetHeight;
    }

    ctx.drawImage(image, 0, 0, image.width, image.height);
}

// click input button
var originalPixels;
$('#fileupload').on('change', function (e) {
    var file = e.target.files[0];
    var fileReader = new FileReader();

    fileReader.onload = function (e) {
        var image = new Image();
        image.src = e.target.result;
        image.onload = function () {
            drawImageData(image);
            originalPixels = ctx.getImageData(0,0, canvas.width, canvas.height);
        }
    };
    fileReader.readAsDataURL(file);
});


$('#selectColor').on('click', function () {
    var filteredData;
    // imageData를 가져온다.
    var pixels = originalPixels;
    // image processing
    var selectColor = $('input[name=color]:checked').val()
    if (selectColor === 'red') {
        filteredData = redFilter(pixels);
    }
    else if (selectColor === 'blue') {
        filteredData = blueFilter(pixels);
    }
    else if (selectColor === 'green') {
        filteredData = greenFilter(pixels);
    }

    // Canvas에 다시 그린다.
    ctx.putImageData(filteredData, 0 , 0);
});

// Filters
function invertFilter(pixels) {
    var d = pixels.data;
    for(var i=0; i<pixels.data.length; i+=4 ){
        d[i] = 255 - d[i];     // R
        d[i+1] = 255 - d[i+1]; // G
        d[i+2] = 255 - d[i+2]; // B
        d[i+3] = 255;          // Alpha
    }
    return pixels;
}

function grayscaleFilter(pixels) {
    var d = pixels.data;
    for(var i =0; i< d.length; i+=4){
        var r = d[i];
        var g = d[i+1];
        var b = d[i+2];

        var v = 0.2126*r + 0.7152*g + 0.0722*b;  // 보정값
        d[i] = d[i+1] = d[i+2] = v               // RBG 색을 같게 맞추자
    }
    return pixels;
}

function redFilter(pixels) {
    var d = pixels.data;
    for(var i=0; i<pixels.data.length; i+=4 ){
        var r = d[i];
        var g = d[i+1];
        var b = d[i+2];

        // d[i] = r*0.9588 + g*0.7044 + b*0.1368;
        // d[i+1] = r*0.2990 + g*0.5870 + b*0.1140;
        // d[i+2] = r*0.2392 + g*0.4696 + b*0.0912;


        d[i] = r*0.9 + g*0.1 + b*0.1;
        d[i+1] = r*0.2 + g*0.2 + b*0.2;
        d[i+2] = r*0.2 + g*0.2 + b*0.2;
    }
    return pixels;
}

function blueFilter(pixels) {
    var d = pixels.data;
    for(var i=0; i<pixels.data.length; i+=4 ){
        var r = d[i];
        var g = d[i+1];
        var b = d[i+2];

        d[i] = r*0.2 + g*0.2 + b*0.2;
        d[i+1] = r*0.2 + g*0.2 + b*0.2;
        d[i+2] = r*0.1 + g*0.1 + b*0.9;
    }
    return pixels;
}

function greenFilter(pixels) {
    var d = pixels.data;
    for(var i=0; i<pixels.data.length; i+=4 ){
        var r = d[i];
        var g = d[i+1];
        var b = d[i+2];

        d[i] = r*0.2 + g*0.2 + b*0.2;
        d[i+1] = r*0.1 + g*0.9 + b*0.1;
        d[i+2] = r*0.2 + g*0.2 + b*0.2;
    }
    return pixels;
}