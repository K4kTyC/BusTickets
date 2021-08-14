let pagination = new Pagination(() => {
    $('#bus-list-elements').addClass('updating');

    getBuses().then(() => {
        setTimeout(fillPageWithBuses, 100);
    });

    const offsetPosition = $('#bus-list-elements').offset().top - $('#navbar-main').outerHeight();
    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });
});

let busModelList;
let busList;

const busPlaceholderAmount = 16;

$(() => {
    addPlaceholders();
    getBusModelList().then(fillSelectWithModels);
    pagination.elementsRefreshFunc();
})

$('#bus-submit').on('click', createNewBus);

function createNewBus() {
    const $busModel = selectParts[0].$input;
    const $busNumber = $('#bus-number');
    const reg = new RegExp('^\\d+$');

    let modelId;
    let busNumber = parseInt($busNumber.val(), 10);

    for (const m of busModelList) {
        if (m.name === $busModel.val()) {
            modelId = m.id;
            break;
        }
    }

    if (modelId === undefined) {
        highlightElement($busModel.parent());
        new NotificationPopup('Выберите модель автобуса');
        return;
    }
    if ($busNumber.val() === '') {
        highlightElement($busNumber.parent());
        new NotificationPopup('Укажите номер автобуса');
        return;
    }
    if (!reg.test($busNumber.val())) {
        highlightElement($busNumber.parent());
        new NotificationPopup('Номер автобуса должен состоять только из цифр');
        return;
    }
    if (isNaN(busNumber) || busNumber < 1) {
        highlightElement($busNumber.parent());
        new NotificationPopup('Укажите корректный номер автобуса');
        return;
    }

    const busDto = {
        number: busNumber,
        modelId: modelId
    };
    sendBusDto('/api/admin/buses', busDto).then((response) => {
        switch (response.status) {
            case 200: {
                new NotificationPopup('Автобус успешно добавлен');
                $busNumber.val('');
                break;
            }
            case 409: {
                response.text().then((msg) => {
                    highlightElement($busNumber.parent());
                    new NotificationPopup(msg);
                });
                break;
            }
        }
    });
}

async function sendBusDto(url, dto) {
    return await fetch(url, {
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
    $('#bus-list-elements .placeholder *').remove();
    let $placeholders = $('.bus-list-elements .placeholder');
    let buses = busList;

    for (let i = 0; i < buses.length; i++) {
        let bus = buses[i];

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
            </div>`;

        $placeholders[i].insertAdjacentHTML("afterbegin", pageTemplate);

        $(`#rm-${bus.id}`).on('click', () => {
            if (confirm("Удалить автобус?")) {
                removeBus(bus.id);
                $(`#bus-${bus.id}`).remove();
            }
        });
    }

    $('#bus-list-elements').removeClass('updating');

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

function addPlaceholders() {
    let templ = '';
    for (let i = 0; i < busPlaceholderAmount; i++) {
        templ += '<div class="placeholder"></div>';
    }
    $('#bus-list-elements').append(templ);
}
