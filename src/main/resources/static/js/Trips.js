async function getAllRoutes(pageNum) {
    const response = await fetch(`/api/trips?page=${pageNum}`)
    const data = await response.json()
    fillPageWithTrips(data)
}

let pageTemplate

function fillPageWithTrips(data) {
    let trips = data.content

    for (let i = 0; i < trips.length; i++) {
        let trip = trips[i]

        pageTemplate = `<div class="row trip-list-content align-items-center px-3 py-5" id="trip-${trip.id}">`

        fillRouteColumn(trip)
        fillFromToColumns(trip)
        fillSeatsColumn(trip.seats)
        fillPriceColumn(trip.routeDto.price)

        pageTemplate += `
            </div>
            <div class="row my-1"></div>`

        $('#trip-list-container').append(pageTemplate)

        $(`#trip-${trip.id}`).on('click', () => {
            window.location.assign(`/trips/${trip.id}`)
        })
    }
}

function fillRouteColumn(trip) {
    let startName = trip.routeDto.routeStations[0].stationName
    let finishName = trip.routeDto.routeStations[trip.routeDto.routeStations.length - 1].stationName
    let busClass = trip.busDto.model.busClassName + '-класс'

    pageTemplate += `
        <div class="col-md-4 trip-info">
            <p class="trip-route">${startName} — ${finishName}</p>
            <p class="trip-class">${busClass}</p>
        </div>
    `
}

function fillFromToColumns(trip) {
    let sumTime = 0
    for (const station of trip.routeDto.routeStations) {
        sumTime += station.timeGap
    }

    let startTimeDate = moment(trip.datetime).locale('ru')
    let finishTimeDate = moment(trip.datetime).add(sumTime, 'minutes').locale('ru')

    pageTemplate += `
        <div class="col-md-2 trip-datetime">
            <p class="trip-time">${startTimeDate.format('HH:mm')}</p>
            <p class="trip-date">${startTimeDate.format('DD.MM.YYYY')}</p>
        </div>  
         <div class="col-md-2 trip-datetime">
            <p class="trip-time">${finishTimeDate.format('HH:mm')}</p>
            <p class="trip-date">${finishTimeDate.format('DD.MM.YYYY')}</p>
        </div>   
    `
}

function fillSeatsColumn(seats) {
    let numOfFree = 0
    seats.forEach(seat => {
        if (seat.free) {
            numOfFree++
        }
    })

    pageTemplate += `
        <div class="col-md-2 trip-seats">
            ${numOfFree} / ${seats.length}
        </div>  
    `
}

function fillPriceColumn(price) {
    pageTemplate += `
        <div class="col-md-2 trip-price">
            ${price} BYN
        </div>
    `
}
