tempusDominus.DefaultOptions.restrictions.minDate = new Date(new Date(Date.now()).setHours(0, 0, 0, 0));

tempusDominus.DefaultOptions.localization = {
	today: 'Сегодня',
	clear: 'Очистить выбор',
	close: 'Закрыть',
	selectMonth: 'Выбрать месяц',
	previousMonth: 'Предыдущий месяц',
	nextMonth: 'Следующий месяц',
	selectYear: 'Выбрать год',
	previousYear: 'Предыдущий год',
	nextYear: 'Следующий год',
	selectDecade: 'Select Decade',
	previousDecade: 'Previous Decade',
	nextDecade: 'Next Decade',
	previousCentury: 'Previous Century',
	nextCentury: 'Next Century',
	pickHour: 'Выбрать кол-во часов',
	incrementHour: 'Увеличить на 1 час',
	decrementHour: 'Уменьшить на 1 час',
	pickMinute: 'Выбрать кол-во минут',
	incrementMinute: 'Увеличить на 1 минуту',
	decrementMinute: 'Уменьшить на 1 минуту',
	pickSecond: 'Pick Second',
	incrementSecond: 'Increment Second',
	decrementSecond: 'Decrement Second',
	toggleMeridiem: 'Toggle Meridiem',
	selectTime: 'Выбрать время',
	selectDate: 'Выбрать дату',
	dayViewHeaderFormat: {month: 'long', year: 'numeric'},
	locale: 'ru',
	startOfTheWeek: 1
};

tempusDominus.DefaultOptions.display.components = {
	calendar: true,
	date: true,
	month: true,
	year: true,
	decades: false,
	clock: false,
	hours: true,
	minutes: true,
	seconds: false,
	useTwentyfourHour: true
};
