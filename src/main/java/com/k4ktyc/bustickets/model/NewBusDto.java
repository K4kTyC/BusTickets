package com.k4ktyc.bustickets.model;

import lombok.Getter;

import javax.validation.constraints.NotNull;

@Getter
public class NewBusDto {

    @NotNull
    private int number;

    @NotNull
    private int busClass;

    @NotNull
    private int numberOfSeats;
}
