processUrlParams()

function processUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('needLogin')) {
        $('#modal-account').modal('show')
        $('#login-tab').tab('show')
        history.replaceState(null, '', '/')
    }
}

$(() => {
    $('input[type="text"]').blur(function () {
        this.value = this.value.trim();
    });

    $('#nav-toggle').change(function () {
        if (this.checked) {
            $('body').css('overflow', 'hidden');
        } else {
            $('body').css('overflow', 'auto');
        }
    });

    $('#navbar-main nav').on('click', function (e) {
        if (e.target !== this.children[0]) {
            $('#nav-toggle').prop('checked', false);
        }
    });
});

let prevScrollpos = window.pageYOffset;
window.onscroll = function () {
    const currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
        showNavbar();
        prevScrollpos = currentScrollPos;
    } else if (prevScrollpos < currentScrollPos - 80) {
        hideNavbar();
        prevScrollpos = currentScrollPos;
    }
};

function showNavbar() {
    $('#navbar-main')[0].style.top = "0";
}

function hideNavbar() {
    if (!$('#nav-toggle').prop('checked')) {
        $('.dropdown-toggle').dropdown('hide');
        $('.navbar .dropdown-toggle').blur();
        $('#navbar-main')[0].style.top = 'calc(-48px - 4px - 2em - 5px)'; // content + border + padding + shadow
    }
}

function highlightElement(element) {
    const $el = $(element);
    $el.addClass('highlight');
    $el.children().on('click mouseenter focus', () => {
        $el.removeClass('highlight');
    });
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
