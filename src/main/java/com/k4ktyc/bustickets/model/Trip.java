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

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "bus_id", nullable = false, updatable = false)
    private Bus bus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false, updatable = false)
    private Route route;

    private LocalDateTime datetimeTripStart;

    private LocalDateTime datetimeTripFinish;

    private int price;

    public Trip() {}

    public Trip(TripDto tripDto) {
        this.bus = new Bus(tripDto.getBus());
        this.bus.setTrip(this);
        this.price = tripDto.getPrice();
    }
}
