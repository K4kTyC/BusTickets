package com.k4ktyc.bustickets.model;

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

    private String status;

    @ManyToOne
    @JoinColumn(name = "bus_id", nullable = false, updatable = false)
    private Bus bus;
}
