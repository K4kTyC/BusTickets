let stationList
const chosenStations = new Map()
let stationOnPageAmount = 2

$(function () {
    getStationList().then(fillSelectsWithStations)
    addHandlerForSelects()

    for (let i = 0; i < stationOnPageAmount; i++) {
        enableDatetimePicker(`datetimepicker-arrival-${i}`)
    }

    $('#add-station').on('click', () => {
        let stationNum = stationOnPageAmount++
        addStationInfoTemplate(stationNum)
        enableDatetimePicker(`datetimepicker-arrival-${stationNum}`)
        fillSelectWithStations(stationNum)
        addHandlerForSelect(stationNum)

        if (stationOnPageAmount === stationList.length) {
            $('#add-station').hide()
        }
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

function fillSelectsWithStations() {
    for (let stationNum = 0; stationNum < stationOnPageAmount; stationNum++) {
        fillSelectWithStations(stationNum)
    }
}

function fillSelectWithStations(stationNum) {
    for (let i = 0; i < stationList.length; i++) {
        let station = stationList[i]

        let pageTemplate = `<option value="${station.id}">${station.name}</option>`
        $(`#select-station-${stationNum}`).append(pageTemplate)
    }
    disableDuplicateOptions()
    selectFirstEnabledOption(stationNum)
    updateChosenList()
    disableDuplicateOptions()
}

function addHandlerForSelects() {
    for (let stationNum = 0; stationNum < stationOnPageAmount; stationNum++) {
        addHandlerForSelect(stationNum)
    }
}

function addHandlerForSelect(stationNum) {
    $(`#select-station-${stationNum}`).on('change', () => {
        updateChosenList()
        disableDuplicateOptions()
    })
}

function updateChosenList() {
    for (let stationNum = 0; stationNum < stationOnPageAmount; stationNum++) {
        let chosenStationName = $(`#select-station-${stationNum} option:selected`).text()
        chosenStations.set(stationNum, chosenStationName)
    }
}

function selectFirstEnabledOption(stationNum) {
    $(`#select-station-${stationNum} option:enabled:first`).prop('selected', true)
}

function disableDuplicateOptions() {
    for (let stationNum = 0; stationNum < stationOnPageAmount; stationNum++) {
        $(`#select-station-${stationNum} option`).each(function () {
            if (mapContainsValueDifferentKey(chosenStations, $(this).text(), stationNum)) {
                $(this).prop('disabled', true)
            } else {
                $(this).prop('disabled', false)
            }
        })
    }
}

function addStationInfoTemplate(num) {
    let pageTemplate = `
        <div class="route-station-info" id="route-station-info-${num}">
            <select class="col-select-station" id="select-station-${num}"></select>

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

    $(`#route-station-info-${num - 1}`).after(pageTemplate)
}

function mapContainsValueDifferentKey(map, val, key) {
    for (let [k, v] of map) {
        if (v === val && k !== key) {
            return true
        }
    }
    return false
}
