$('#trip-search-submit').on('click', () => {
    let date = $('#datetimepicker-from').datetimepicker('date').parseZone()
    let now = moment()
    console.log(date)
    console.log(now)
    if (now.get('date') !== date.get('date') || now.get('month') !== date.get('month')) {
        date.set({ 'hour': 0, 'minute': 0, 'second':0, 'millisecond': 0 })
    }

    let searchData = {
        stationFrom: $('#trip-from').val(),
        stationTo: $('#trip-to').val(),
        tripDate: date.toJSON()
    }
    alert(searchData.tripDate)
    sendSearchData('/api/trips/search', searchData)
})

async function sendSearchData(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'same-origin',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    const returned = await response.json()
    sessionStorage.setItem('tripsSearchResults', JSON.stringify(returned))
    window.location.replace('/trips?search')
}

$(function () {
    $('#datetimepicker-from').datetimepicker({
        format: 'L'
    })
})
