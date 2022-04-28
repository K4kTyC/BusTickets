/* Modal animations */
document.querySelectorAll("[data-toggle='modal-login']")
	.forEach(e => e.addEventListener('click', showModal));

document.getElementById('close-modal-login').addEventListener('click', hideModal);
window.onclick = e => {
	if (e.target === document.getElementById('modal-login')) {
		hideModal();
	}
}

async function showModal() {
	document.getElementById('modal-login').classList.remove('hide');
	await new Promise(r => setTimeout(r, 50));
	document.getElementById('modal-login').classList.add('show');
}

async function hideModal() {
	document.getElementById('modal-login').classList.remove('show');
	await new Promise(r => setTimeout(r, 150));
	document.getElementById('modal-login').classList.add('hide');
}

let loginTabToggle = document.getElementById('login-tab-toggle');
let registrationTabToggle = document.getElementById('registration-tab-toggle');

let loginTab = document.getElementById('login-tab');
let registrationTab = document.getElementById('registration-tab');

loginTabToggle.addEventListener('click', async () => {
	if (registrationTabToggle.parentElement.classList.contains('active')) {
		registrationTabToggle.parentElement.classList.remove('active');
		loginTabToggle.parentElement.classList.add('active');

		registrationTab.classList.remove('show');
		await new Promise(r => setTimeout(r, 150));
		registrationTab.classList.add('hide');

		loginTab.classList.remove('hide');
		await new Promise(r => setTimeout(r, 50));
		loginTab.classList.add('show');
	}
});

registrationTabToggle.addEventListener('click', async () => {
	if (loginTabToggle.parentElement.classList.contains('active')) {
		loginTabToggle.parentElement.classList.remove('active');
		registrationTabToggle.parentElement.classList.add('active');

		loginTab.classList.remove('show');
		await new Promise(r => setTimeout(r, 150));
		loginTab.classList.add('hide');

		registrationTab.classList.remove('hide');
		await new Promise(r => setTimeout(r, 50));
		registrationTab.classList.add('show');
	}
});



/* Process forms */
document.getElementById('login-submit').addEventListener('click', () => {
	document.getElementById('login-form').submit();
});
document.getElementById('registration-form').addEventListener('submit', e => e.preventDefault());
document.getElementById('registration-submit').addEventListener('click', () => {
	let userDto = {
		username: document.getElementById('inputRegisterUsername').value,
		password: document.getElementById('inputRegisterPassword').value
	}
	sendUserDto('/api/register', userDto);
});
async function sendUserDto(url, dto) {
	const response = await fetch(url, {
		method: 'POST',
		mode: 'same-origin',
		credentials: 'same-origin',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(dto)
	});
	const returned = await response.json();
	if (returned.text === 'You successfully registered') {
		window.location.replace('/');
	}
	// TODO: handle errors
}