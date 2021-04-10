package com.k4ktyc.bustickets.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "routes")
@Getter @Setter
public class Route {

    @Id @GeneratedValue
    private long id;

    @OneToMany(mappedBy = "route")
    private List<Station> stations;

    @OneToMany(mappedBy = "route")
    private List<Trip> trips;
}
