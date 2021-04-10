package com.k4ktyc.bustickets.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "trips")
@Getter @Setter
public class Trip {

    @Id @GeneratedValue
    private long id;

    @OneToOne
    @JoinColumn(name = "bus_id", nullable = false, updatable = false)
    private Bus bus;

    @ManyToOne
    @JoinColumn(name = "route_id", nullable = false, updatable = false)
    private Route route;

    private LocalDateTime datetimeTripStart;

    private LocalDateTime datetimeTripFinish;

    private int price;
}
