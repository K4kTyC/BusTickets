$('#order-search-submit').on('click', () => {
    let searchData = {
        name: $('#passenger-name').val(),
        lastname: $('#passenger-lastname').val()
    }
    sendSearchData('/api/orders/search', searchData)
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
    sessionStorage.setItem('ordersSearchResults', JSON.stringify(returned))
    window.location.replace('/orders?search')
}
