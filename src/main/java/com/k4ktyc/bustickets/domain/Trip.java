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

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "bus_id", nullable = false)
    private Bus bus;

    private String stationStart;
    private String stationFinish;

    private LocalDateTime datetimeStart;
    private LocalDateTime datetimeFinish;

    private int price;

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
