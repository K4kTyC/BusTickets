package com.k4ktyc.bustickets.model;

import lombok.Getter;

@Getter
public class AddNewRouteResponse {

    private final String text;
    private final RouteDto createdRoute;

    public AddNewRouteResponse(String text, RouteDto route) {
        this.text = text;
        this.createdRoute = route;
    }
}
