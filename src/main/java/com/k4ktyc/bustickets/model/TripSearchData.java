package com.k4ktyc.bustickets.model;

import lombok.Getter;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Getter
public class TripSearchData {

    @NotNull
    private String stationFrom;

    @NotNull
    private String stationTo;

    @NotNull
    private LocalDateTime tripDate;

}
