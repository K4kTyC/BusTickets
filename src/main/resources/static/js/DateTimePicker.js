$.fn.datetimepicker.Constructor.Default = $.extend({}, $.fn.datetimepicker.Constructor.Default, {
    icons: {
        time: 'fas fa-clock',
        date: 'fas fa-calendar',
        up: 'fas fa-arrow-up',
        down: 'fas fa-arrow-down',
        previous: 'fas fa-chevron-left',
        next: 'fas fa-chevron-right',
        today: 'today-text',
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
        incrementHour: 'Увеличить на 1 час',
        pickHour: 'Выбрать часы',
        decrementHour:'Уменьшить на 1 час',
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
    widgetPositioning: {
        vertical: 'bottom'
    },
    focusOnShow: false,
    minDate: moment().millisecond(0).second(0).minute(0).hour(0).locale('ru')
});

function enableDatetimePicker(id) {
    $(`#${id}`).datetimepicker({})
}

$("body").click(function(){
    let container = $('.bootstrap-datetimepicker-widget');
    container.parent().datetimepicker('hide');
});
