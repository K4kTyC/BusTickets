package com.k4ktyc.bustickets.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "bus_model")
@Getter @Setter
public class BusModel {

    @Id @GeneratedValue
    private long id;

    private String name;

    private int numberOfSeats;

    @ManyToOne
    @JoinColumn(name = "class_id", nullable = false)
    private BusClass busClass;
}
