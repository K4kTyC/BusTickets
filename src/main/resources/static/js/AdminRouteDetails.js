let pageNum = 0
let lastPage = 0
let routeDetails
let busList
let tripList

const picker = new tempusDominus.TempusDominus(document.getElementById('datetimepicker-trip'), {
	display: {
		components: {
			clock: true
		}
	},
	promptTimeOnDateChange: true
});

$(() => {
	let routeId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
	getRouteDetails(routeId).then(fillPageWithRouteDetails)
	getBusList().then(fillSelectWithBuses)
	getTrips(routeId).then(fillPageWithTrips)

	$('#trip-submit').on('click', () => {

		// TODO: если автобус в выбранное время уже занят другим рейсом, показать ошибку

		let busId
		for (const bus of busList) {
			if (bus.number === parseInt(selectParts[0].$input.val())) {
				busId = bus.id
				break
			}
		}

		let tripDto = {
			routeId: routeId,
			busId: busId,
			datetime: picker.dates.picked[0]
		}
		sendTripDto('/api/admin/trips', tripDto)
	})
})

async function getRouteDetails(routeId) {
	const response = await fetch(`/api/admin/routes/${routeId}`)
	routeDetails = await response.json()
}

async function getBusList() {
	const response = await fetch('/api/admin/buses?unpaged=true')
	const data = await response.json()
	busList = data.content
}

async function getTrips(routeId) {
	const response = await fetch(`/api/admin/routes/${routeId}/trips?page=${pageNum}`)
	const data = await response.json()
	lastPage = data.totalPages - 1
	tripList = data.content
}

async function sendTripDto(url, dto) {
	await fetch(url, {
		method: 'POST',
		mode: 'same-origin',
		credentials: 'same-origin',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(dto)
	});
}


function fillPageWithRouteDetails() {
	let titleTempl = `${routeDetails.name} #${routeDetails.id}`
	$('#route-name').append(titleTempl)

	let stations = routeDetails.routeStations

	for (let i = 0; i < stations.length - 1; i++) {
		let station1 = stations[i]
		let station2 = stations[i + 1]
		let timegap = minutesToHours(station2.timeGap)
		let price = station2.price / 100

		let stationTempl = `
            <div class="route-station-info">
                <div class="col-start">${station1.stationName}</div>
                <div class="col-timegap">
                    <div class="timegap-line"></div>
                    <div class="timegap-time">${timegap}</div>                    
                </div>
                <div class="col-finish">${station2.stationName}</div>
                <div class="col-price">${price} BYN</div>
            </div>`
		$('.route-stations').append(stationTempl)
	}

	let sumTime = 0
	for (const station of stations) {
		sumTime += station.timeGap
	}

	let routeSummaryTempl = `
        <div class="sum-time">${minutesToHours(sumTime)}</div>   
        <div class="sum-price">${routeDetails.price / 100} BYN</div>   
    `
	$('.route-summary').append(routeSummaryTempl)
}

function fillPageWithTrips() {
	let trips = tripList

	for (let i = 0; i < trips.length; i++) {
		let trip = trips[i]
		let stations = trip.routeDto.routeStations

		let sumTime = 0
		for (const station of stations) {
			sumTime += station.timeGap
		}

		let stationStart = stations[0].stationName
		let datetimeStart = dayjs(trip.datetime).locale('ru')
		let stationFinish = stations[stations.length - 1].stationName
		let datetimeFinish = dayjs(trip.datetime).add(sumTime, 'minutes').locale('ru')

		let tripTempl = `
            <div class="trip-info">
                <div class="col-id">${trip.id}</div>
                <div class="col-bus-number">${trip.busDto.number}</div>
                <div class="col-trip-datetime">
                    <p class="trip-time">${datetimeStart.format('HH:mm')}</p>
                    <p class="trip-date">${datetimeStart.format('DD.MM.YYYY')}</p>
                    <p class="trip-station">${stationStart}</p>
                </div>
                <div class="col-trip-datetime">
                    <p class="trip-time">${datetimeFinish.format('HH:mm')}</p>
                    <p class="trip-date">${datetimeFinish.format('DD.MM.YYYY')}</p>
                    <p class="trip-station">${stationFinish}</p>
                </div>
            </div>`

		$('.trip-list').append(tripTempl)
	}

	$('[id^=page-link-]').remove()

	if (lastPage > 0) {
		for (let i = 0; i < lastPage + 1; i++) {
			let num = i + 1
			let pageTemplate = `
            <li class="page-item" id="page-link-${num}">
                <a class="pagination-link ${pageNum === i ? "current" : ""}" id="page-${num}" aria-label="${num}">
                    <span aria-hidden="true">${num}</span>
                </a>
            </li>`

			$('#page-next-li').before(pageTemplate)

			if (pageNum !== i) {
				$(`#page-link-${num}`).on('click', () => {
					pageNum = i
					$('.trip-list *').remove()
					let routeId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
					getTrips(routeId).then(fillPageWithTrips)
				})
			}
		}
		$('#pagination').show()
	} else {
		$('#pagination').hide()
	}
}

function fillSelectWithBuses() {
	for (let i = 0; i < busList.length; i++) {
		let bus = busList[i]

		let pageTemplate = `<li>${bus.number}</li>`
		$('#select-bus ul').append(pageTemplate)
	}
	selectParts.push({
		$input: $('#select-bus input'),
		$arrow: $('#select-bus .select-arrow'),
		$list: $('#select-bus ul'),
		$options: $('#select-bus li'),
		valueArray: busList
	})
	addHandlersForSelect(0, 'Фильтр по номеру', 'Выберите автобус')
}


