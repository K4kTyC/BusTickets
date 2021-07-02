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
        document.getElementById('navbarSupportedContent').insertAdjacentHTML('beforeend', `
            <a id="buses" class="nav-link nav-link-main" href="/admin/buses">Автобусы</a>
            <a id="bus-models" class="nav-link nav-link-main" href="/admin/buses/models">Модели автобусов</a>
            <a id="routes" class="nav-link nav-link-main" href="/admin/routes">Маршруты</a>
            <a id="stations" class="nav-link nav-link-main" href="/admin/stations">Станции</a>
        `)

        $('#trip-info-select-seat').remove()
        $('#trip-info-pass-data').remove()
    }

    document.getElementById('navbarSupportedContent').insertAdjacentHTML('beforeend', `
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

function enableDatetimePicker(id) {
    $(`#${id}`).datetimepicker({})
}

let prevScrollpos = window.pageYOffset;
window.onscroll = function() {
    const currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
        document.getElementById("mainNavbar").style.top = "0";
    } else {
        if ($('.navbar-toggler').attr('aria-expanded') === 'false') {
            document.getElementById("mainNavbar").style.top = "calc(-48px - 4px - 2rem)";
        }
    }
    prevScrollpos = currentScrollPos;
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function minutesToHours(timeInMinutes) {
    let time = timeInMinutes
    if (time < 60) {
        time = time.toString() + ' мин'
    } else {
        let hours = Math.floor(time / 60)
        let minutes = time - (hours * 60)
        time = hours.toString() + ' ч, ' + minutes.toString() + ' мин'
    }
    return time
}

document.getElementById('login-submit').addEventListener('click', function () {
    let form = document.getElementById('login-form')
    form.submit()
})
