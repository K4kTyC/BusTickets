let numberOfStations = 2
let addRouteForm = document.getElementById('add-route-form')

addRouteForm.addEventListener('submit', e => e.preventDefault())

document.getElementById('route-submit').addEventListener('click', () => {
    let routeDto = {
        stations: [],
        trip: {
            bus: {
                number: document.getElementById('route-bus-number').value,
                busClass: document.getElementById('route-bus-class').value,
                numberOfSeats: document.getElementById('route-bus-seats').value
            },
            price: document.getElementById('route-bus-price').value
        }
    }

    for (let i = 1; i <= numberOfStations; i++) {
        routeDto.stations.push({
            name: document.getElementById(`route-from-${i}`).value,
            datetimeFrom: $(`#datetimepicker-from-${i}`).datetimepicker('date').toJSON(),
            datetimeTo: $(`#datetimepicker-to-${i}`).datetimepicker('date').toJSON()
        })
    }

    sendNewRouteDto('/api/admin/add_route', routeDto)
})

addRouteForm.addEventListener('click', (e) => {
    const isButton = e.target.nodeName === 'BUTTON';
    const isSubmit = e.target.getAttribute('type') === 'submit'
    if (!isButton || isSubmit) {
        return;
    }

    const buttonIdArgs = e.target.id.split('-')
    const rowNumber = Number.parseInt(buttonIdArgs[2])

    e.target.remove()
    numberOfStations++
    formAddStationRow()
    initNewDatetimepickers(rowNumber + 1)
})

function formAddStationRow() {
    let num = numberOfStations
    document.getElementById('form-row-bus').insertAdjacentHTML('beforebegin', `
        <div class="form-row py-2" id="form-row-${num}">
            <div class="col-auto">
                <input class="form-control" id="route-from-${num}" type="text" placeholder="Название станции">
            </div>
            <div class="col-auto">
                <div class="input-group date" id="datetimepicker-from-${num}" data-target-input="nearest">
                    <input type="text" class="form-control datetimepicker-input" data-target="#datetimepicker-from-${num}"
                           placeholder="Дата отправления"/>
                    <div class="input-group-append" data-target="#datetimepicker-from-${num}" data-toggle="datetimepicker">
                        <div class="input-group-text"><i class="fas fa-calendar"></i></div>
                    </div>
                </div>
            </div>
            <div class="col-auto">
                <div class="input-group date" id="datetimepicker-to-${num}" data-target-input="nearest">
                    <input type="text" class="form-control datetimepicker-input" data-target="#datetimepicker-to-${num}"
                           placeholder="Дата прибытия"/>
                    <div class="input-group-append" data-target="#datetimepicker-to-${num}" data-toggle="datetimepicker">
                        <div class="input-group-text"><i class="fas fa-calendar"></i></div>
                    </div>
                </div>
            </div>
            <div class="col-auto">
                <button class="btn btn-success" id="add-station-${num}">Добавить станцию</button>
            </div>
        </div>
    `)
}

$(function () {
    initNewDatetimepickers(1)
    initNewDatetimepickers(2)
})

function initNewDatetimepickers(num) {
    $(`#datetimepicker-from-${num}`).datetimepicker()
    $(`#datetimepicker-to-${num}`).datetimepicker()
}

async function sendNewRouteDto(url, dto) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'same-origin',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
    })
    const returned = await response.json()
    alert(returned.text)
    console.log(returned.newRouteId)
}