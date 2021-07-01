let pageNum = 0
let lastPage = 0
let tripList
const notFreeSeatList = new Map()
let searchData

$(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('search')) {
        searchData = {
            date: urlParams.get('date'),
            start: urlParams.get('start'),
            finish: urlParams.get('finish')
        }
        searchTrips().then(fillPageWithTrips)
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

async function searchTrips() {
    const response = await fetch(`/api/trips/search?page=${pageNum}&datetime=${searchData.date}&start=${searchData.start}&finish=${searchData.finish}`)
    const returned = await response.json()
    tripList = returned.content
    lastPage = returned.totalPages - 1
    for (const trip of tripList) {
        await getSeatList(trip.id)
    }
}

async function getSeatList(tripId) {
    const response = await fetch(`/api/trips/${tripId}/seats?stationStart=${searchData.start}&stationFinish=${searchData.finish}`)
    const notFreeSeats = await response.json()
    notFreeSeatList.set(tripId, notFreeSeats)
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
