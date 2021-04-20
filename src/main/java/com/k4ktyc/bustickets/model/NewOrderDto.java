package com.k4ktyc.bustickets.model;

import lombok.Getter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
public class NewOrderDto {

    @NotNull
    private long tripId;

    @NotNull
    private int seatNumber;

    @NotBlank
    private String passengerName;

    @NotBlank
    private String passengerLastname;
}
