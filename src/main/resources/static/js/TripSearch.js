$('#trip-search-submit').on('click', () => {
    let date = $('#datetimepicker-from').datetimepicker('date').parseZone()
    let now = moment()

    if (now.get('date') !== date.get('date') || now.get('month') !== date.get('month')) {
        date.set({ 'hour': 0, 'minute': 0, 'second':0, 'millisecond': 0 })
    }

    let start = $('#trip-from').val()
    let finish = $('#trip-to').val()

    window.location.assign(`/trips?search&date=${date.toJSON()}&start=${start}&finish=${finish}`)
})

let swapStationsDeg = 180
document.getElementById('swap-stations').addEventListener('click', function () {
    let fromInput = document.getElementById('trip-from')
    let toInput = document.getElementById('trip-to')
    let tmp = fromInput.value
    fromInput.value = toInput.value
    toInput.value = tmp
    document.getElementById('swap-stations').firstElementChild.style.transform = 'rotate(' + swapStationsDeg + 'deg)'
    swapStationsDeg === 180 ? swapStationsDeg = 0 : swapStationsDeg = 180
})

$(function () {
    $('#datetimepicker-from').datetimepicker({
        format: 'L'
    })
})
