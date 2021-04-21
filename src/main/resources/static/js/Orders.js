async function getAllOrders() {
    const response = await fetch('/api/orders')
    const data = await response.json()
    fillPageWithOrders(data)
}

function fillPageWithOrders(data) {
    let passengerOrders = data

    for (let i = 0; i < passengerOrders.length; i++) {
        let orders = passengerOrders[i]

        let pageTemplate = `
        <div class="row order-list-content align-items-center px-3 py-5 justify-content-around" id="orders-${orders.passengerId}">
            <div class="col-md-4 order-passenger">
                <p class="order-passenger-text">${orders.name} ${orders.lastname}</p>
            </div>
            <div class="col-md-4 order-orders-amount">
                <p class="order-orders-amount-text">${orders.amount}</p>
            </div>
        </div>
        
        <div class="row my-1"></div>
`

        $('#order-list-container').append(pageTemplate)

        $(`#orders-${orders.passengerId}`).on('click', () => {
            // Поиск заказов по пассажиру
        })
    }
}


