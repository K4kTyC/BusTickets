let pageNum = 0
let lastPage = 0

$(function () {
    getAllStations(pageNum)
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

        let createdStation = [
            {
                id: returned.id,
                name: dto.name
            }
        ]
        fillPageWithStations(createdStation)
    }
}

async function getAllStations(pageNum) {
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
            <div class="row station-list-content align-items-center px-3 py-3" id="station-${station.id}">
                <div class="col-3 text-center station-info">
                    <p class="station-id">${station.id}</p>
                </div>
                <div class="col-auto text-left station-info">
                    <p class="station-name">${station.name}</p>
                </div>
            </div>
            <div class="row my-1"></div>`

        $('#station-list-elements').append(pageTemplate)
    }
}

$('#page-prev').on('click', () => {
    if (pageNum > 0) {
        pageNum--
        $('#station-list-elements *').remove()
        getAllStations(pageNum)
    }
})

$('#page-next').on('click', () => {
    if (pageNum < lastPage)
    pageNum++
    $('#station-list-elements *').remove()
    getAllStations(pageNum)
})
