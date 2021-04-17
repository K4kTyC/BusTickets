package com.k4ktyc.bustickets.model;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class RouteDto {

    private final long id;
    private final List<StationDto> stations;
    private final List<TripDto> trips;

    public RouteDto(Route route) {
        this.id = route.getId();
        this.stations = route.getStations()
                .stream().map(StationDto::new)
                .collect(Collectors.toCollection(ArrayList::new));
        this.trips = route.getTrips()
                .stream().map(TripDto::new)
                .collect(Collectors.toCollection(ArrayList::new));
    }

}
