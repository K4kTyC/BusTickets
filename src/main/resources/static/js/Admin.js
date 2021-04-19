$('#trip-submit').on('click', () => {
    let tripDto = {
        stationStart: $('#trip-from').val(),
        stationFinish: $('#trip-to').val(),
        datetimeStart: $('#datetimepicker-from').datetimepicker('date').parseZone().toJSON(),
        datetimeFinish: $('#datetimepicker-to').datetimepicker('date').parseZone().toJSON(),

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

$(function () {
    $('#datetimepicker-from').datetimepicker()
    $('#datetimepicker-to').datetimepicker()
})
