package com.k4ktyc.bustickets.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "seats")
@Getter @Setter
public class Seat {

    @Id @GeneratedValue
    private long id;

    private int number;

    private boolean isFree = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bus_id", nullable = false, updatable = false)
    private Bus bus;

    public Seat() {}

    public Seat(int number, Bus bus) {
        this.number = number;
        this.bus = bus;
    }
}
