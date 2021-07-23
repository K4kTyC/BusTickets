processUrlParams()

function processUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('needLogin')) {
        $('#modal-account').modal('show')
        $('#login-tab').tab('show')
        history.replaceState(null,'', '/')
    }
}

let prevScrollpos = window.pageYOffset;
window.onscroll = function() {
    const currentScrollPos = window.pageYOffset;
    const navbar = document.getElementById("mainNavbar")
    if (prevScrollpos > currentScrollPos) {
        navbar.style.top = "0";
        prevScrollpos = currentScrollPos;
    } else if (prevScrollpos < currentScrollPos - navbar.offsetHeight) {
        if ($('.navbar-toggler').attr('aria-expanded') === 'false') {
            navbar.style.top = "calc(-48px - 4px - 2rem)";
            prevScrollpos = currentScrollPos;
        }
    }
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
