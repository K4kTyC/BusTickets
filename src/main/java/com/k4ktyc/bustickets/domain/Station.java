package com.k4ktyc.bustickets.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "stations")
@Getter @Setter
public class Station {

    @Id @GeneratedValue
    private long id;

    private String name;

    @OneToMany(mappedBy = "station")
    private List<RouteStation> routes;
}
