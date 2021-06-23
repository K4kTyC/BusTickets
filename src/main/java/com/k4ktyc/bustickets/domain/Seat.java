package com.k4ktyc.bustickets.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "seats")
@Getter @Setter
public class Seat {

    @Id @GeneratedValue(generator = "optimized-sequence")
    private long id;

    private int number;

    private boolean isFree = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false, updatable = false)
    private Trip trip;


    public Seat() {}

    public Seat(int number, Trip trip) {
        this.number = number;
        this.trip = trip;
    }
}
