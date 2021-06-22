let pageNum = 0
let lastPage = 0
let busModelList
let busList

$(() => {
    getBusModelList().then(fillSelectWithModels)
    getBuses().then(fillPageWithBuses)
})

$('#bus-submit').on('click', () => {
    let id

    for (const m of busModelList) {
        if (m.name === selectParts[0].$input.val()) {
            id = m.id
            break
        }
    }

    let busDto = {
        number: $('#bus-number').val(),
        modelId: id
    }
    sendBusDto('/api/admin/buses', busDto)

    $('#bus-number').val("")
})

async function sendBusDto(url, dto) {
    await fetch(url, {
        method: 'POST',
        mode: 'same-origin',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
    });
}

async function getBusModelList() {
    const response = await fetch('/api/admin/buses/models?unpaged=true')
    const data = await response.json()
    busModelList = data.content
}

async function getBuses() {
    const response = await fetch(`/api/admin/buses?page=${pageNum}`)
    const data = await response.json()
    lastPage = data.totalPages - 1
    busList = data.content
}

function fillPageWithBuses() {
    let buses = busList

    for (let i = 0; i < buses.length; i++) {
        let bus = buses[i]

        let pageTemplate = `
            <div class="col buses-list-content py-3 m-2" id="bus-${bus.id}">
                <div class="text-center bus-info">
                    <p class="bus-number">№ ${bus.number}</p>
                    <p class="bus-model">${bus.model.name}</p>
                    <p class="bus-seats">Мест: ${bus.model.numberOfSeats}</p>
                    <p class="bus-class">${bus.model.busClassName}-класс</p>
                </div>
                <div class="bus-delete" id="rm-${bus.id}"><i class="fas fa-trash"></i></div>
            </div>`

        $('#bus-list-elements').append(pageTemplate)

        $(`#rm-${bus.id}`).on('click', function () {
            if (confirm("Удалить автобус?")) {
                removeBus(bus.id)
                $(`#bus-${bus.id}`).remove()
            }
        })
    }

    $('[id^=page-link-]').remove()

    if (lastPage > 0) {
        for (let i = 0; i < lastPage + 1; i++) {
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
                    getBuses().then(fillPageWithBuses)
                })
            }
        }
        $('#pagination').show()
    } else {
        $('#pagination').hide()
    }
}

function fillSelectWithModels() {
    for (let i = 0; i < busModelList.length; i++) {
        let model = busModelList[i]

        let pageTemplate = `<li>${model.name}</li>`
        $('#select-model ul').append(pageTemplate)
    }
    selectParts.push({
        $input: $('#select-model input'),
        $arrow: $('#select-model .select-arrow'),
        $list: $('#select-model ul'),
        $options: $('#select-model li'),
        valueArray: busModelList
    })
    addHandlersForSelect(0, 'Фильтр по названию', 'Модель автобуса')
}

async function removeBus(id) {
    await fetch('/api/admin/buses', {
        method: 'DELETE',
        mode: 'same-origin',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(id)
    });
}

$('#page-prev').on('click', () => {
    if (pageNum > 0) {
        pageNum--
        $('#bus-list-elements *').remove()
        getBuses().then(fillPageWithBuses)
    }
})

$('#page-next').on('click', () => {
    if (pageNum < lastPage) {
        pageNum++
        $('#bus-list-elements *').remove()
        getBuses().then(fillPageWithBuses)
    }
})
