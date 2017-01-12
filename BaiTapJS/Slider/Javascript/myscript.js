function moveElement(elementID, final_x, final_y, interval) {
    var elem = document.getElementById(elementID);
    if (elem.movement) clearTimeout(elem.movement);

    // Xác định vị trí
    var xpos = parseInt(elem.style.left);
    var ypos = parseInt(elem.style.top);

    // Sau khi dịch chuyển tới vị trí thì dừng
    if (xpos == final_x && ypos == final_y) return true;

    // Tính vị trí dịch chuyển sau mỗi thời gian dừng
    if (xpos < final_x) {
        var dist = Math.ceil((final_x - xpos) / 10);
        xpos = xpos + dist;
    }
    if (xpos > final_x) {
        var dist = Math.ceil((xpos - final_x) / 10);
        xpos = xpos - dist;
    }
    if (ypos < final_y) {
        var dist = Math.ceil((final_y - ypos) / 10);
        ypos = ypos + dist;
    }
    if (ypos > final_y) {
        var dist = Math.ceil((ypos - fina_y) / 10);
        ypos = ypos - dist;
    }

    // Di chuyển phần tử
    elem.style.left = xpos + "px";
    elem.style.top = ypos + "px";

    // Gọi lại hàm dịch chuyển sau khi dịch được 1 px
    var repeat = "moveElement('" + elementID + "'," + final_x + ", " + final_y + ", " + interval + ")";
    elem.movement = setTimeout(repeat, interval);
}
function previous() {
    if (move < 0) move += box_width;
    moveElement('slider', move, 0, 10);
}
function next() {
    move = (move <= endpos) ? 0 : (move - box_width);
    moveElement('slider', move, 0, 10);
}
function slider() {
    if (!document.getElementById) return false;
    var slider = document.getElementById('slider');
    var wrap_slider = document.getElementById('wrap-slider');

    // Định kiểu cho slider nếu chưa được thiết lập
    if (!slider.style.position) slider.style.position = "absolute";
    if (!slider.style.left) slider.style.left = "0px";
    if (!slider.style.top) slider.style.top = "0px";

    // Thiết lập các thông số cho slider
    var box_arr = slider.childNodes;
    var box_quantity = 0;
    for (var i = 0; i < box_arr.length; i++) {
        if (box_arr[i].className == 'slide-box') {
            box_quantity++;
            box_width = box_arr[i].offsetWidth;
            box_height = box_arr[i].offsetHeight;
        }
    }

    wrap_slider.style.height = box_height + "px";
    wrap_slider.style.width = box_width + "px";
    slider.style.width = (box_width * box_quantity) + "px";
    move = 0; endpos = -(box_width * 3);

    // Tự động chạy slider
    var idSet = setInterval('next()', 5000);

    // next_slide , prev_slide
    var next_slide = document.getElementById("next-slide");
    var prev_slide = document.getElementById("prev-slide");

    next_slide.onclick = function () {
        next(); clearInterval(idSet);
        idSet = setInterval('next()', 5000);
    }
    prev_slide.onclick = function () {
        previous(); clearInterval(idSet);
        idSet = setInterval('next()', 5000);
    }
}