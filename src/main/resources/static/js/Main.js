let isAuthorized = false

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
    const value = await response.json()
    isAuthorized = value.isAuthorized;

    if (isAuthorized) {
        document.getElementById('unauthLink').remove()
        document.getElementById('mainNavbar').insertAdjacentHTML('beforeend', `
            <div class="nav-item dropdown">
                <a class="nav-link nav-link-main dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                ${value.login}
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
}