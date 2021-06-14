package com.k4ktyc.bustickets.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.k4ktyc.bustickets.domain.Trip;
import lombok.Getter;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Getter
public class TripDto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long id;

    @NotNull
    private long routeId;

    @NotNull
    private StationDto stationStart;

    @NotNull
    private StationDto stationFinish;

    @NotNull
    private LocalDateTime datetimeStart;

    @NotNull
    private LocalDateTime datetimeFinish;

    @NotNull
    private BusDto bus;

    @NotNull
    private long price;


    public TripDto() {}

    public TripDto(Trip trip) {
        this.id = trip.getId();
        this.routeId = trip.getRoute().getId();
        this.stationStart = new StationDto(trip.getStationStart());
        this.stationFinish = new StationDto(trip.getStationFinish());
        this.datetimeStart = trip.getDatetimeStart();
        this.datetimeFinish = trip.getDatetimeFinish();
        this.bus = new BusDto(trip.getBus());
        this.price = trip.getPrice();
    }
}
