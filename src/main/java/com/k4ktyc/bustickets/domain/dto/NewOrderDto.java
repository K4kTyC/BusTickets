package com.k4ktyc.bustickets.domain.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter @Setter
public class NewOrderDto {

    @NotNull
    private long tripId;

    @NotNull
    private String stationStart;

    @NotNull
    private String stationFinish;

    @NotNull
    private PassengerDto passenger;

    @NotNull
    private int seatNumber;

}
