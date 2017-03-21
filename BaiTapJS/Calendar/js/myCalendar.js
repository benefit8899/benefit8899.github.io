//parameter for all
var MONTH_IN_YEAR = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Septemper', 'October', 'November', 'December');
var DAY_IN_MONTH = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
var WEEK_DAY = new Array('SUN', 'MON', 'TUE', 'WEN', 'THU', 'FRI', 'SAT');
var datePicker = document.getElementById('datePicker');
var CURRENT_DATE = new Date().getDate();
var CURRENT_MONTH = new Date().getMonth();
var CURRENT_YEAR = new Date().getFullYear();
var POSITION_DATE = 0;

// Draw calendar
function initCalendar() {
	var table = document.createElement('table');
	table.setAttribute('id', 'calendar');
	var form = document.createElement('form');
	form.appendChild(table);
	var container = document.getElementById('datePicker');
	container.appendChild(form);
	drawAction();
	drawDay();
	drawCalendar();
}

function onLoad() {
	initCalendar();
}

// Show calendar when user click on textfield
function inputClick() {
	document.getElementById('calendar').style.display = 'block';
	CURRENT_DATE = new Date().getDate();
	CURRENT_MONTH = new Date().getMonth();
	CURRENT_YEAR = new Date().getFullYear();
	setData();
	updateAction();
}

// Draw Action menu
function drawAction() {
	var trAction = document.createElement('tr');
	//button previous year contaniner
	var tdPrevYear = document.createElement('td');
	tdPrevYear.setAttribute('class', 'col backmonth');
	tdPrevYear.setAttribute('onclick', 'prevYearClick()');

	//button previous month contaniner
	var tdPrevMonth = document.createElement('td');
	tdPrevMonth.setAttribute('class', 'col backday');
	tdPrevMonth.setAttribute('onclick', 'prevMonthClick()');

	//combobox month contaniner
	var tdMonth = document.createElement('td');
	tdMonth.setAttribute('colspan', '2');
	tdMonth.setAttribute('class', 'col');
	//combobox month
	var cbMonth = document.createElement('select');
	cbMonth.setAttribute('id', 'monthSelected');
	cbMonth.setAttribute('class', 'comboboxMonth');
	cbMonth.setAttribute('onchange', 'cbMonthChange(this)');
	//set value for combobox month
	for (var month = 0; month < MONTH_IN_YEAR.length; month++) {
		var opMonth = document.createElement('option');
		opMonth.setAttribute('value', month);
		opMonth.innerHTML = MONTH_IN_YEAR[month];
		cbMonth.appendChild(opMonth);
	}
	tdMonth.appendChild(cbMonth);
	var tdMonthEmpty = document.createElement('td');
	//combobox year contaniner
	var tdYear = document.createElement('td');
	tdYear.setAttribute('class', 'col');
	//combobox year
	var cbYear = document.createElement('select');
	cbYear.setAttribute('id', 'yearSelected');
	cbYear.setAttribute('class', 'comboboxYear');
	cbYear.setAttribute('onchange', 'cbYearChange(this)');
	//set value for combobox year
	for (var year = 1900; year < 2100; year++) {
		var opYear = document.createElement('option');
		opYear.setAttribute('value', year);
		if (year == CURRENT_YEAR) {
			opYear.setAttribute('selected', 'selected');
		}
		opYear.innerHTML = year;
		cbYear.appendChild(opYear);
	}
	tdYear.appendChild(cbYear);

	//button next month container
	var tdNextMonth = document.createElement('td');
	tdNextMonth.setAttribute('class', 'col nextday');
	tdNextMonth.setAttribute('onclick', 'nextMonthClick()');

	//button next year container
	var tdNextYear = document.createElement('td');
	tdNextYear.setAttribute('class', 'col nextmonth');
	tdNextYear.setAttribute('onclick', 'nextYearClick()');

	trAction.appendChild(tdPrevYear);
	trAction.appendChild(tdPrevMonth);
	trAction.appendChild(tdMonth);
	trAction.appendChild(tdYear);
	trAction.appendChild(tdNextMonth);
	trAction.appendChild(tdNextYear);

	var table = document.getElementById('calendar');
	table.appendChild(trAction);

}

// Draw day on calendar
function drawDay() {
	var trDay = document.createElement('tr');
	for (var day = 0; day < WEEK_DAY.length; day++) {
		var tdDay = document.createElement('td');
		tdDay.setAttribute('class', 'day');
		tdDay.innerHTML = WEEK_DAY[day];
		trDay.appendChild(tdDay);
	}
	var table = document.getElementById('calendar');
	table.appendChild(trDay);
}

// Draw week calendar
function drawCalendar() {
	var count = 1;
	for (var week = 0; week < 6; week++) {
		var trWeek = document.createElement('tr');
		for (var day = 0; day < 7; day++) {
			var tdDay = document.createElement('td');
			tdDay.setAttribute('id', 'item_' + count);
			tdDay.setAttribute('class', 'col');
			tdDay.setAttribute('onclick', 'dateSelected(this)');
			trWeek.appendChild(tdDay);
			count++;
		}
		var table = document.getElementById('calendar');
		table.appendChild(trWeek);
	}
	setData();
}

