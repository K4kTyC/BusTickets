let stationList;
const chosenStations = new Map();
let stationOnPageAmount = 0;

let routeList;

$(function () {
    getStationList().then(() => {
        addStation();
        addStation();
    })

    $('#route-submit').on('click', () => {
        let routeDto = {
            name: $('#route-name').val(),
            routeStations: []
        }

        for (let i = 0; i < stationOnPageAmount; i++) {
            let id
            for (const s of stationList) {
                if (s.name === chosenStations.get(i)) {
                    id = s.id
                    break
                }
            }

            let routeStation = {
                stationId: id,
                timeGap: $(`#route-station-time-${i}`).val(),
                price: $(`#route-station-price-${i}`).val()
            }
            routeDto.routeStations.push(routeStation)
        }
        sendRoute('/api/admin/routes', routeDto)
    })

    getRouteList().then(addRoutes)
})

async function getStationList() {
    const response = await fetch('/api/admin/stations?unpaged=true')
    const data = await response.json()
    stationList = data.content
}

async function sendRoute(url, dto) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'same-origin',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dto)
    })
    const returned = await response.json()
    console.log(returned)
}

function fillSelectWithStations(stationNum) {
    const $select = $(`#route-station-info-${stationNum} #select-station`);

    for (let i = 0; i < stationList.length; i++) {
        const station = stationList[i];
        const templ = `<li>${station.name}</li>`;
        $select.find('ul').append(templ);
    }

    const placeholders = {
        focused: 'Фильтр по названию',
        blurred: 'Выберите станцию'
    };
    new CustomSelect($select, placeholders, stationList, true, chosenStations);
}

function addStation() {
    let stationNum = stationOnPageAmount++;
    addStationInfoTemplate(stationNum);
    fillSelectWithStations(stationNum);

    if (stationOnPageAmount >= stationList.length) {
        $('#add-station').hide();
    }
}

function addStationInfoTemplate(num) {
    let pageTemplate = `
        <div class="route-station-info" id="route-station-info-${num}">
            <div class="col-select form-select" id="select-station">
                <input class="chosen-value" type="text" value="" placeholder="Выберите станцию">
                <div class="select-arrow">
                    <i class="fas fa-chevron-left"></i>
                </div>
                <ul class="value-list"></ul>
            </div>

            <div class="col-price input-wrap">
                <input class="input-field" id="route-station-price" type="text" placeholder="Цена">
            </div>

            <div class="col-time input-wrap">
                <input class="input-field" id="route-station-time" type="text" placeholder="Время в пути, мин">
            </div>
        </div>`

    $('#route-stations').append(pageTemplate)

    if (num === 0) {
        $(`#route-station-info-${num}`).append(`
            <div class="col-add-station">
                <span id="add-station"><i class="fas fa-plus"></i></span>
            </div>
`)

        $('#add-station').on('click', () => {
            addStation()
        })
    }
}

async function getRouteList() {
    const response = await fetch('/api/admin/routes')
    const data = await response.json()
    routeList = data.content
}

function addRoutes() {
    for (const route of routeList) {
        let id = route.id
        let name = route.name
        let stations = route.routeStations
        let price = route.price / 100

        let templ = `
            <div class="row route-list-content align-items-center" id="route-${id}">
                <div class="route-name">${name}</div>
                <div class="route-stations"></div>
                <div class="route-price">Итого: ${price} BYN</div>
            </div>`
        $('#route-list').append(templ)

        $(`#route-${id}`).on('click', () => {
            window.location.assign(`/admin/routes/${id}`)
        })

        for (const station of stations) {
            let name = station.stationName
            let time = minutesToHours(station.timeGap)
            let price = station.price / 100

            let templ = `
                <div class="station-name">${name}</div>
                <div class="station-time">${time}</div>
                <div class="station-price">${price}</div>
            `
            $(`#route-${id} .route-stations`).append(templ)
        }
    }
}
