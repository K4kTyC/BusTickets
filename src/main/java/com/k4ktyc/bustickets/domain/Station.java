package com.k4ktyc.bustickets.domain;

import com.k4ktyc.bustickets.domain.dto.StationDto;
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

    @Column(unique = true)
    private String name;

    @OneToMany(mappedBy = "station")
    private List<RouteStation> routes;


    public Station() {}

    public Station(StationDto stationDto) {
        this.name = stationDto.getName();
    }
}
