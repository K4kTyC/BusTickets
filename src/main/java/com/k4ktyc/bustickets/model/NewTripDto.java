package com.k4ktyc.bustickets.model;

import lombok.Getter;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Getter
public class NewTripDto {

    @NotNull
    private String stationStart;

    @NotNull
    private String stationFinish;

    @NotNull
    private LocalDateTime datetimeStart;

    @NotNull
    private LocalDateTime datetimeFinish;

    @NotNull
    private NewBusDto bus;

    @NotNull
    private int price;
}