function setData() {
	//Get curent date
	var day = new Date(CURRENT_YEAR, CURRENT_MONTH, 1).getDay();
	//Get first date of month position on calendar
	POSITION_DATE = parseInt(day);
	var currentDate = new Date().getDate();
	var currentMonth = new Date().getMonth();
	var currentYear = new Date().getFullYear();
	//Get previous month, next month value
	var prevMonth = CURRENT_MONTH - 1;
	var nextMonth = CURRENT_MONTH + 1;
	//Check nam nhuan
	if ((CURRENT_YEAR % 4 == 0) && (CURRENT_YEAR % 100 != 0)) {
		DAY_IN_MONTH[1] = 29;
	} else if (CURRENT_YEAR % 400 == 0) {
		DAY_IN_MONTH[1] = 29;
	}
	if (prevMonth < 0) {
		prevMonth = 11;
	}
	if (nextMonth > 11) {
		nextMonth = 0;
	}
	day++;
	var dayOfMonth = DAY_IN_MONTH[CURRENT_MONTH];
	var dayOfPrevMonth = 0;
	var dayOfNextMonth = 0;
	if (CURRENT_MONTH - 1 < 0) {
		dayOfPrevMonth = DAY_IN_MONTH[11];
	} else {
		dayOfPrevMonth = DAY_IN_MONTH[CURRENT_MONTH - 1];
	}
	if (CURRENT_MONTH + 1 > 11) {
		dayOfNextMonth = DAY_IN_MONTH[0];
	} else {
		dayOfNextMonth = DAY_IN_MONTH[CURRENT_MONTH + 1];
	}
	//Fill date of current month to calendar start at first date of current month position
	var dayPosition = 1;
	var dayPositionStart = day - 1;
	var dayPositionStop = parseInt(day) + dayOfMonth;
	for (var countDate = 0; countDate < dayOfMonth; countDate++) {
		var itemName = 'item_' + (countDate + day);
		document.getElementById(itemName).innerHTML = countDate + 1;
		document.getElementById(itemName).className = 'activeDate';
		document.getElementById(itemName).setAttribute('month', CURRENT_MONTH + 1);
		document.getElementById(itemName).setAttribute('year', CURRENT_YEAR);
		if (countDate == currentDate && currentMonth == CURRENT_MONTH && currentYear == CURRENT_YEAR) {
			document.getElementById(itemName).className = 'currentDate';
		}
		dayPosition++;
	}
	//Fill date of previous month and next month to calendar start at first date of current month position - 1
	for (var countDate = dayPositionStart; countDate > 0; countDate--) {
		var itemName = 'item_' + countDate;
		document.getElementById(itemName).innerHTML = dayOfPrevMonth;
		document.getElementById(itemName).className = 'deactiveDate';
		if (CURRENT_MONTH - 1 < 0) {
			document.getElementById(itemName).setAttribute('month', 12);
			document.getElementById(itemName).setAttribute('year', CURRENT_YEAR);
		} else {
			document.getElementById(itemName).setAttribute('month', CURRENT_MONTH);
			document.getElementById(itemName).setAttribute('year', CURRENT_YEAR);
		}
		dayOfPrevMonth--;
	}
	//Fill date of next month and next month to calendar start at last date of current month position + 1
	for (var countDate = 0; countDate <= (42 - dayPositionStop); countDate++) {
		var itemName = 'item_' + (countDate + dayPositionStop);
		document.getElementById('item_' + (countDate + dayPositionStop)).innerHTML = countDate + 1;
		document.getElementById(itemName).className = 'deactiveDate';
		if (CURRENT_MONTH + 1 > 11) {
			document.getElementById(itemName).setAttribute('month', 1);
			document.getElementById(itemName).setAttribute('year', CURRENT_YEAR + 2);
		} else {
			document.getElementById(itemName).setAttribute('month', CURRENT_MONTH + 2);
			document.getElementById(itemName).setAttribute('year', CURRENT_YEAR);
		}
	}
}

// Delete data to draw new calendar
function deleteData() {
	for (var date = 1; date <= 35; date++) {
		document.getElementById('item_' + date).innerHTML = '';
	}
}

// Update info for action menu
function updateAction() {
	document.getElementById('monthSelected').value = CURRENT_MONTH;
	document.getElementById('yearSelected').value = CURRENT_YEAR;
}

// Execute prev month button click
function prevMonthClick() {
	deleteData();
	CURRENT_MONTH--;
	if (CURRENT_MONTH < 0) {
		CURRENT_MONTH = 11;
		CURRENT_YEAR--;
	}
	updateAction();
	setData();
}

// Execute prev year button click
function prevYearClick() {
	deleteData();
	CURRENT_YEAR--;
	if (CURRENT_YEAR < 1900) {
		CURRENT_YEAR = 2099;
	}
	updateAction();
	setData();
}

// Execute next month button click
function nextMonthClick() {
	deleteData();
	CURRENT_MONTH++;
	if (CURRENT_MONTH > 11) {
		CURRENT_MONTH = 0;
		CURRENT_YEAR++;
	}
	updateAction();
	setData();
}

// Execute next year button click
function nextYearClick() {
	deleteData();
	CURRENT_YEAR++;
	if (CURRENT_YEAR > 2099) {
		CURRENT_YEAR = 1900;
	}
	updateAction();
	setData();
}

// Execute combo box month change
function cbMonthChange(obj) {
	deleteData();
	CURRENT_MONTH = obj.value;
	updateAction();
	setData();
}

// Execute combo box year change
function cbYearChange(obj) {
	deleteData();
	CURRENT_YEAR = obj.value;
	updateAction();
	setData();
}

// format output number
String.prototype.pad = function (size) {
	var s = String(this);
	while (s.length < (size || 2)) { s = "0" + s; }
	return s;
}
Number.prototype.pad = function (size) {
	var s = this + "";
	return s.pad();
}

// Execute when date was selected
function dateSelected(obj) {
	var monthOutputTemp = obj.getAttribute('month');
	var monthOutput = parseInt(monthOutputTemp);
	var yearOutput = obj.getAttribute('year');
	document.getElementById('dateSelected').value = (obj.innerHTML).pad() + '/' + (monthOutput).pad() + '/' + yearOutput;
	document.getElementById('calendar').style.display = 'none';
}
