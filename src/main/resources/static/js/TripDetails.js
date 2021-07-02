let tripDetails
let notFreeSeatList
let freeSeatList = []
let searchData

$(() => {
    let tripId
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('search')) {
        searchData = {
            start: urlParams.get('start'),
            finish: urlParams.get('finish')
        }
        tripId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1, window.location.href.indexOf('?'))
    } else {
        tripId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
    }
    getTripDetails(tripId)

    $('#order-submit').on('click', () => {
        let pName, pLastname
        pName = $('#pass-name').val()
        pLastname = $('#pass-lastname').val()

        let stationStart, stationFinish
        if (searchData === undefined) {
            let stations = tripDetails.routeDto.routeStations
            stationStart = stations[0].stationName
            stationFinish = stations[stations.length - 1].stationName
        } else {
            stationStart = searchData.start
            stationFinish = searchData.finish
        }

        let orderDto = {
            tripId: tripId,
            stationStart: stationStart,
            stationFinish: stationFinish,
            passenger: {
                name: pName,
                lastname: pLastname
            },
            seat: parseInt(selectParts[0].$input.val())
        }
        console.log(orderDto)
        sendNewOrderDto('/api/orders', orderDto)
    })
})

async function getTripDetails(tripId) {
    const response = await fetch(`/api/trips/${tripId}`)
    tripDetails = await response.json()
    await getSeatList(tripDetails.id)
    fillPageWithTripDetails()
    fillSelectWithSeats()
}

async function getSeatList(tripId) {
    let response
    if (searchData === undefined) {
        response = await fetch(`/api/trips/${tripId}/seats`)
    } else {
        response = await fetch(`/api/trips/${tripId}/seats?stationStart=${searchData.start}&stationFinish=${searchData.finish}`)
    }
    notFreeSeatList = await response.json()
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
    let sStartIndex, sStartName, sFinishIndex, sFinishName

    if (searchData === undefined) {
        sStartIndex = 0
        sFinishIndex = stations.length - 1
        sStartName = stations[sStartIndex].stationName
        sFinishName = stations[sFinishIndex].stationName
    } else {
        sStartName = searchData.start
        sFinishName = searchData.finish
        for (let i = 0; i < stations.length; i++) {
            if (stations[i].stationName === sStartName) {
                sStartIndex = i
            }
            if (stations[i].stationName === sFinishName) {
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
    let totalSeatsAmount = tripDetails.busDto.model.numberOfSeats
    for (let i = 1; i <= totalSeatsAmount; i++) {
        if (!notFreeSeatList.includes(i)) {
            let seatTempl = `<li>${i}</li>`
            $('#select-seat ul').append(seatTempl)
            freeSeatList.push(i)
        }
    }

    $('.seats-number').append(`Свободных мест: ${countFreeSeats(totalSeatsAmount)}`)

    selectParts.push({
        $input: $('#select-seat input'),
        $arrow: $('#select-seat .select-arrow'),
        $list: $('#select-seat ul'),
        $options: $('#select-seat li'),
        valueArray: freeSeatList
    })
    addHandlersForSelect(0, 'Выберите место', 'Выберите место')
}

function countFreeSeats(totalSeats) {
    let notFreeSeatsAmount = notFreeSeatList.length
    return totalSeats - notFreeSeatsAmount
}
