package com.k4ktyc.bustickets.model;

import lombok.Getter;

@Getter
public class CreateTripResponse {

    private final String text;
    private final long newTripId;

    public CreateTripResponse(String text, Trip trip) {
        this.text = text;
        this.newTripId = trip.getId();
    }
}
