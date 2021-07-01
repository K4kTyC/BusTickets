let tripDetails
let notFreeSeatList
let freeSeatList
let stationStart, stationFinish

$(() => {
    let tripId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
    setStartFinishStations()
    getTripDetails(tripId).then(fillPageWithTripDetails)
    getSeatList(tripId).then(fillSelectWithSeats)

    $('#order-submit').on('click', () => {
        let pName, pLastname
        pName = $('#pass-name').val()
        pLastname = $('#pass-lastname').val()

        let orderDto = {
            tripId: tripId,
            stationStart: stationStart,
            stationFinish: stationFinish,
            passenger: {
                name: pName,
                lastname: pLastname
            },
            seatNumber: parseInt(selectParts[0].$input.val())
        }
        console.log(orderDto)
        sendNewOrderDto('/api/orders', orderDto)
    })
})

async function getTripDetails(tripId) {
    const response = await fetch(`/api/trips/${tripId}`)
    tripDetails = await response.json()
}

async function sendNewOrderDto(url, dto) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'same-origin',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
    })
    if (response.ok) {
        alert('Заказ успешно оформлен')
    } else if (response.status === 403) {
        alert('Оформление заказа недоступно для администратора')
    }
}

function fillPageWithTripDetails() {
    let trip = tripDetails
    let stations = trip.routeDto.routeStations
    let sStartIndex, sFinishIndex
    // TODO: заменить сессионное хранилище на параметры в URI
    if (sessionStorage.getItem('tripsSearchResults') === null) {
        sStartIndex = 0
        sFinishIndex = stations.length - 1
        stationStart = stations[sStartIndex].stationName
        stationFinish = stations[sFinishIndex].stationName
    } else {
        stationStart = JSON.parse(sessionStorage.getItem('tripsSearchResults')).stationStart
        stationFinish = JSON.parse(sessionStorage.getItem('tripsSearchResults')).stationFinish
        for (let i = 0; i < stations.length; i++) {
            if (stations[i].stationName === stationStart) {
                sStartIndex = i
            }
            if (stations[i].stationName === stationFinish) {
                sFinishIndex = i
            }
        }
    }

    let startTimeGap = 0
    for (let i = 0; i < sStartIndex; i++) {
        startTimeGap += stations[i + 1].timeGap
    }

    let sumTime = 0, sumPrice = 0
    for (let i = sStartIndex; i < sFinishIndex; i++) {
        sumTime += stations[i + 1].timeGap
        sumPrice += stations[i + 1].price
    }
    sumPrice /= 100

    let startTimeDate = moment(trip.datetime).add(startTimeGap, 'minutes').locale('ru')
    let timeStart = startTimeDate.format('HH:mm')
    let dateStart = startTimeDate.format('DD.MM.YYYY')

    let finishTimeDate = startTimeDate.add(sumTime, 'minutes')
    let timeFinish = finishTimeDate.format('HH:mm')
    let dateFinish = finishTimeDate.format('DD.MM.YYYY')

    let tripTempl = `
        <div class="trip-station-info">
            <div class="col-station">
                <div class="name">${sStartName}</div>
                <div class="time">${timeStart}</div>
                <div class="date">${dateStart}</div>
            </div>
            <div class="col-timegap">
                <div class="timegap-line"></div>
                <div class="timegap-time">${minutesToHours(sumTime)}</div>                    
            </div>
            <div class="col-station">
                <div class="name">${sFinishName}</div>
                <div class="time">${timeFinish}</div>
                <div class="date">${dateFinish}</div>
            </div>
        </div>
    `
    $('.trip-stations').append(tripTempl)

    $('.trip-price').append(`Стоимость: ${sumPrice} BYN`)
}

// TODO: fix filter for seat number
function fillSelectWithSeats() {
    let seatNum = 0
    for (let i = 0; i < tripDetails.busDto.model.numberOfSeats; i++) {
        if (!notFreeSeatList.includes(i)) {
            let seatTempl = `<li>${i}</li>`
            $('#select-seat ul').append(seatTempl)
            freeSeatList.push(i)
            seatNum++
        }
    }

    $('.seats-number').append(`Свободных мест: ${seatNum}`)

    selectParts.push({
        $input: $('#select-seat input'),
        $arrow: $('#select-seat .select-arrow'),
        $list: $('#select-seat ul'),
        $options: $('#select-seat li'),
        valueArray: freeSeatList
    })
    addHandlersForSelect(0, 'Выберите место', 'Выберите место')
}

function setStartFinishStations() {
    if (sessionStorage.getItem('tripsSearchResults') === null) {
        stationStart = stations[sStartIndex].stationName
        stationFinish = stations[sFinishIndex].stationName
    } else {
        stationStart = JSON.parse(sessionStorage.getItem('tripsSearchResults')).stationStart
        stationFinish = JSON.parse(sessionStorage.getItem('tripsSearchResults')).stationFinish
    }
}
