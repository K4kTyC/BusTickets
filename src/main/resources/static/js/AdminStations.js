let pageNum = 0
let lastPage = 0

$(function () {
    getAllStations()
})

$('#station-submit').on('click', () => {
    let stationDto = {
        name: $('#station-name').val()
    }
    sendStationDto('/api/admin/stations', stationDto)

    $('#station-name').val("")
})

async function sendStationDto(url, dto) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'same-origin',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
    })

    if (response.ok) {
        const returned = await response.json()

        let createdStation = {
            content: [{
                id: returned.id,
                name: dto.name
            }]
        }
        fillPageWithStations(createdStation)
    }
}

async function getAllStations() {
    const response = await fetch(`/api/admin/stations?page=${pageNum}`)
    const data = await response.json()
    lastPage = data.totalPages - 1
    fillPageWithStations(data)
}

function fillPageWithStations(data) {
    let stations = data.content

    for (let i = 0; i < stations.length; i++) {
        let station = stations[i]

        let pageTemplate = `
            <div class="col station-list-content py-3 m-2" id="station-${station.id}">
                <div class="text-center station-info">
                    <p class="station-id">ID: ${station.id}</p>
                    <p class="station-name">${station.name}</p>
                </div>
            </div>`

        $('#station-list-elements').append(pageTemplate)
    }
}

async function filterStations() {
    let filter = $('#station-filter').val()

    const response = await fetch(`/api/admin/stations?page=${pageNum}&filter=${filter}`)
    const data = await response.json()
    $('#station-list-elements *').remove()
    lastPage = data.totalPages - 1
    fillPageWithStations(data)
}

$('#station-filter').on('input', () => {
    clearTimeout()
    pageNum = 0
    setTimeout(function () { filterStations() }, 800)
})

$('#page-prev').on('click', () => {
    if (pageNum > 0) {
        pageNum--
        $('#station-list-elements *').remove()

        if ($('#station-filter').val() !== "") {
            filterStations()
        } else {
            getAllStations()
        }
    }
})

$('#page-next').on('click', () => {
    if (pageNum < lastPage) {
        pageNum++
        $('#station-list-elements *').remove()

        if ($('#station-filter').val() !== "") {
            filterStations()
        } else {
            getAllStations()
        }
    }
})
