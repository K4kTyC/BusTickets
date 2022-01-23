const $busList = $('#bus-list-elements');

let pagination = new Pagination(async () => {
	await updateContent();

	const offsetPosition = $busList.offset().top - $('#navbar-main').outerHeight();
	window.scrollTo({
		top: offsetPosition,
		behavior: "smooth"
	});
});

const UISelectContainer = new Map(); // key - description, value - CustomSelect instance
const defaultBusPlaceholderAmount = 16;

let busModelList;
let busList;
let busPlaceholderAmount = 0;

$(() => {
	getBusModelList().then(() => {
		createUISelectObject();
		fillUISelectWithModels();
	});
	pagination.refresh();
})

$('#bus-submit').on('click', createNewBus);

function createNewBus() {
	const $busModel = UISelectContainer.get('bus-model').$input;
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

async function updateContent() {
	let p1 = startLoadingAnimation();
	let p2 = getBuses();
	await p1;
	await p2;

	fillPageWithBuses();

	setTimeout(() => {
		$busList.addClass('updated');
	}, 1);
	setTimeout(() => {
		$busList.removeClass('updating');
		$busList.removeClass('updated');
	}, 300);
}

async function startLoadingAnimation() {
	$busList.addClass('updating');

	// wait for opacity transition
	await new Promise(r => setTimeout(r, 250));

	$busList.find('.bus-list-content').remove();

	if (busPlaceholderAmount < defaultBusPlaceholderAmount) {
		addPlaceholders(defaultBusPlaceholderAmount - busPlaceholderAmount);
		busPlaceholderAmount = defaultBusPlaceholderAmount;
	}
	for (const p of $busList.children('.placeholder')) {
		p.insertAdjacentHTML("afterbegin", `
            <div class="skeleton"></div>
            <div class="skeleton"></div>
            <div class="skeleton"></div>
            <div class="skeleton"></div>
        `);
	}
}

async function getBuses() {

	/*await new Promise(r => setTimeout(r, 5000));*/

	const response = await fetch(`/api/admin/buses?page=${pagination.curPage - 1}`);
	const data = await response.json();
	pagination.lastPage = data.totalPages;
	busList = data.content;
}

function fillPageWithBuses() {
	$busList.children('.placeholder').remove();
	busPlaceholderAmount = busList.length;
	addPlaceholders(busPlaceholderAmount);

	let $placeholders = $busList.children('.placeholder');
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
	pagination.update();
}

function fillUISelectWithModels() {
	const $select = UISelectContainer.get('bus-model');
	for (let i = 0; i < busModelList.length; i++) {
		const model = busModelList[i];
		const templ = `<li>${model.name}</li>`;
		$select.$list.append(templ);
	}
	$select.updateOptions();
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

function createUISelectObject() {
	const $busModel = $('#select-model');
	const placeholders = {
		focused: 'Фильтр по названию',
		blurred: 'Модель автобуса'
	};
	const busModelSelect = new CustomSelect($busModel, placeholders, busModelList);
	UISelectContainer.set('bus-model', busModelSelect);
}

function addPlaceholders(amount) {
	let templ = '';
	for (let i = 0; i < amount; i++) {
		templ += '<div class="placeholder"></div>';
	}
	$busList.append(templ);
}
