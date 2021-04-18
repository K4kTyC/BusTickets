$('#trip-submit').on('click', () => {
    let tripDto = {
        stationStart: $('#trip-from').val(),
        stationFinish: $('#trip-to').val(),
        datetimeStart: $('#datetimepicker-from').datetimepicker('date').toJSON(),
        datetimeFinish: $('#datetimepicker-to').datetimepicker('date').toJSON(),

        bus: {
            number: $('#trip-bus-number').val(),
            busClass: $('#trip-bus-class').val(),
            numberOfSeats: $('#trip-bus-seats').val()
        },
        price: $('#trip-bus-price').val()
    }
    sendNewTripDto('/api/admin/create-trip', tripDto)
})

async function sendNewTripDto(url, dto) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'same-origin',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
    })
    const returned = await response.json()
    alert(returned.text)
    console.log(returned.newTripId)
    window.location.replace("/");
}

$.fn.datetimepicker.Constructor.Default = $.extend({}, $.fn.datetimepicker.Constructor.Default, {
    icons: {
        time: 'fas fa-clock',
        date: 'fas fa-calendar',
        up: 'fas fa-arrow-up',
        down: 'fas fa-arrow-down',
        previous: 'fas fa-chevron-left',
        next: 'fas fa-chevron-right',
        today: 'fas fa-calendar-check',
        clear: 'fas fa-trash',
        close: 'fas fa-times'
    },
    tooltips: {
        today: 'Сегодня',
        clear: 'Очистить выбор',
        close: 'Закрыть',
        selectTime: 'Выбрать время',
        selectMonth: 'Выбрать месяц',
        prevMonth: 'Предыдущий месяц',
        nextMonth: 'Следующий месяц',
        selectYear: 'Выбрать год',
        prevYear: 'Предыдущий год',
        nextYear: 'Следующий год',
        selectDecade: 'Выбрать десятилетие',
        prevDecade: 'Предыдущее десятилетие',
        nextDecade: 'Следующее десятилетие',
        prevCentury: 'Предыдущий век',
        nextCentury: 'Следующий век',
        incrementHour: 'Увеличить на 1 час',
        pickHour: 'Выбрать часы',
        decrementHour:'Уменишить на 1 час',
        incrementMinute: 'Увеличить на 1 минуту',
        pickMinute: 'Выбрать минуты',
        decrementMinute:'Уменьшить на 1 минуту'
    },
    locale: 'ru',
    buttons: {
        showToday: true,
        showClear: true,
        showClose: false
    },
    minDate: moment().clone().locale('ru')
});

$(function() {
    $('#datetimepicker-from').datetimepicker()
    $('#datetimepicker-to').datetimepicker()
})
