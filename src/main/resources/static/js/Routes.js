getAllRoutes(0)

async function getAllRoutes(pageNum) {
    const response = await fetch(`/api/routes?page=${pageNum}`)
    const data = await response.json()
    fillPage(data)
}

let pageTemplate

function fillPage(data) {
    let container = document.getElementById('trip-list-container')
    let routes = data.content

    for (let i = 0; i < routes.length; i++) {
        let route = routes[i]
        for (let j = 0; j < route.trips.length; j++) {
            let trip = route.trips[j]

            pageTemplate = `<div class="row trip-list-content align-items-center px-3 py-5" id="trip-${trip.id}">`

            fillRouteColumn(route.stations, trip)
            fillFromToColumns(route.stations[0], route.stations[route.stations.length - 1])
            fillSeatsColumn(trip.bus.seats)
            fillPriceColumn(trip.price)

            pageTemplate += `
                    </div>
                <div class="row my-1"></div>`

            container.insertAdjacentHTML('beforeend', pageTemplate)
        }
    }
}

function fillRouteColumn(stations, trip) {
    let startName = stations[0].name
    let finishName = stations[stations.length - 1].name
    let busClass = trip.bus.busClass === 'Econom' ? 'Эконом-класс' : 'Бизнес-класс'

    let container = document.getElementById('trip-list-container')

    pageTemplate += `
        <div class="col-md-4 trip-info">
            <p class="trip-route">${startName} — ${finishName}</p>
            <p class="trip-class">${busClass}</p>
        </div>
    `
}

function fillFromToColumns(startStation, finishStation) {
    let startTimeDate = moment(startStation.datetimeFrom).locale('ru')
    let finishTimeDate = moment(finishStation.datetimeTo).locale('ru')

    let container = document.getElementById('trip-list-container')

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
        if (seat.status === 'free') {
            numOfFree++
        }
    })

    let container = document.getElementById('trip-list-container')

    pageTemplate += `
        <div class="col-md-2 trip-seats">
            ${numOfFree} / ${seats.length}
        </div>  
    `
}

function fillPriceColumn(price) {
    let container = document.getElementById('trip-list-container')

    pageTemplate += `
        <div class="col-md-2 trip-price">
            ${price} BYN
        </div>
    `
}
