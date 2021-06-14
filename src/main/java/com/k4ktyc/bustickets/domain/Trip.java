package com.k4ktyc.bustickets.domain;

import com.k4ktyc.bustickets.domain.dto.NewTripDto;
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

    public Trip(NewTripDto newTripDto) {
        this.bus = new Bus(newTripDto.getBus());
        this.bus.setTrip(this);
        this.stationStart = newTripDto.getStationStart();
        this.stationFinish = newTripDto.getStationFinish();
        this.datetimeStart = newTripDto.getDatetimeStart();
        this.datetimeFinish = newTripDto.getDatetimeFinish();
        this.price = newTripDto.getPrice();
    }
}
