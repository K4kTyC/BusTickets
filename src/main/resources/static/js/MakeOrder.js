$('#trip-make-order').on('click', () => {
    let loc = window.location
    let tripId = loc.pathname.substring(loc.pathname.lastIndexOf('/') + 1)

    let seat = $('#trip-select-seat').val()
    let name = $('#passenger-name').val()
    let lastname = $('#passenger-lastname').val()

    let newOrderDto = {
        tripId: tripId,
        seatNumber: seat,
        passengerName: name,
        passengerLastname: lastname
    }


})
