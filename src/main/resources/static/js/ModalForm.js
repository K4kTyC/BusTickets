document
    .getElementById('login-form')
    .addEventListener('submit', e => e.preventDefault())

document
    .getElementById('registration-form')
    .addEventListener('submit', e => e.preventDefault())

document.getElementById('login-submit').addEventListener('click', () => {
    let userDto = {
        username: document.getElementById('inputLoginUsername').value,
        password: document.getElementById('inputLoginPassword').value
    }

    console.log(sendUserDto('/api/login', userDto))
})

document.getElementById('registration-submit').addEventListener('click', () => {
    let userDto = {
        username: document.getElementById('inputRegisterUsername').value,
        password: document.getElementById('inputRegisterPassword').value
    }

    console.log(sendUserDto('/api/register', userDto))
})

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