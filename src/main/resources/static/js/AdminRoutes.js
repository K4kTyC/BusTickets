let stationAmount = 2

$(function () {
    fillSelectWithStations()
    for (let i = 0; i < stationAmount; i++) {
        $(`#datetimepicker-arrival-${i}`).datetimepicker({})
    }
    $('#route-submit').on('click', () => {
        let routeDto = {
            name: $('#route-name').val(),
            routeStations: []
        }

        for (let i = 0; i < stationAmount; i++) {
            let routeStation = {
                stationId: $(`#route-select-station-${i}`).val(),
                arrivalTime: $(`#datetimepicker-arrival-${i}`).datetimepicker('date').parseZone().toJSON(),
                price: $(`#route-station-price-${i}`).val()
            }
            routeDto.routeStations.push(routeStation)
        }

        sendRoute('/api/admin/routes', routeDto)
    })
})

async function fillSelectWithStations() {
    const response = await fetch('/api/admin/stations?unpaged=true')
    const data = await response.json()
    let stations = data.content

    for (let i = 0; i < stationAmount; i++) {
        for (let j = 0; j < stations.length; j++) {
            let station = stations[j]

            let pageTemplate = `
            <option value="${station.id}">${station.name}</option>`

            $(`#route-select-station-${i}`).append(pageTemplate)
        }
    }
}

async function sendRoute(url, dto) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'same-origin',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
    })
    const returned = await response.json()
    console.log(returned)
}
