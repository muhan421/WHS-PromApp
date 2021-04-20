function leadingZeros(number) {
	if (number < 10) {
		return "000" + number;
	} else if (number < 100) {
		return "00" + number;
	} else if (number < 1000) {
		return "0" + number;
	} else {
		return number;
	}
}
