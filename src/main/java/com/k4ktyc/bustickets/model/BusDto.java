package com.k4ktyc.bustickets.model;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class BusDto {

    private final int number;
    private final String busClass;
    private final List<SeatDto> seats;

    public BusDto(Bus bus) {
        this.number = bus.getNumber();
        this.busClass = bus.getBusClass();
        this.seats = bus.getSeats()
                .stream().map(SeatDto::new)
                .collect(Collectors.toCollection(ArrayList::new));
    }
}
