let stationList;
const chosenStations = new Map();
let stationOnPageAmount = 0;

let routeList;

$(function () {
	getStationList().then(() => {
		addStation();
		addStation();
	})

	$('#route-submit').on('click', () => {
		let routeDto = {
			name: $('#route-name').val(),
			routeStations: []
		}

		for (let i = 0; i < stationOnPageAmount; i++) {
			let id
			for (const s of stationList) {
				if (s.name === chosenStations.get(i)) {
					id = s.id
					break
				}
			}

			let timeGap = i === 0 ? 0 : $(`#route-station-info-${i} #route-station-time`).val();
			let price = i === 0 ? 0 : (parseFloat($(`#route-station-info-${i} #route-station-price`).val()) * 100).toFixed();

			let routeStation = {
				stationId: id,
				timeGap: timeGap,
				price: price
			}
			routeDto.routeStations.push(routeStation)
		}
		sendRoute('/api/admin/routes', routeDto)
	})

	getRouteList().then(addRoutes)
})

async function getStationList() {
	const response = await fetch('/api/admin/stations?unpaged=true')
	const data = await response.json()
	stationList = data.content
}

async function sendRoute(url, dto) {
	const response = await fetch(url, {
		method: 'POST',
		mode: 'same-origin',
		credentials: 'same-origin',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(dto)
	})
	const returned = await response.json()
	console.log(returned)
}

function fillSelectWithStations(stationNum) {
	const $select = $(`#route-station-info-${stationNum} #select-station`);

	for (let i = 0; i < stationList.length; i++) {
		const station = stationList[i];
		const templ = `<li>${station.name}</li>`;
		$select.find('ul').append(templ);
	}

	const placeholders = {
		focused: 'Фильтр по названию',
		blurred: 'Выберите станцию'
	};
	new CustomSelect($select, placeholders, stationList, true, chosenStations);
}

function addStation() {
	let stationNum = stationOnPageAmount++;
	addStationInfoTemplate(stationNum);
	fillSelectWithStations(stationNum);

	if (stationOnPageAmount >= stationList.length) {
		$('#add-station').hide();
	}
}

function addStationInfoTemplate(num) {
	let pageTemplate = `
        <div class="route-station-info" id="route-station-info-${num}">
            <div class="col-select form-select" id="select-station">
                <input class="chosen-value" type="text" value="" placeholder="Выберите станцию">
                <div class="select-arrow">
                    <i class="fas fa-chevron-left"></i>
                </div>
                <ul class="value-list"></ul>
            </div>

            <div class="col-price input-wrap">
                <input class="input-field" id="route-station-price" type="text" placeholder="Цена (например, 4.20)" ${num === 0 ? 'value="—" disabled' : ''}>
            </div>

            <div class="col-time input-wrap">
                <input class="input-field" id="route-station-time" type="text" placeholder="Время в пути, мин" ${num === 0 ? 'value="—" disabled' : ''}>
            </div>
        </div>`

	$('#route-stations').append(pageTemplate)

	if (num === 0) {
		$(`#route-station-info-${num}`).append(`
            <div class="col-add-station">
                <span id="add-station"><i class="fas fa-plus"></i></span>
            </div>
`)

		$('#add-station').on('click', () => {
			addStation()
		})
	}
}

async function getRouteList() {
	const response = await fetch('/api/admin/routes')
	const data = await response.json()
	routeList = data.content
}

function addRoutes() {
	for (const route of routeList) {
		let id = route.id
		let name = route.name
		let stations = route.routeStations

		let templ = `
            <div class="route-list-content" id="route-${id}">
                <div class="route-name">${name}</div>
                <div class="route-stations"></div>
                <div class="functions">
					<div class="details">Подробнее</div>
					<div class="edit"></div>
					<div class="remove"></div>
				</div>
            </div>`
		$('#route-list-elements').append(templ)

		$(`#route-${id} .functions .details`).on('click', () => {
			window.location.assign(`/admin/routes/${id}`)
		})

		let sumPrice = route.price / 100;
		let sumTime = 0;

		let isFirstStation = true
		for (const station of stations) {
			sumTime += station.timeGap;

			let name = station.stationName
			let time = minutesToHours(station.timeGap)
			let price = (station.price / 100).toString(10) + ' BYN'

			if (isFirstStation) {
				time = '—';
				price = '—';
				isFirstStation = false;
			}

			let templ = `
				<div class="station">
					<div class="station-name">${name}</div>
                	<div class="station-time">${time}</div>
                	<div class="station-price">${price}</div>
				</div>
            `
			$(`#route-${id} .route-stations`).append(templ)
		}

		let summaryTempl = `
			<div class="summary">
				<div class="station-name">Всего:</div>
				<div class="station-time">${minutesToHours(sumTime)}</div>
				<div class="station-price">${sumPrice} BYN</div>
			</div>
		`
		$(`#route-${id} .route-stations`).append(summaryTempl)
	}
}
