let stationList
const chosenStations = new Map()
let stationOnPageAmount = 0

$(function () {
    getStationList().then(() => {
        addStation()
        addStation()
    })

    $('#route-submit').on('click', () => {
        let routeDto = {
            name: $('#route-name').val(),
            routeStations: []
        }

        for (let i = 0; i < stationOnPageAmount; i++) {
            let routeStation = {
                stationId: $(`#select-station-${i}`).val(),
                arrivalTime: $(`#datetimepicker-arrival-${i}`).datetimepicker('date').parseZone().toJSON(),
                price: $(`#route-station-price-${i}`).val()
            }
            routeDto.routeStations.push(routeStation)
        }

        sendRoute('/api/admin/routes', routeDto)
    })
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
    })
    const returned = await response.json()
    console.log(returned)
}

function fillSelectWithStations(stationNum) {
    for (let i = 0; i < stationList.length; i++) {
        let station = stationList[i]

        let pageTemplate = `<li>${station.name}</li>`
        $(`#select-station-${stationNum} ul`).append(pageTemplate)
    }
    selectParts.push({
        $input: $(`#select-station-${stationNum} input`),
        $arrow: $(`#select-station-${stationNum} .select-arrow`),
        $list: $(`#select-station-${stationNum} ul`),
        $options: $(`#select-station-${stationNum} li`)
    })
    addHandlersForSelect(stationNum)
}

function updateChosenList() {
    for (let stationNum = 0; stationNum < stationOnPageAmount; stationNum++) {
        let chosenStationName = selectParts[stationNum].$input.val()
        chosenStations.set(stationNum, chosenStationName)
    }
}

function disableDuplicateOptions() {
    for (let stationNum = 0; stationNum < stationOnPageAmount; stationNum++) {
        selectParts[stationNum].$options.each(function () {
            if (mapContainsValueDifferentKey(chosenStations, $(this).text(), stationNum)) {
                $(this).addClass('disabled')
            } else {
                $(this).removeClass('disabled')
            }
        })
    }
}

function addStation() {
    let stationNum = stationOnPageAmount++
    addStationInfoTemplate(stationNum)
    enableDatetimePicker(`datetimepicker-arrival-${stationNum}`)
    fillSelectWithStations(stationNum)
    disableDuplicateOptions()

    if (stationOnPageAmount >= stationList.length) {
        $('#add-station').hide()
    }
}

function addStationInfoTemplate(num) {
    let pageTemplate = `
        <div class="route-station-info" id="route-station-info-${num}">
            <div class="col-select form-select" id="select-station-${num}">
                <input class="chosen-value" type="text" value="" placeholder="Выберите станцию">
                <div class="select-arrow"></div>
                <ul class="value-list"></ul>
            </div>

            <div class="col-price input-wrap">
                <input class="input-field" id="route-station-price-${num}" type="text" placeholder="Цена">
            </div>

            <div class="col-datetime">
                <div class="input-wrap input-group date" id="datetimepicker-arrival-${num}" data-target-input="nearest">
                    <input type="text" class="form-control datetimepicker-input input-field" data-target="#datetimepicker-arrival-${num}" placeholder="Время прибытия"/>
                    <div class="input-group-append input-date-btn" data-target="#datetimepicker-arrival-${num}" data-toggle="datetimepicker">
                        <div class="input-group-text"><i class="fas fa-calendar"></i></div>
                    </div>
                </div>
            </div>
        </div>`

    $('#route-stations').append(pageTemplate)

    if (num === 0) {
        $(`#route-station-info-${num}`).append(`
            <div class="col-add-station">
                <span id="add-station"><i class="fas fa-plus"></i></span>
            </div>
`       )

        $('#add-station').on('click', () => {
            addStation()
        })
    }
}

function mapContainsValueDifferentKey(map, val, key) {
    for (let [k, v] of map) {
        if (v === val && k !== key) {
            return true
        }
    }
    return false
}
