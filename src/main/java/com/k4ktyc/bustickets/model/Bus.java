package com.k4ktyc.bustickets.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
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

    @OneToMany(mappedBy = "bus", cascade = CascadeType.ALL)
    private List<Seat> seats = new ArrayList<>();

    public Bus() {}

    public Bus(BusDto busDto) {
        this.number = busDto.getNumber();
        this.busClass = busDto.getBusClass() == 1 ? "Regular" : "Business";
        for (int i = 0; i < busDto.getNumberOfSeats(); i++) {
            seats.add(new Seat(i + 1, this));
        }
    }
}
