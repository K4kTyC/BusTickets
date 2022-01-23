let pagination = new Pagination(() => {
	$('#station-list-elements *').remove();
	if ($('#station-filter').val() !== "") {
		getFilteredStationList().then(fillPageWithStations);
	} else {
		getStationList().then(fillPageWithStations);
	}
});

let stationList;

$(() => {
	pagination.elementsRefreshFunc();
})

$('#station-submit').on('click', () => {
	let stationDto = {
		name: $('#station-name').val()
	}
	sendStationDto('/api/admin/stations', stationDto)

	$('#station-name').val("")
})

async function sendStationDto(url, dto) {
	const response = await fetch(url, {
		method: 'POST',
		mode: 'same-origin',
		credentials: 'same-origin',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(dto)
	})

	let stationsOnPage = $('[class*="station-list-content"]').length
	if (response.ok && stationsOnPage < 20) {
		const returned = await response.json()

		let pageTemplate = `
			<div class="col station-list-content py-3 m-2" id="station-${returned.id}">
				<div class="text-center station-info">
					<p class="station-name">${dto.name}</p>
					<p class="station-id">ID: ${returned.id}</p>
				</div>
				<div class="station-delete"><i class="fas fa-trash"></i></div>
			</div>`
		$('#station-list-elements').append(pageTemplate)
	}
}

async function getStationList() {
	const response = await fetch(`/api/admin/stations?page=${pagination.curPage - 1}`);
	const data = await response.json();
	pagination.lastPage = data.totalPages;
	stationList = data.content;
}

function fillPageWithStations() {
	let stations = stationList;

	for (let i = 0; i < stations.length; i++) {
		let station = stations[i];

		let pageTemplate = `
			<div class="col station-list-content py-3 m-2" id="station-${station.id}">
				<div class="text-center station-info">
					<p class="station-name">${station.name}</p>
					<p class="station-id">ID: ${station.id}</p>
				</div>
				<div class="station-delete" id="rm-${station.id}"><i class="fas fa-trash"></i></div>
			</div>`;

		$('#station-list-elements').append(pageTemplate);

		$(`#rm-${station.id}`).on('click', function () {
			if (confirm("Удалить станцию?")) {
				removeStation(station.id);
				$(`#station-${station.id}`).remove();
			}
		});
	}

	pagination.update();
}

async function getFilteredStationList() {
	let filter = $('#station-filter').val();

	const response = await fetch(`/api/admin/stations?page=${pagination.curPage - 1}&filter=${filter}`);
	const data = await response.json();
	pagination.lastPage = data.totalPages;
	stationList = data.content;
}

async function removeStation(id) {
	const response = await fetch('/api/admin/stations', {
		method: 'DELETE',
		mode: 'same-origin',
		credentials: 'same-origin',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(id)
	})
	return await response.json()
}

$('#station-filter').on('input', () => {
	clearTimeout();
	pagination.curPage = 1;
	setTimeout(() => {
		pagination.elementsRefreshFunc();
	}, 800);
})
