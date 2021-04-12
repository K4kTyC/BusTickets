let numberOfStations = 2
let addRouteForm = document.getElementById('add-route-form')

addRouteForm.addEventListener('submit', e => e.preventDefault())

addRouteForm.addEventListener('click', (e) => {
    const isButton = e.target.nodeName === 'BUTTON';    // TODO: i element inside button ignores click
    const isSubmit = e.target.getAttribute('type') === 'submit'
    if (!isButton || isSubmit) {
        return;
    }

    const buttonIdArgs = e.target.id.split('-')
    const rowNumber = Number.parseInt(buttonIdArgs[2])
    if (buttonIdArgs[0] === 'add') {
        e.target.classList.replace('btn-success', 'btn-danger')
        e.target.id = `remove-station-${rowNumber}`
        e.target.innerHTML = '<i class="fas fa-trash" style="color: white"></i>'
        numberOfStations++
        addStationFormRow()
        initNewDatetimepickers(rowNumber + 1)
        updateDatetimepickersHandlers()
    } else {
        document.getElementById(`form-row-${rowNumber}`).remove()
        for (let i = rowNumber + 1; i <= numberOfStations; i++) {
            updateRowIds(i)
        }
        numberOfStations--
        initNewDatetimepickers(numberOfStations)
        updateDatetimepickersHandlers()
    }
})

function addStationFormRow() {
    let num = numberOfStations
    document.getElementById('route-submit').insertAdjacentHTML('beforebegin', `
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
                <button class="btn btn-success" id="add-station-${num}"><i class="fas fa-plus"></i></button>
            </div>
        </div>
    `)
}

function updateRowIds(id) {
    document.getElementById(`form-row-${id}`).id = `form-row-${id - 1}`
    document.getElementById(`route-from-${id}`).id = `route-from-${id - 1}`
    document.getElementById(`datetimepicker-from-${id}`).firstElementChild.setAttribute(
        'data-target', `#datetimepicker-from-${id - 1}`)
    document.getElementById(`datetimepicker-from-${id}`).lastElementChild.setAttribute(
        'data-target', `#datetimepicker-from-${id - 1}`)
    document.getElementById(`datetimepicker-from-${id}`).id = `datetimepicker-from-${id - 1}`

    document.getElementById(`datetimepicker-to-${id}`).firstElementChild.setAttribute(
        'data-target', `#datetimepicker-to-${id - 1}`)
    document.getElementById(`datetimepicker-to-${id}`).lastElementChild.setAttribute(
        'data-target', `#datetimepicker-to-${id - 1}`)
    document.getElementById(`datetimepicker-to-${id}`).id = `datetimepicker-to-${id - 1}`

    document.getElementById(`add-station-${id}`).id = `add-station-${id - 1}`
}

$(function () {
    $('#datetimepicker-from-1').datetimepicker({ useCurrent: true })
    $('#datetimepicker-to-1').datetimepicker()
    $('#datetimepicker-from-2').datetimepicker()
    $('#datetimepicker-to-2').datetimepicker()

    updateDatetimepickersHandlers()
})

function initNewDatetimepickers(num) {
    $(`#datetimepicker-from-${num}`).datetimepicker({
        minDate: $(`#datetimepicker-to-${num - 1}`).datetimepicker('date')
    })
    $(`#datetimepicker-to-${num}`).datetimepicker()
}

function updateDatetimepickersHandlers() {
    for (let i = 1; i <= numberOfStations ; i++) {
        $(`#datetimepicker-from-${i}`).on("change.datetimepicker", function (e) {
            $(`#datetimepicker-to-${i}`).datetimepicker('minDate', e.date)
        })

        $(`#datetimepicker-to-${i}`).on("change.datetimepicker", function (e) {
            $(`#datetimepicker-from-${i}`).datetimepicker('maxDate', e.date)
            if (i < numberOfStations) {
                $(`#datetimepicker-from-${i + 1}`).datetimepicker('minDate', e.date)
            }
        })
    }
}
