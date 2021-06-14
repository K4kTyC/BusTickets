package com.k4ktyc.bustickets.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "route_station")
@Getter @Setter
public class RouteStation {

    @Id @GeneratedValue
    private long id;

    @ManyToOne
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    @ManyToOne
    @JoinColumn(name = "station_id", nullable = false)
    private Station station;

    private LocalDateTime arrivalTime;

    private long price;
}
