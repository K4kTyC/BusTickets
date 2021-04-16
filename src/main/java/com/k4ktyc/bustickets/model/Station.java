package com.k4ktyc.bustickets.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stations")
@Getter @Setter
public class Station {

    @Id @GeneratedValue
    private long id;

    private String name;

    private LocalDateTime datetimeFrom;

    private LocalDateTime datetimeTo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false, updatable = false)
    private Route route;

    public Station() {}

    public Station(NewStationDto newStationDto) {
        this.name = newStationDto.getName();
        this.datetimeFrom = newStationDto.getDatetimeFrom();
        this.datetimeTo = newStationDto.getDatetimeTo();
    }
}
