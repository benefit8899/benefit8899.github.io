function setCurrenDate(tagId) {
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    document.getElementById(tagId).value = day + '/' + month + '/' + year;

}
function loadMonths() {
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    var ddlmonth = document.getElementById("selectermonth");
    for (var i = 1; i <= 12; i++) {
        var option = document.createElement("option");
        option.text = monthNames[i - 1];
        option.value = i;
        ddlmonth.add(option);
    }
}
function loadYears() {
    var currentyear = new Date().getFullYear();
    var ddlyear = document.getElementById("selecteryear");
    for (var i = currentyear - 100; i < currentyear + 100; i++) {
        var option = document.createElement("option");
        option.text = i
        option.value = i;
        ddlyear.add(option);
    }
    ; ddlyear.value = currentyear;
}
function loadDayOfWeeks() {
    var dayofweeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var dayofweeks_div = document.getElementsByClassName('dayofweeks')[0];
    for (var i = 0; i < dayofweeks.length; i++) {
        var input_elem = document.createElement('BUTTON');
        input_elem.innerHTML = dayofweeks[i];
        input_elem.className = "dayofweek--elem";
        dayofweeks_div.appendChild(input_elem);
    }

}
function daysInMonth(month,year) {
    return new Date(year, month, 0).getDate();
}
function loadDays() {
    var currentdate = new Date();
    var dayonweek = currentdate.getDay();
    var numberdayofmonth = daysInMonth(currentdate.getMonth() + 1, currentdate.getFullYear());
    var dayofweeks_div = document.getElementsByClassName('dayofweeks')[0];
    console.log("hear");

    var input_div = document.createElement('div');
    for (var i = 0; i < dayonweek ; i++) {
        var input_elem = document.createElement('BUTTON');
        input_elem.innerHTML = "_";
        input_elem.className = "dayofweek--elem daynull";
        input_div.appendChild(input_elem);
    }
    for (var i = dayonweek; i < numberdayofmonth + dayonweek; i++) {
        if (i % 7 === 0)
        {
            dayofweeks_div.appendChild(input_div);
            input_div = document.createElement('div');
        }
        var input_elem = document.createElement('BUTTON');
        input_elem.innerHTML = i - dayonweek + 1;
        input_elem.className = "dayofweek--elem days";
        input_div.appendChild(input_elem);
    }
    dayofweeks_div.appendChild(input_div);
}
function calendar(tagId) {
    setCurrenDate(tagId);
    loadMonths();
    loadYears();
    loadDayOfWeeks();
    loadDays();
}


