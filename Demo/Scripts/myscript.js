

var Person = {
	_name,
	_age
}
function testIT()
{
	var p1 = new Person();
	p1.prototype._name = "Hồng";
	p1.prototype._age = 21;
	alert(p1._name);
}