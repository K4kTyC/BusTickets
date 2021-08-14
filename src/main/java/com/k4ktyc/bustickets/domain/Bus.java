package com.k4ktyc.bustickets.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "buses")
@Getter
@Setter
public class Bus {

    @Id
    @GeneratedValue(generator = "optimized-sequence")
    private long id;

    @Column(unique = true)
    private int number;

    @ManyToOne
    @JoinColumn(name = "model_id", nullable = false)
    private BusModel model;

    @OneToMany(mappedBy = "bus")
    private List<Trip> trips;

}
