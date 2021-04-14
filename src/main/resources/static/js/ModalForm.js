document
    .getElementById('registration-form')
    .addEventListener('submit', e => e.preventDefault())

document.getElementById('registration-submit').addEventListener('click', () => {
    let userDto = {
        username: document.getElementById('inputRegisterUsername').value,
        password: document.getElementById('inputRegisterPassword').value
    }

    console.log(sendUserDto('/api/register', userDto))
})

function processUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('needLogin')) {
        $('#modal-account').modal('show')
        $('#login-tab').tab('show')
        history.replaceState(null,'', '/')
    }
}

async function sendUserDto(url, dto) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'same-origin',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
    })
    return await response.text()
}