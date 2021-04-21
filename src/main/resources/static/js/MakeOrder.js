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

    sendNewOrderDto('/api/orders', newOrderDto)
})

async function sendNewOrderDto(url, dto) {
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
