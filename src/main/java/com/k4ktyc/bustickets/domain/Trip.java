package com.k4ktyc.bustickets.domain;

import com.k4ktyc.bustickets.domain.dto.TripDto;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "trips")
@Getter @Setter
public class Trip {

    @Id @GeneratedValue(generator = "optimized-sequence")
    private long id;

    @ManyToOne
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "bus_id", nullable = false)
    private Bus bus;


    public Trip() {}

    public Trip(TripDto tripDto) {
        this.bus = new Bus(tripDto.getBus());
        this.bus.setTrip(this);
    }
}
