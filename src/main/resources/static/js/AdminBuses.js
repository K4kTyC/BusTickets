let pagination = new Pagination(() => {
    $('#bus-list-elements *').remove();
    getBuses().then(fillPageWithBuses);
});

let busModelList;
let busList;

$(() => {
    getBusModelList().then(fillSelectWithModels);
    pagination.elementsRefreshFunc();
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
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dto)
    });
}

async function getBusModelList() {
    const response = await fetch('/api/admin/buses/models?unpaged=true')
    const data = await response.json()
    busModelList = data.content
}

async function getBuses() {
    const response = await fetch(`/api/admin/buses?page=${pagination.curPage - 1}`);
    const data = await response.json();
    pagination.lastPage = data.totalPages;
    busList = data.content;
}

function fillPageWithBuses() {
    let buses = busList

    for (let i = 0; i < buses.length; i++) {
        let bus = buses[i]

        let pageTemplate = `
            <div class="bus-list-content" id="bus-${bus.id}">
                <div class="bus-info">
                    <p class="bus-number">№ ${bus.number}</p>
                    <p class="bus-model">${bus.model.name}</p>
                    <p class="bus-class">${bus.model.busClassName}-класс</p>
                    <p class="bus-seats">Мест: ${bus.model.numberOfSeats}</p>
                </div>
                <div class="bus-func">
                    <div class="bus-edit" id="edit-${bus.id}"><i class="fas fa-pen"></i></div>
                    <div class="bus-delete" id="rm-${bus.id}"><i class="fas fa-trash"></i></div>
                </div>
            </div>`

        $('#bus-list-elements').append(pageTemplate)

        $(`#rm-${bus.id}`).on('click', () => {
            if (confirm("Удалить автобус?")) {
                removeBus(bus.id)
                $(`#bus-${bus.id}`).remove()
            }
        })
    }

    pagination.update();
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
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(id)
    });
}
