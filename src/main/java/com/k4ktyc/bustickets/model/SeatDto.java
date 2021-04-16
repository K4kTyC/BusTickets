package com.k4ktyc.bustickets.model;

import lombok.Getter;

@Getter
public class SeatDto {

    private final int number;
    private final String status;

    public SeatDto(Seat seat) {
        this.number = seat.getNumber();
        this.status = seat.getStatus();
    }
}
