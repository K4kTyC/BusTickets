let pageNum = 0
let lastPage = 0
let busClassList

$(() => {
    getBusClassList().then(fillSelectWithClasses)
    getBuses()
})

$('#bus-submit').on('click', () => {
    let id

    for (const c of busClassList) {
        if (c.name === selectParts[0].$input.val()) {
            id = c.id
            break
        }
    }

    let busModelDto = {
        name: $('#bus-name').val(),
        numberOfSeats: $('#bus-seats').val(),
        busClassId: id
    }
    sendBusModelDto('/api/admin/buses/models', busModelDto)

    $('#bus-name').val("")
})

async function sendBusModelDto(url, dto) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'same-origin',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
    })
}

async function getBusClassList() {
    const response = await fetch('/api/admin/buses/classes')
    busClassList = await response.json()
}

async function getBuses() {
    const response = await fetch(`/api/admin/buses/models?page=${pageNum}`)
    const data = await response.json()
    lastPage = data.totalPages - 1
    fillPageWithModels(data)
}

function fillPageWithModels(data) {
    let models = data.content

    for (let i = 0; i < models.length; i++) {
        let model = models[i]

        let pageTemplate = `
            <div class="col buses-list-content py-3 m-2" id="model-${model.id}">
                <div class="text-center model-info">
                    <p class="model-name">${model.name}</p>
                    <p class="model-class">${model.busClassName}-класс</p>
                    <p class="model-seats">Мест: ${model.numberOfSeats}</p>
                </div>
                <div class="bus-delete" id="rm-${model.id}"><i class="fas fa-trash"></i></div>
            </div>`

        $('#bus-list-elements').append(pageTemplate)

        $(`#rm-${model.id}`).on('click', function () {
            if (confirm("Удалить модель автобуса?")) {
                removeModel(model.id)
                $(`#model-${model.id}`).remove()
            }
        })
    }

    $('[id^=page-link-]').remove()

    if (data.totalPages > 1) {
        for (let i = 0; i < data.totalPages; i++) {
            let num = i + 1
            let pageTemplate = `
            <li class="page-item" id="page-link-${num}">
                <a class="pagination-link ${pageNum === i ? "current":""}" id="page-${num}" aria-label="${num}">
                    <span aria-hidden="true">${num}</span>
                </a>
            </li>`

            $('#page-next-li').before(pageTemplate)

            if (pageNum !== i) {
                $(`#page-link-${num}`).on('click', () => {
                    pageNum = i
                    $('#bus-list-elements *').remove()

                    if ($('#bus-filter').val() !== "") {
                        filterBuses()
                    } else {
                        getBuses()
                    }
                })
            }
        }
        $('#pagination').show()
    } else {
        $('#pagination').hide()
    }
}

async function filterBuses() {
    let filter = $('#bus-filter').val()

    const response = await fetch(`/api/admin/buses/models?page=${pageNum}&filter=${filter}`)
    const data = await response.json()
    $('#bus-list-elements *').remove()
    lastPage = data.totalPages - 1
    fillPageWithModels(data)
}

function fillSelectWithClasses() {
    for (let i = 0; i < busClassList.length; i++) {
        let busClass = busClassList[i]

        let pageTemplate = `<li>${busClass.name}</li>`
        $('#select-class ul').append(pageTemplate)
    }
    selectParts.push({
        $input: $('#select-class input'),
        $arrow: $('#select-class .select-arrow'),
        $list: $('#select-class ul'),
        $options: $('#select-class li'),
        valueArray: busClassList
    })
    addHandlersForSelect(0, 'Класс автобуса', 'Класс автобуса')
}

async function removeModel(id) {
    const response = await fetch('/api/admin/buses/models', {
        method: 'DELETE',
        mode: 'same-origin',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(id)
    })
    return await response.json()
}

$('#bus-filter').on('input', () => {
    clearTimeout()
    pageNum = 0
    setTimeout(function () { filterBuses() }, 800)
})

$('#page-prev').on('click', () => {
    if (pageNum > 0) {
        pageNum--
        $('#bus-list-elements *').remove()

        if ($('#bus-filter').val() !== "") {
            filterBuses()
        } else {
            getBuses()
        }
    }
})

$('#page-next').on('click', () => {
    if (pageNum < lastPage) {
        pageNum++
        $('#bus-list-elements *').remove()

        if ($('#bus-filter').val() !== "") {
            filterBuses()
        } else {
            getBuses()
        }
    }
})
