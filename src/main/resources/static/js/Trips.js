let pageNum = 0
let lastPage = 0
let tripList
let isSearch = false

$(() => {
    if (new URLSearchParams(window.location.search).has('search')) {
        isSearch = true
        let pagedTrips = JSON.parse(sessionStorage.getItem('tripsSearchResults')).trips
        tripList = pagedTrips.content
        lastPage = pagedTrips.totalPages - 1
        fillPageWithTrips()
    } else {
        getAllTrips().then(fillPageWithTrips)
    }
})

async function getAllTrips() {
    const response = await fetch(`/api/trips?page=${pageNum}`)
    const data = await response.json()
    tripList = data.content
    lastPage = data.totalPages - 1
}

function fillPageWithTrips() {
    let trips = tripList

    for (let i = 0; i < trips.length; i++) {
        let trip = trips[i]
        let route = trip.routeDto
        let stations = trip.routeDto.routeStations

        let routeName = trip.routeDto.name
        let busClass = trip.busDto.model.busClassName

        let busNumber = trip.busDto.number
        let busModel = trip.busDto.model.name
        let seatAmount = countFreeSeats(trip.seats)

        let stationStartIndex, stationFinishIndex
        if (isSearch) {
            let stationStartName = JSON.parse(sessionStorage.getItem('tripsSearchResults')).stationStart
            let stationFinishName = JSON.parse(sessionStorage.getItem('tripsSearchResults')).stationFinish

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

        let startTimeDate = moment(trip.datetime).add(startTimeGap, 'minutes').locale('ru')
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
                    <p class="name">${routeName}</p>
                    <p class="bus-class">${busClass}-класс</p>
                </div>
                <div class="col-content-bus">
                    <p class="number">№ ${busNumber}</p>
                    <p class="model">${busModel}</p>
                    <p class="seats">Свободно мест: ${seatAmount}</p>
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
                <div class="col-content-price">
                    <p class="price">${sumPrice} BYN</p>
                    <a class="form-control form-button" id="buy-ticket-${trip.id}"><span>купить</span></a>
                </div>
            </div>
        `
        $('#trip-list-container').append(tripTempl)

        $(`#buy-ticket-${trip.id}`).on('click', () => {
            window.location.assign(`/trips/${trip.id}`)
        })
    }
}

function countFreeSeats(seats) {
    let num = 0
    seats.forEach(seat => {
        if (seat.free) num++
    })
    return num
}
