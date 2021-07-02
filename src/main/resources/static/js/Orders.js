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
        <div class="row order-list-content align-items-center px-5 justify-content-between" id="orders-${orders.passengerId}">
            <div class="col-md-4 order-passenger">
                <p class="order-passenger-text">${orders.name} ${orders.lastname}</p>
            </div>
            <div class="col-md-4 order-orders-amount text-center">
                <p class="order-orders-amount-text">${orders.amount}</p>
            </div>
        </div>
        
        <div class="row my-1"></div>
        `

        $('#order-list-container').append(pageTemplate)

        $(`#orders-${orders.passengerId}`).on('click', () => {
            let passenger = $(`#orders-${orders.passengerId}`).children('.order-passenger').children('.order-passenger-text').text().split(' ')
            let name = passenger[0]
            let lastname = passenger[1]

            window.location.assign(`/orders?search&name=${name}&lastname=${lastname}`)
        })
    }
}

function fillPageWithOrders() {
    $('.order-list-header').remove()

    let orders = orderList

    $('#order-list-container').append(`
        <div class="row title p-5">${orders[0].passenger.name} ${orders[0].passenger.lastname}</div>
    `)

    for (let i = 0; i < orders.length; i++) {
        let order = orders[i]

        let startTimeDate = moment(order.trip.datetime).locale('ru')

        let pageTemplate = `
        <div class="row order-list-content align-items-center px-5 justify-content-between" id="orders-${order.id}">
            <div class="col-md-4 order-info">
                <p class="order-route">${order.sstart.stationName} — ${order.sfinish.stationName}</p>
            </div>
            <div class="col-md-2 order-datetime">
                <p class="order-time">${startTimeDate.format('HH:mm')}</p>
                <p class="order-date">${startTimeDate.format('DD.MM.YYYY')}</p>
            </div>
            <div class="col-md-4 order-bus">
                <p class="order-bus-number">Автобус № ${order.trip.busDto.number}</p>
                <p class="order-bus-seat">Место № ${order.seat}</p>
            </div>
            <div class="col-md-2 order-addinfo">
                <p class="order-price">${order.price / 100} BYN</p>
                <p class="order-status">${order.status}</p>
            </div>
        </div>
        
        <div class="row my-1"></div>
        `

        $('#order-list-container').append(pageTemplate)
    }
}
