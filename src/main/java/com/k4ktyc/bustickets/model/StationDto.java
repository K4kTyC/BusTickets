package com.k4ktyc.bustickets.model;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class StationDto {

    private final String name;
    private final LocalDateTime datetimeFrom;
    private final LocalDateTime datetimeTo;

    public StationDto(Station station) {
        this.name = station.getName();
        this.datetimeFrom = station.getDatetimeFrom();
        this.datetimeTo = station.getDatetimeTo();
    }
}
