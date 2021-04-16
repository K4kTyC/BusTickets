package com.k4ktyc.bustickets.model;

import lombok.Getter;

import javax.validation.constraints.NotNull;
import java.util.List;

@Getter
public class NewRouteDto {

    @NotNull
    private List<NewStationDto> stations;

    @NotNull
    private NewTripDto trip;
}
