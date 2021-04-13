package com.k4ktyc.bustickets.model;

import lombok.Getter;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Getter
public class StationDto {

    @NotNull
    private String name;

    @NotNull
    private LocalDateTime datetimeFrom;

    @NotNull
    private LocalDateTime datetimeTo;
}
