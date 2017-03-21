<?php 
	$listUsername = Array('administrator', 'username1', 'username2');
	$username = $_POST['username'];
	for ($i = 0; $i < count($listUsername); $i++) { 
		if ($username == $listUsername[$i]) {
			echo 'Username already exits';
			break;
		}else if ($i == (count($listUsername) - 1)) {
			echo 'You can use that username';
		}
	}
?>