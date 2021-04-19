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
