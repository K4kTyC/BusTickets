package com.k4ktyc.bustickets.model;

import lombok.Getter;

import javax.validation.constraints.NotNull;

@Getter
public class NewTripDto {

    @NotNull
    private NewBusDto bus;

    @NotNull
    private int price;
}
