package com.k4ktyc.bustickets.domain;

import com.k4ktyc.bustickets.domain.dto.TripDto;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "trips")
@Getter @Setter
public class Trip {

    @Id @GeneratedValue
    private long id;

    @ManyToOne
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    @ManyToOne
    @JoinColumn(name = "station_start_id", nullable = false)
    private Station stationStart;

    @ManyToOne
    @JoinColumn(name = "station_finish_id", nullable = false)
    private Station stationFinish;

    private LocalDateTime datetimeStart;
    private LocalDateTime datetimeFinish;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "bus_id", nullable = false)
    private Bus bus;

    private long price;


    public Trip() {}

    public Trip(TripDto tripDto) {
        this.bus = new Bus(tripDto.getBus());
        this.bus.setTrip(this);
        this.stationStart = new Station(tripDto.getStationStart());
        this.stationFinish = new Station(tripDto.getStationFinish());
        this.datetimeStart = tripDto.getDatetimeStart();
        this.datetimeFinish = tripDto.getDatetimeFinish();
        this.price = tripDto.getPrice();
    }
}
