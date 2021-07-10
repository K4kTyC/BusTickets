let pageNum = 0
let lastPage = 0
let searchData
let orderList

$(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('search')) {
        searchData = {
            name: urlParams.get('name'),
            lastname: urlParams.get('lastname')
        }
        searchOrders().then(fillPageWithOrders)
    } else {
        getAllOrders()
    }

    $('#order-search-submit').on('click', () => {
        let name = $('#passenger-name').val()
        let lastname = $('#passenger-lastname').val()

        window.location.assign(`/orders?search&name=${name}&lastname=${lastname}`)
    })
})

async function getAllOrders() {
    const response = await fetch('/api/orders')
    const data = await response.json()
    fillPageWithPassengers(data)
}

async function searchOrders() {
    const response = await fetch(`/api/orders/search?page=${pageNum}&name=${searchData.name}&lastname=${searchData.lastname}`)
    const returned = await response.json()
    orderList = returned.content
    lastPage = returned.totalPages - 1
}

function fillPageWithPassengers(data) {
    let passengerOrders = data

    for (let i = 0; i < passengerOrders.length; i++) {
        let orders = passengerOrders[i]

        let pageTemplate = `
        <div class="order-list-content passengers" id="orders-${orders.passengerId}">
            <div class="col-passenger">${orders.name} ${orders.lastname}</div>
            <div class="col-amount"><span>Заказов: </span>${orders.amount}</div>
        </div>
        `

        $('#order-list-container').append(pageTemplate)

        $(`#orders-${orders.passengerId}`).on('click', () => {
            let passenger = $(`#orders-${orders.passengerId}`).children('.col-passenger').text().split(' ')
            let name = passenger[0]
            let lastname = passenger[1]

            window.location.assign(`/orders?search&name=${name}&lastname=${lastname}`)
        })
    }
}

function fillPageWithOrders() {
    $('.order-list-header').remove()

    let orders = orderList

    $('.order-list-title').text(`${orders[0].passenger.name} ${orders[0].passenger.lastname}`)

    for (let i = 0; i < orders.length; i++) {
        let order = orders[i]

        let stations = order.trip.routeDto.routeStations
        let timeGap = 0
        for (const s of stations) {
            if (s.stationName !== order.sstart.stationName) {
                timeGap += s.timeGap
            } else {
                break;
            }
        }

        let startTimeDate = moment(order.trip.datetime).add(timeGap, 'minutes').locale('ru')

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

        $('#order-list-container').append(pageTemplate)
    }
}
