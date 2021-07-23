package com.k4ktyc.bustickets.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "routes")
@Getter @Setter
public class Route {

    @Id @GeneratedValue(generator = "optimized-sequence")
    private long id;

    private String name;

    @OneToMany(mappedBy = "route")
    private List<RouteStation> stations;

    private long price;

}
