package com.k4ktyc.bustickets.model;

import lombok.Getter;

@Getter
public class TripDto {

    private final long id;
    private final BusDto bus;
    private final int price;

    public TripDto(Trip trip) {
        this.id = trip.getId();
        this.price = trip.getPrice();
        this.bus = new BusDto(trip.getBus());
    }
}
