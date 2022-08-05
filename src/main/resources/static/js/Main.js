processUrlParams()

function processUrlParams() {
	const urlParams = new URLSearchParams(window.location.search);
	if (urlParams.has('needLogin')) {
		$('#modal-account').modal('show')
		$('#login-tab').tab('show')
		history.replaceState(null, '', '/')
	}
}

window.onload = () => {
	dayjs.extend(window.dayjs_plugin_utc)
	dayjs.extend(window.dayjs_plugin_timezone)
	dayjs.locale('ru');
	dayjs.tz.setDefault('Europe/Minsk');

	document.querySelectorAll('input[type="text"]')
		.forEach(e => e.addEventListener('blur', function () {
			this.value = this.value.trim();
		}));
}

function highlightElement(element) {
	const $el = $(element);
	$el.addClass('highlight');
	$el.children().on('click mouseenter focus', () => {
		$el.removeClass('highlight');
	});
}

function loadFromLocalStorage(valueName) {
	try {
		const serializedValue = localStorage.getItem(`${valueName}`);
		if (serializedValue === null || serializedValue === undefined || serializedValue === 'undefined') {
			return undefined;
		}

		return JSON.parse(serializedValue);
	} catch (err) {
		console.error(err);
		return undefined;
	}
}

function removeFromLocalStorage(valueName) {
	try {
		localStorage.removeItem(`${valueName}`);
	} catch (err) {
		console.error(err);
	}
}

function saveToLocalStorage(valueName, value) {
	try {
		const serializedState = JSON.stringify(value);
		localStorage.setItem(`${valueName}`, serializedState);
	} catch (err) {
		console.error(err);
	}
}

function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function minutesToHours(timeInMinutes) {
	let time = timeInMinutes
	if (time < 60) {
		time = time.toString() + ' мин'
	} else {
		let hours = Math.floor(time / 60)
		let minutes = time - (hours * 60)
		time = hours.toString() + ' ч, ' + minutes.toString() + ' мин'
	}
	return time
}

function mapContainsSameValueWithDifferentKey(map, val, key) {
	for (let [k, v] of map) {
		if (v === val && k !== key) {
			return true
		}
	}
	return false
}
