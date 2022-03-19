const $busModelList = $('#model-list-elements');

let pagination = new Pagination(async () => {
	await updateContent();

	const offsetPosition = $busModelList.offset().top - $('#navbar-main').outerHeight();
	window.scrollTo({
		top: offsetPosition,
		behavior: "smooth"
	});
});

const UISelectContainer = new Map(); // key - description, value - CustomSelect instance
const defaultBusModelPlaceholderAmount = 16;

let busClassList
let busModelList
let busModelPlaceholderAmount = 0;

$(() => {
	getBusClassList().then(() => {
		createUISelectObject();
		fillUISelectWithClasses();
	});
	pagination.refresh();
})

$('#model-submit').on('click', () => {
	let id
	const $busClass = UISelectContainer.get('bus-class').$input;
	for (const c of busClassList) {
		if (c.name === $busClass.val()) {
			id = c.id
			break
		}
	}

	let busModelDto = {
		name: $('#model-name').val(),
		numberOfSeats: $('#model-seats').val(),
		busClassId: id
	}
	sendBusModelDto('/api/admin/buses/models', busModelDto)

	$('#model-name').val("")
})

async function sendBusModelDto(url, dto) {
	await fetch(url, {
		method: 'POST',
		mode: 'same-origin',
		credentials: 'same-origin',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(dto)
	});
}

async function getBusClassList() {
	const response = await fetch('/api/admin/buses/classes')
	busClassList = await response.json()
}

async function updateContent() {
	let p1 = startLoadingAnimation();
	let p2 = getBusModels();
	await p1;
	await p2;

	fillPageWithModels();

	setTimeout(() => {
		$busModelList.addClass('updated');
	}, 1);
	setTimeout(() => {
		$busModelList.removeClass('updating');
		$busModelList.removeClass('updated');
	}, 300);
}

async function startLoadingAnimation() {
	$busModelList.addClass('updating');

	// wait for opacity transition
	await new Promise(r => setTimeout(r, 250));

	$busModelList.find('.models-list-content').remove();

	if (busModelPlaceholderAmount < defaultBusModelPlaceholderAmount) {
		addPlaceholders(defaultBusModelPlaceholderAmount - busModelPlaceholderAmount);
		busModelPlaceholderAmount = defaultBusModelPlaceholderAmount;
	}
	for (const p of $busModelList.children('.placeholder')) {
		p.insertAdjacentHTML("afterbegin", `
            <div class="skeleton"></div>
            <div class="skeleton"></div>
            <div class="skeleton"></div>
        `);
	}
}

async function getBusModels() {

	/*await new Promise(r => setTimeout(r, 5000));*/

	const response = await fetch(`/api/admin/buses/models?page=${pagination.curPage - 1}`)
	const data = await response.json()
	pagination.lastPage = data.totalPages
	busModelList = data.content
}

function fillPageWithModels() {
	$busModelList.children('.placeholder').remove();
	busModelPlaceholderAmount = busModelList.length;
	addPlaceholders(busModelPlaceholderAmount);

	let $placeholders = $busModelList.children('.placeholder');
	let models = busModelList

	for (let i = 0; i < models.length; i++) {
		let model = models[i]

		let pageTemplate = `
            <div class="model-list-content" id="model-${model.id}">
                <div class="model-info">
                    <p class="model-name">${model.name}</p>
                    <p class="model-class">${model.busClassName}-класс</p>
                    <p class="model-seats">Мест: ${model.numberOfSeats}</p>
                </div>
                <div class="model-func">
                    <div class="model-edit" id="edit-${model.id}"><i class="fas fa-pen"></i></div>
                    <div class="model-delete" id="rm-${model.id}"><i class="fas fa-trash"></i></div>
                </div>
            </div>`

		$placeholders[i].insertAdjacentHTML("afterbegin", pageTemplate);

		$(`#rm-${model.id}`).on('click', () => {
			if (confirm("Удалить модель автобуса?")) {
				removeModel(model.id)
				$(`#model-${model.id}`).remove()
			}
		})
	}
	pagination.update();
}

async function removeModel(id) {
	await fetch('/api/admin/buses/models', {
		method: 'DELETE',
		mode: 'same-origin',
		credentials: 'same-origin',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(id)
	});
}

/*async function filterBuses() {
	let filter = $('#model-filter').val()

	const response = await fetch(`/api/admin/buses/models?page=${pagination.curPage - 1}&filter=${filter}`)
	const data = await response.json()
	$('.model-list-elements *').remove()
	//lastPage = data.totalPages - 1
	//busModelList = data.content
}*/

function fillUISelectWithClasses() {
	const $select = UISelectContainer.get('bus-class');
	for (let i = 0; i < busClassList.length; i++) {
		const busClass = busClassList[i];
		const templ = `<li>${busClass.name}</li>`;
		$select.$list.append(templ);
	}
	$select.updateOptions();
}

function createUISelectObject() {
	const $busClass = $('#select-class');
	const placeholders = {
		focused: 'Фильтр по названию',
		blurred: 'Класс автобуса'
	};
	const busClassSelect = new CustomSelect($busClass, placeholders, busClassList);
	UISelectContainer.set('bus-class', busClassSelect);
}

function addPlaceholders(amount) {
	let templ = '';
	for (let i = 0; i < amount; i++) {
		templ += '<div class="placeholder"></div>';
	}
	$busModelList.append(templ);
}

/*$('#model-filter').on('input', () => {
	clearTimeout()
	pageNum = 0
	setTimeout(function () {
		filterBuses().then(fillPageWithModels)
	}, 800)
})*/
