let pagination = new Pagination(() => {
	$('#trip-list-elements *').remove();
	if (searchData !== undefined) {
		getFilteredTrips().then(fillPageWithTrips);
	} else {
		// TODO: скрывать уже отправившиеся, сделать кнопку для их отображения
		getTripList().then(fillPageWithTrips);
	}
});

let tripList;
let searchData;
const notFreeSeatList = new Map();

$(() => {
	const urlParams = new URLSearchParams(window.location.search);
	if (urlParams.has('search')) {
		searchData = {
			date: urlParams.get('date'),
			start: urlParams.get('start'),
			finish: urlParams.get('finish')
		};
		$('#trip-from').val(searchData.start);
		$('#trip-to').val(searchData.finish);

		// date as TempusDominus DateTime type
		let date = tempusDominus.DateTime.convert(dayjs(searchData.date).toDate());
		picker.dates.setValue(date);
	}
	pagination.elementsRefreshFunc();
})

async function getTripList() {
	const response = await fetch(`/api/trips?page=${pagination.curPage - 1}`);
	const data = await response.json();
	pagination.lastPage = data.totalPages;
	tripList = data.content;
	for (const trip of tripList) {
		await getSeatList(trip.id);
	}
}

async function getFilteredTrips() {
	const response = await fetch(`/api/trips/search?page=${pagination.curPage - 1}&datetime=${searchData.date}&start=${searchData.start}&finish=${searchData.finish}`);
	const data = await response.json();
	pagination.lastPage = data.totalPages;
	tripList = data.content;
	for (const trip of tripList) {
		await getSeatList(trip.id);
	}
}

async function getSeatList(tripId) {
	let response
	if (searchData === undefined) {
		response = await fetch(`/api/trips/${tripId}/seats`)
	} else {
		response = await fetch(`/api/trips/${tripId}/seats?stationStart=${searchData.start}&stationFinish=${searchData.finish}`)
	}
	const notFreeSeats = await response.json()
	notFreeSeatList.set(tripId, notFreeSeats)
}

function fillPageWithTrips() {
	let trips = tripList

	let title;
	if (searchData === undefined) {
		title = 'Ближайшие рейсы';
	} else {
		// TODO: fix дата иногда вставляется на англе, т.к. onload из мейна не успевает применить локаль для dayjs
		title = `${searchData.start} — ${searchData.finish}, ${dayjs(searchData.date).format('D MMMM (dddd)')}`
	}
	$('.list-of-content .title').text(title);

	$('.list-of-content .header').remove();

	let contentTempl;
	if (tripList.length === 0) {
		contentTempl = `
			<div class="no-content-text">К сожалению, рейсов ${searchData !== undefined ? 'по указанным критериям' : ''} пока нет.</div>
		`
	} else {
		contentTempl = `
			<div class="header">
				<div class="route">Маршрут</div>
				<div class="from">Отправление</div>
				<div class="to">Прибытие</div>
				<div class="bus">Автобус</div>
				<div class="price">Цена</div>
			</div>
		`
	}
	$(contentTempl).insertBefore($('#trip-list-elements'));

	for (let i = 0; i < trips.length; i++) {
		let trip = trips[i]
		let route = trip.routeDto
		let stations = trip.routeDto.routeStations

		let routeName = trip.routeDto.name
		let busClass = trip.busDto.model.busClassName

		let busNumber = trip.busDto.number
		let busModel = trip.busDto.model.name
		let seatAmount = countFreeSeats(trip.id, trip.busDto.model.numberOfSeats)

		let stationStartIndex, stationFinishIndex
		if (searchData !== undefined) {
			let stationStartName = searchData.start
			let stationFinishName = searchData.finish

			for (let j = 0; j < stations.length; j++) {
				if (stations[j].stationName === stationStartName) {
					stationStartIndex = j
				}
				if (stations[j].stationName === stationFinishName) {
					stationFinishIndex = j
				}
			}
		} else {
			stationStartIndex = 0
			stationFinishIndex = stations.length - 1
		}

		let startTimeGap = 0
		for (let j = 0; j < stationStartIndex; j++) {
			startTimeGap += stations[j + 1].timeGap
		}

		let sumTime = 0, sumPrice = 0
		for (let j = stationStartIndex; j < stationFinishIndex; j++) {
			sumTime += stations[j + 1].timeGap
			sumPrice += stations[j + 1].price
		}
		sumPrice /= 100

		let startTimeDate = dayjs(trip.datetime + "Z").tz().add(startTimeGap, 'minutes');
		let timeStart = startTimeDate.format('HH:mm')
		let dateStart = startTimeDate.format('DD.MM.YYYY')

		let finishTimeDate = startTimeDate.add(sumTime, 'minutes')
		let timeFinish = finishTimeDate.format('HH:mm')
		let dateFinish = finishTimeDate.format('DD.MM.YYYY')

		let stationStart = stations[stationStartIndex].stationName
		let stationFinish = stations[stationFinishIndex].stationName

		let tripTempl = `
            <div class="trip-list-content" id="trip-${trip.id}">
                <div class="col-content-route">
                    <span class="name">${routeName}</span>
                    <span class="bus-class">${busClass}-класс</span>
                </div>
                <div class="col-content-station station-from">
                    <p class="time">${timeStart}</p>
                    <p class="date">${dateStart}</p>
                    <p class="station">${stationStart}</p>
                </div>
                <div class="col-content-station station-to">
                    <p class="time">${timeFinish}</p>
                    <p class="date">${dateFinish}</p>
                    <p class="station">${stationFinish}</p>
                </div>
                <div class="col-content-bus">
                    <p class="seats">Свободно мест: ${seatAmount}</p>
                    <p class="model">${busModel}</p>
                    <p class="number">№ ${busNumber}</p>
                </div>
                <div class="col-content-price">
                    <p class="price">${sumPrice} BYN</p>
                    <a class="form-button" id="buy-ticket-${trip.id}"><span>купить</span></a>
                </div>
            </div>
        `
		$('#trip-list-elements').append(tripTempl)

		$(`#buy-ticket-${trip.id}`).on('click', () => {
			if (searchData === undefined) {
				window.location.assign(`/trips/${trip.id}`)
			} else {
				window.location.assign(`/trips/${trip.id}?search&start=${searchData.start}&finish=${searchData.finish}`)
			}
		})
	}

	pagination.update();

	if (searchData !== undefined) {
		$('.list-of-content')[0].scrollIntoView({
			behavior: 'smooth',
			block: 'start',
			inline: 'nearest'
		});
	}
}

function countFreeSeats(tripId, totalSeats) {
	let notFreeSeatsAmount = notFreeSeatList.get(tripId).length
	return totalSeats - notFreeSeatsAmount
}
