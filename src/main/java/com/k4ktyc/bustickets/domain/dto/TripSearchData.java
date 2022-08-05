package com.k4ktyc.bustickets.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class TripSearchData {

    @NotNull
    private final LocalDate tripDate;

    @NotNull
    private final String stationStart;

    @NotNull
    private final String stationFinish;

}
