processUrlParams()
checkAuth()

function processUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('needLogin')) {
        $('#modal-account').modal('show')
        $('#login-tab').tab('show')
        history.replaceState(null,'', '/')
    }
}

async function checkAuth() {
    const response = await fetch('/api/checkAuth')
    const data = await response.json()
    console.log(data)
    if (data.authorised) {
        addProfileButtons(data)
    }
}

function addProfileButtons(data) {
    document.getElementById('unauthLink').remove()

    if (data.role === 'ROLE_ADMIN') {
        document.getElementById('mainNavbar').insertAdjacentHTML('beforeend', `
            <a id="addRoute" class="nav-link nav-link-main" href="/admin">Добавить маршрут</a>
        `)
    }

    document.getElementById('mainNavbar').insertAdjacentHTML('beforeend', `
            <div class="nav-item dropdown">
                <a class="nav-link nav-link-main dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                ${data.username}
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <a class="dropdown-item" href="/orders">Заказы</a>
                    <a class="dropdown-item" href="/user">Профиль</a>
                    <p class="dropdown-divider"></p>
                    <a class="dropdown-item" href="/logout">Выйти</a>
                </div>
            </div>
        `)
}

document.getElementById('login-submit').addEventListener('click', function () {
    let form = document.getElementById('login-form')
    form.submit()
})


let swapStationsDeg = 180
document.getElementById('swap-stations').addEventListener('click', function () {
    let fromInput = document.getElementById('route-from')
    let toInput = document.getElementById('route-to')
    let tmp = fromInput.value
    fromInput.value = toInput.value
    toInput.value = tmp
    document.getElementById('swap-stations').firstElementChild.style.transform = 'rotate(' + swapStationsDeg + 'deg)'
    swapStationsDeg === 180 ? swapStationsDeg = 0 : swapStationsDeg = 180
})
