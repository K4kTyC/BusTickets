package com.k4ktyc.bustickets.model;

import lombok.Getter;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Getter
public class SearchData {

    @NotNull
    private String stationFrom;

    @NotNull
    private String stationTo;

    @NotNull
    private LocalDate tripDate;

}
