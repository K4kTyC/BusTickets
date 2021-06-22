package com.k4ktyc.bustickets.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "trips")
@Getter @Setter
public class Trip {

    @Id @GeneratedValue(generator = "optimized-sequence")
    private long id;

    @ManyToOne
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "bus_id", nullable = false)
    private Bus bus;

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL)
    private List<Seat> seats;

}
