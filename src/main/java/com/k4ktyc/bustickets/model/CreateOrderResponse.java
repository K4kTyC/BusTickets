package com.k4ktyc.bustickets.model;

import lombok.Getter;

@Getter
public class CreateOrderResponse {

    private String text;
    private long orderId;

    public CreateOrderResponse(String text, long orderId) {
        this.text = text;
        this.orderId = orderId;
    }
}
