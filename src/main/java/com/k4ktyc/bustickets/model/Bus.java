package com.k4ktyc.bustickets.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "buses")
@Getter @Setter
public class Bus {

    @Id @GeneratedValue
    private long id;

    @OneToOne(mappedBy = "bus")
    private Trip trip;

    private int number;

    private String busClass;

    @OneToMany(mappedBy = "bus")
    private List<Seat> seats;
}
