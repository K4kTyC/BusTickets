package com.k4ktyc.bustickets.domain.dto;

import com.k4ktyc.bustickets.domain.Trip;
import com.k4ktyc.bustickets.domain.dto.BusDto;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class TripDto {

    private final long id;
    private final BusDto bus;

    private final String stationStart;
    private final String stationFinish;

    private final LocalDateTime datetimeStart;
    private final LocalDateTime datetimeFinish;

    private final int price;

    public TripDto(Trip trip) {
        this.id = trip.getId();
        this.bus = new BusDto(trip.getBus());

        this.stationStart = trip.getStationStart();
        this.stationFinish = trip.getStationFinish();

        this.datetimeStart = trip.getDatetimeStart();
        this.datetimeFinish = trip.getDatetimeFinish();

        this.price = trip.getPrice();
    }
}
