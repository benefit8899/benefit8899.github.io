/**
	* Function valitdate user name
	* Return {boolean}
	* Function will return true if user is valid false if it is invalid
*/
function checkUsername() {
	var username = document.getElementById('username').value;
	var userAlert = document.getElementById('usernameAlert');
	var testCase = checkInput(username);
	switch (testCase) {
		case 0: {
			userAlert.innerHTML = 'Please enter username in 8-20 characters.';
			return false;
			break;
		}
		case 1: {
			userAlert.innerHTML = 'Please enter correct format for username';
			return false;
			break;
		}
		default: {
			userAlert.innerHTML = 'Correct';
			return true;
		}
	}
}
/**
	* Function valitdate user password
	* Return {boolean}
	* Function will return true if user is valid false if it is invalid
*/
function checkPassword() {
	var password = document.getElementById('password').value;
	var passAlert = document.getElementById('passwordAlert');
	var testCase = checkInput(password);
	switch (testCase) {
		case 0: {
			passAlert.innerHTML = 'Please enter password in 8-20 characters.';
			return false;
			break;
		}
		case 1: {
			passAlert.innerHTML = 'Please enter correct format for password';
			return false;
			break;
		}
		default: {
			passAlert.innerHTML = 'Correct';
			return true;
		}
	}
}
/**
	* Function valitdate input
	* Return {int}
	* Function will return error code
*/
function checkInput(input) {
	if (input.length < 8 || input.length > 20) {
		return 0;
	}else{
		var pattern = /^([0-9a-zA-Z]{8,})*$/;
		if (!pattern.test(input)) {
			return 1;
		}
	}
	return 3;
}
/**
	* Function valitdate email
	* Return {boolean}
	* Function will return true if user is valid false if it is invalid
*/
function checkEmail() {
	var email = document.getElementById('email').value;
	var emailAlert = document.getElementById('emailAlert');
	if (email.length == 0) {
		emailAlert.innerHTML = 'Please enter your email address.';
	} else {
		var pattern = /^([0-9a-zA-Z])*@(([a-z])*\.([a-z]{3}))*$/;
		if (pattern.test(email)) {
			emailAlert.innerHTML = 'Correct';
			return true;
		} else {
			emailAlert.innerHTML = 'Please enter correct format for email address';
			return false;
		}
	}
}
/**
	* Function send request to server
*/
function sendRequest() {
	var testUsername = checkUsername();
	var testPassword = checkPassword();
	var testEmail = checkEmail();
	var testBirdthday = false;
	if (document.getElementById('dateSelected').value.length == 0) {
		document.getElementById('birdthdayAlert').innerHTML = 'Please enter your birdthday.';
		return false;
	}
	if (testUsername && testPassword && testEmail) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				alert(this.responseText);
			}
		}
		var myForm = document.forms['form_signin'];
		xmlHttp.open('post',myForm.action, true);
		data = new FormData(myForm);
		xmlHttp.send(data);
		return false;
	} else {
		
	}
	return true;
}
/**
	* Function reset error message
*/
function resetValue() {
	document.getElementById('usernameAlert').innerHTML = "";
	document.getElementById('passwordAlert').innerHTML = "";
	document.getElementById('emailAlert').innerHTML = "";
	document.getElementById('birdthdayAlert').innerHTML = "";
}