let pagination = new Pagination(() => {
	$('#order-list-elements *').remove();
	if (searchData !== undefined) {
		getOrdersList().then(fillPageWithOrders);
	} else {
		getPassengerList().then(fillPageWithPassengers);
	}
});

let searchData;
let passengerList;
let orderList;

$(() => {
	const urlParams = new URLSearchParams(window.location.search);
	if (urlParams.has('search')) {
		searchData = {
			name: urlParams.get('name'),
			lastname: urlParams.get('lastname')
		};
	}
	$('#order-search-submit').on('click', () => {
		let name = $('#passenger-name').val()
		let lastname = $('#passenger-lastname').val()

		window.location.assign(`/orders?search&name=${name}&lastname=${lastname}`)
	})
	pagination.elementsRefreshFunc();
})

async function getPassengerList() {
	const response = await fetch('/api/orders');
	const data = await response.json();
	//pagination.lastPage = data.totalPages;
	passengerList = data//.content;
}

async function getOrdersList() {
	const response = await fetch(`/api/orders/search?page=${pagination.curPage - 1}&name=${searchData.name}&lastname=${searchData.lastname}`);
	const data = await response.json();
	pagination.lastPage = data.totalPages;
	orderList = data.content;
}

function fillPageWithPassengers() {
	let passengers = passengerList;

	for (let i = 0; i < passengers.length; i++) {
		let passenger = passengers[i];

		let pageTemplate = `
        <div class="order-list-content passengers" id="passenger-${passenger.passengerId}">
            <div class="col-passenger">${passenger.name} ${passenger.lastname}</div>
            <div class="col-amount"><span>Заказов: </span>${passenger.amount}</div>
        </div>`;

		$('#passenger-list-elements').append(pageTemplate);

		$(`#passenger-${passenger.passengerId}`).on('click', () => {
			let pass = $(`#passenger-${passenger.passengerId}`).children('.col-passenger').text().split(' ');
			let name = pass[0];
			let lastname = pass[1];

			window.location.assign(`/orders?search&name=${name}&lastname=${lastname}`);
		});
	}
}

function fillPageWithOrders() {
	$('#passenger-list-header').remove();

	let orders = orderList

	$('.order-list-title').text(`${orders[0].passenger.name} ${orders[0].passenger.lastname}`)

	for (let i = 0; i < orders.length; i++) {
		let order = orders[i]

		let stations = order.trip.routeDto.routeStations
		let timeGap = 0
		for (const s of stations) {
			timeGap += s.timeGap
			if (s.stationName === order.sstart.stationName) {
				break
			}
		}

		let startTimeDate = dayjs(order.trip.datetime).add(timeGap, 'minutes').locale('ru');

		let pageTemplate = `
        <div class="order-list-content" id="orders-${order.id}">
            <div class="col-content-route">
                <p class="order-route">${order.sstart.stationName} — ${order.sfinish.stationName}</p>
            </div>
            <div class="col-content-datetime-bus">
                <div class="col-content-datetime">
                    <p class="order-time">${startTimeDate.format('HH:mm')}</p>
                    <p class="order-date">${startTimeDate.format('DD.MM.YYYY')}</p>
                </div>
                <div class="col-content-bus">
                    <p class="order-bus-number">Автобус № ${order.trip.busDto.number}</p>
                    <p class="order-bus-seat">Место № ${order.seat}</p>
                </div>
            </div>
            <div class="col-content-info">
                <p class="order-price">${order.price / 100} BYN</p>
                <p class="order-status">Статус: ${order.status}</p>
            </div>
        </div>
        `

		$('#order-list-elements').append(pageTemplate)
	}

	pagination.update();
}
