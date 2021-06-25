$('#trip-search-submit').on('click', () => {
    let date = $('#datetimepicker-from').datetimepicker('date').parseZone()
    let now = moment()

    if (now.get('date') !== date.get('date') || now.get('month') !== date.get('month')) {
        date.set({ 'hour': 0, 'minute': 0, 'second':0, 'millisecond': 0 })
    }

    let tripSearchData = {
        datetime: date.toJSON(),
        stationStart: $('#trip-from').val(),
        stationFinish: $('#trip-to').val()
    }
    sendSearchData(tripSearchData)
})

async function sendSearchData(data) {
    const response = await fetch(`/api/trips/search?page=${pageNum}&datetime=${data.datetime}&start=${data.stationStart}&finish=${data.stationFinish}`)
    const returned = await response.json()
    const searchResults = {
        stationStart: data.stationStart,
        stationFinish: data.stationFinish,
        trips: returned
    }
    sessionStorage.setItem('tripsSearchResults', JSON.stringify(searchResults))
    window.location.assign('/trips?search')
}

$(function () {
    $('#datetimepicker-from').datetimepicker({
        format: 'L'
    })
})
