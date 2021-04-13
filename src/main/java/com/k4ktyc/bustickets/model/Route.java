package com.k4ktyc.bustickets.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "routes")
@Getter @Setter
public class Route {

    @Id @GeneratedValue
    private long id;

    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL)
    private List<Station> stations = new ArrayList<>();

    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL)
    private List<Trip> trips = new ArrayList<>();

    public Route() {}

    public Route(NewRouteDto newRoute) {
        List<Station> newStations = newRoute.getStations()
                .stream()
                .map(Station::new)
                .collect(Collectors.toCollection(ArrayList::new));
        for (Station s : newStations) {
            s.setRoute(this);
        }
        this.stations = newStations;

        Trip newTrip = new Trip(newRoute.getTrip());
        newTrip.setRoute(this);
        newTrip.setDatetimeTripStart(this.stations.get(0).getDatetimeFrom());
        newTrip.setDatetimeTripFinish(this.stations.get(this.stations.size() - 1).getDatetimeTo());
        this.trips.add(newTrip);
    }
}
