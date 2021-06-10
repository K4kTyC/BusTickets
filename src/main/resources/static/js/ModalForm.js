document
    .getElementById('registration-form')
    .addEventListener('submit', e => e.preventDefault())

document.getElementById('registration-submit').addEventListener('click', () => {
    let userDto = {
        username: document.getElementById('inputRegisterUsername').value,
        password: document.getElementById('inputRegisterPassword').value
    }

    sendUserDto('/api/register', userDto)
})

async function sendUserDto(url, dto) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'same-origin',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
    })
    const returned = await response.json()
    if (returned.text === 'You successfully registered') {
        window.location.replace('/')
    }
    // TODO: handle errors
}