package com.k4ktyc.bustickets.model;

import lombok.Getter;

@Getter
public class AddNewRouteResponse {

    private final String text;
    private final long newRouteId;

    public AddNewRouteResponse(String text, Route route) {
        this.text = text;
        this.newRouteId = route.getId();
    }
}
