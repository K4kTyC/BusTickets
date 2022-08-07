const picker = new tempusDominus.TempusDominus(document.getElementById('datetimepicker-from'));

$('#trip-search-submit').on('click', () => {
	let date = dayjs(picker.dates.picked[0]).format('YYYY-MM-DD');

	let start = capitalize($('#trip-from').val().toLowerCase());
	let finish = capitalize($('#trip-to').val().toLowerCase());

	window.location.assign(`/trips?search&date=${date}&start=${start}&finish=${finish}`);
});

let swapStationsDeg = 0;
document.getElementById('swap-stations').addEventListener('click', function () {
	let fromInput = document.getElementById('trip-from');
	let toInput = document.getElementById('trip-to');
	let tmp = fromInput.value;
	fromInput.value = toInput.value;
	toInput.value = tmp;
	swapStationsDeg === 0 ? swapStationsDeg = 180 : swapStationsDeg = 0;
	document.getElementById('swap-stations').firstElementChild.style.transform = 'rotate(' + swapStationsDeg + 'deg)';
});
