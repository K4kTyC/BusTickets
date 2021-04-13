package com.k4ktyc.bustickets.model;

import lombok.Getter;

import javax.validation.constraints.NotNull;

@Getter
public class TripDto {

    @NotNull
    private BusDto bus;

    @NotNull
    private int price;
}
