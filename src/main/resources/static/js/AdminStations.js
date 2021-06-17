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

    let stationsOnPage = $('[class*="station-list-content"]').length
    if (response.ok && stationsOnPage < 20) {
        const returned = await response.json()

        let pageTemplate = `
            <div class="col station-list-content py-3 m-2" id="station-${returned.id}">
                <div class="text-center station-info">
                    <p class="station-name">${dto.name}</p>
                    <p class="station-id">ID: ${returned.id}</p>
                </div>
                <div class="station-delete"><i class="fas fa-trash"></i></div>
            </div>`
        $('#station-list-elements').append(pageTemplate)
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
                    <p class="station-name">${station.name}</p>
                    <p class="station-id">ID: ${station.id}</p>
                </div>
                <div class="station-delete" id="rm-${station.id}"><i class="fas fa-trash"></i></div>
            </div>`

        $('#station-list-elements').append(pageTemplate)

        $(`#rm-${station.id}`).on('click', function () {
            removeStation(station.id)
            $(`#station-${station.id}`).remove()
        })
    }

    $('[id^=page-link-]').remove()

    if (data.totalPages > 1) {
        for (let i = 0; i < data.totalPages; i++) {
            let num = i + 1
            let pageTemplate = `
            <li class="page-item" id="page-link-${num}">
                <a class="pagination-link ${pageNum === i ? "current":""}" id="page-${num}" aria-label="${num}">
                    <span aria-hidden="true">${num}</span>
                </a>
            </li>`

            $('#page-next-li').before(pageTemplate)

            if (pageNum !== i) {
                $(`#page-link-${num}`).on('click', () => {
                    pageNum = i
                    $('#station-list-elements *').remove()

                    if ($('#station-filter').val() !== "") {
                        filterStations()
                    } else {
                        getAllStations()
                    }
                })
            }
        }
        $('#pagination').show()
    } else {
        $('#pagination').hide()
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

async function removeStation(id) {
    const response = await fetch('/api/admin/stations', {
        method: 'DELETE',
        mode: 'same-origin',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(id)
    })
    return await response.json()
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
