package com.k4ktyc.bustickets.model;

import lombok.Getter;

@Getter
public class SeatDto {

    private final int number;
    private final boolean isFree;

    public SeatDto(Seat seat) {
        this.number = seat.getNumber();
        this.isFree = seat.isFree();
    }
}
